import { diffArrays, diffWords } from 'diff'

const MARK_ADD = 'history_add'
const MARK_DEL = 'history_del'
const INLINE_DIFF_MAX_CHARS = 8000
const SPLIT_LEFT_SENTINEL = '__split_left__'
const WIDGET_NODE_TYPES = new Set([
  'chart',
  'mindmap',
  'flowchart',
  'mermaid',
  'latex',
  'datetime',
  'separator',
  'image',
  'audio',
  'video',
  'iframe',
  'attachment',
  'gov-template',
  'official-engine',
])

type PMNode = any
type PMDoc = { type: string; content?: PMNode[]; [key: string]: any }

function isObject(v: unknown): v is Record<string, any> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function normalizeForCompare(node: any): any {
  if (!isObject(node) && !Array.isArray(node)) return node
  if (Array.isArray(node)) return node.map(normalizeForCompare)
  const out: any = {}
  for (const [k, v] of Object.entries(node)) {
    if (k === 'attrs' && isObject(v)) {
      const attrs: any = {}
      for (const [ak, av] of Object.entries(v)) {
        if (ak === 'id' || ak === 'uid' || ak === 'uuid' || ak === 'clientId' || ak === 'tabId') continue
        if (av === undefined) continue
        attrs[ak] = normalizeForCompare(av)
      }
      if (Object.keys(attrs).length > 0) out.attrs = attrs
      continue
    }
    out[k] = normalizeForCompare(v)
  }
  return out
}

function getArray(v: any): any[] {
  return Array.isArray(v) ? v : []
}

function addMarkToTextNode(textNode: any, markType: string) {
  if (!textNode || textNode.type !== 'text') return textNode
  const marks = Array.isArray(textNode.marks) ? [...textNode.marks] : []
  if (!marks.some((m) => m && m.type === markType)) {
    marks.push({ type: markType })
  }
  return { ...textNode, marks }
}

function addMarkToTextNodeWithAttrs(textNode: any, markType: string, attrs?: Record<string, any>) {
  if (!attrs || !isObject(attrs)) return addMarkToTextNode(textNode, markType)
  if (!textNode || textNode.type !== 'text') return textNode
  const marks = Array.isArray(textNode.marks) ? [...textNode.marks] : []
  if (!marks.some((m) => m && m.type === markType)) {
    marks.push({ type: markType, attrs })
  }
  return { ...textNode, marks }
}

function stableStringify(v: any): string {
  const walk = (x: any): any => {
    if (x === null || x === undefined) return x
    if (Array.isArray(x)) return x.map(walk)
    if (!isObject(x)) return x
    const out: any = {}
    for (const k of Object.keys(x).sort()) {
      const vv = (x as any)[k]
      if (vv === undefined) continue
      out[k] = walk(vv)
    }
    return out
  }
  try {
    return JSON.stringify(walk(v))
  } catch {
    return ''
  }
}

function hashStringToKey(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i)
  return (h >>> 0).toString(36)
}

function isWidgetNode(node: any): boolean {
  const t = String(node?.type || '')
  return WIDGET_NODE_TYPES.has(t)
}

function markNodeDeep(node: any, markType: string, depth = 0): any {
  if (!isObject(node)) return node
  if (node.type === 'text') return addMarkToTextNode(node, markType)
  const out: any = { ...node }
  if (depth === 0 && isWidgetNode(out) && (markType === MARK_ADD || markType === MARK_DEL)) {
    const op = markType === MARK_ADD ? 'add' : 'del'
    const attrs = isObject(out.attrs) ? out.attrs : {}
    out.attrs = { ...attrs, historyDiff: op }
  }
  if (Array.isArray(node.content)) {
    out.content = node.content.map((child: any) => markNodeDeep(child, markType, depth + 1))
  }

  // Empty paragraphs/headings don't have text nodes so marks are invisible.
  // Inject a tiny placeholder so the mark can be rendered (and auto-scroll can find it).
  if ((markType === MARK_ADD || markType === MARK_DEL) && (out.type === 'paragraph' || out.type === 'heading')) {
    const content = getArray(out.content)
    const hasText = content.some((n) => isObject(n) && n.type === 'text' && typeof n.text === 'string' && n.text.trim() !== '')
    if (!hasText) {
      out.content = [...content, addMarkToTextNodeWithAttrs({ type: 'text', text: ' ' }, markType, { placeholder: true })]
    }
  }

  return out
}

function extractPlainText(node: any): string {
  const parts: string[] = []
  const walk = (n: any) => {
    if (!n) return
    if (typeof n.text === 'string') parts.push(n.text)
    for (const c of getArray(n.content)) walk(c)
    if (n.type === 'paragraph' || n.type === 'heading' || n.type === 'listItem') parts.push('\n')
  }
  walk(node)
  return parts.join('')
}

function getBlockKey(node: any): string {
  const type = String(node?.type || '')
  const id = node?.attrs?.id ? String(node.attrs.id) : ''
  if (type && id) return `${type}#${id}`
  if (type && WIDGET_NODE_TYPES.has(type)) {
    const attrsKey = hashStringToKey(stableStringify(normalizeForCompare(node?.attrs || null)))
    return `${type}@${attrsKey}`
  }
  const level = node?.attrs?.level != null ? `:${node.attrs.level}` : ''
  const text = extractPlainText(node).replace(/\s+/g, ' ').trim().slice(0, 64)
  return `${type}${level}:${text}`
}

function getStableIdKey(node: any): string | null {
  const type = String(node?.type || '')
  const id = node?.attrs?.id ? String(node.attrs.id) : ''
  if (!type || !id) return null
  return `${type}#${id}`
}

function normalizeMatchText(text: string): string {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

function getBlockMatchText(node: any): string {
  if (!node) return ''
  if (isInlineDiffSupported(node)) return normalizeMatchText(runsToText(flattenRuns(node)))
  return normalizeMatchText(extractPlainText(node))
}

function buildAfterKeysWithSplitFix(baseBlocks: any[], afterBlocks: any[]): string[] {
  // Fix a common UX issue:
  // When a paragraph is split at the start (Enter at offset 0), many ID plugins keep the original `attrs.id`
  // on the *left* fragment (often empty/new text) and assign a new id to the right fragment (original text).
  // If we match blocks purely by `type#id`, diff will show "delete old line + add old line".
  // Heuristic: if after[i] keeps base id but after[i+1] (new id) still equals base text, treat after[i+1] as the match.

  const baseTextByStableKey = new Map<string, string>()
  const baseStableKeys = new Set<string>()
  for (const b of baseBlocks) {
    const stable = getStableIdKey(b)
    if (!stable) continue
    baseStableKeys.add(stable)
    if (b?.type !== 'paragraph' && b?.type !== 'heading') continue
    const text = getBlockMatchText(b)
    if (text) baseTextByStableKey.set(stable, text)
  }

  const keys = afterBlocks.map(getBlockKey)
  const remapped = new Set<string>()

  for (let i = 0; i < afterBlocks.length - 1; i++) {
    const a = afterBlocks[i]
    if (!a || (a.type !== 'paragraph' && a.type !== 'heading')) continue
    const stable = getStableIdKey(a)
    if (!stable) continue
    if (remapped.has(stable)) continue
    const baseText = baseTextByStableKey.get(stable)
    if (!baseText) continue

    const aText = getBlockMatchText(a)
    if (aText === baseText) continue

    const next = afterBlocks[i + 1]
    if (!next || next.type !== a.type) continue

    const nextStable = getStableIdKey(next)
    if (nextStable && baseStableKeys.has(nextStable)) continue

    const nextText = getBlockMatchText(next)
    if (nextText !== baseText) continue

    // Move the stable key to the next block; make current key unique so it becomes an insertion.
    keys[i] = `${SPLIT_LEFT_SENTINEL}:${stable}:${i}`
    keys[i + 1] = stable
    remapped.add(stable)
    i++
  }

  return keys
}

function isInlineDiffSupported(block: any): boolean {
  const content = getArray(block?.content)
  return content.every((n) => isObject(n) && (n.type === 'text' || n.type === 'hardBreak'))
}

type TextRun =
  | { kind: 'text'; text: string; marks?: any[] }
  | { kind: 'hardBreak' }

function flattenRuns(block: any): TextRun[] {
  const runs: TextRun[] = []
  for (const n of getArray(block?.content)) {
    if (!isObject(n)) continue
    if (n.type === 'text') {
      const text = typeof n.text === 'string' ? n.text : ''
      if (!text) continue
      runs.push({ kind: 'text', text, marks: Array.isArray(n.marks) ? n.marks : undefined })
      continue
    }
    if (n.type === 'hardBreak') {
      runs.push({ kind: 'hardBreak' })
    }
  }
  return runs
}

function runsToText(runs: TextRun[]): string {
  return runs
    .map((r) => (r.kind === 'hardBreak' ? '\n' : r.text))
    .join('')
}

function consumeRuns(runs: TextRun[], len: number): any[] {
  const out: any[] = []
  let remaining = Math.max(0, Math.floor(len))

  while (remaining > 0 && runs.length > 0) {
    const r = runs[0]
    if (r.kind === 'hardBreak') {
      out.push({ type: 'hardBreak' })
      runs.shift()
      remaining -= 1
      continue
    }

    const take = Math.min(remaining, r.text.length)
    const chunk = r.text.slice(0, take)
    if (chunk) {
      const node: any = { type: 'text', text: chunk }
      // Safe to share marks (immutable input); we never mutate mark objects in-place.
      if (Array.isArray(r.marks) && r.marks.length > 0) node.marks = r.marks
      out.push(node)
    }
    r.text = r.text.slice(take)
    remaining -= take
    if (r.text.length === 0) runs.shift()
  }

  return out
}

function textToInlineNodes(text: string, markType?: string): any[] {
  if (!text) return []
  const out: any[] = []
  const parts = String(text).split('\n')
  parts.forEach((p, idx) => {
    if (p) {
      const node: any = { type: 'text', text: p }
      out.push(markType ? addMarkToTextNode(node, markType) : node)
    }
    if (idx < parts.length - 1) out.push({ type: 'hardBreak' })
  })
  return out
}

function addMarkToInlineNodes(nodes: any[], markType: string): any[] {
  return nodes.map((n) => {
    if (!isObject(n)) return n
    if (n.type === 'text') return addMarkToTextNode(n, markType)
    return n
  })
}

function deepEqual(a: any, b: any): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

function diffTextBlock(baseBlock: any, afterBlock: any): any {
  const baseRuns = flattenRuns(baseBlock)
  const afterRuns = flattenRuns(afterBlock)

  const baseText = runsToText(baseRuns)
  const afterText = runsToText(afterRuns)

  // No text changes: keep as-is.
  if (baseText === afterText) {
    if (deepEqual(normalizeForCompare(baseBlock), normalizeForCompare(afterBlock))) return afterBlock
    return [markNodeDeep(baseBlock, MARK_DEL), markNodeDeep(afterBlock, MARK_ADD)]
  }

  // Guard: very large textblocks can make word-diff too slow; fall back to block-level diff.
  if (baseText.length > INLINE_DIFF_MAX_CHARS || afterText.length > INLINE_DIFF_MAX_CHARS) {
    return [markNodeDeep(baseBlock, MARK_DEL), markNodeDeep(afterBlock, MARK_ADD)]
  }

  // Build a mixed inline list: unchanged + additions + deletions (as strike-through text).
  const mixed: any[] = []
  const diffs = diffWords(baseText, afterText) || []

  for (const part of diffs) {
    const value = String(part.value || '')
    if (!value) continue

    if ((part as any).added) {
      const nodes = consumeRuns(afterRuns, value.length)
      mixed.push(...addMarkToInlineNodes(nodes, MARK_ADD))
      continue
    }

    if ((part as any).removed) {
      mixed.push(...textToInlineNodes(value, MARK_DEL))
      continue
    }

    // unchanged
    mixed.push(...consumeRuns(afterRuns, value.length))
  }

  return {
    ...afterBlock,
    content: mixed.filter((n) => !(isObject(n) && n.type === 'text' && !n.text)),
  }
}

function diffBlock(baseNode: any, afterNode: any): any[] | any {
  if (deepEqual(baseNode, afterNode)) return afterNode

  // Try inline diff for simple textblocks (paragraph/heading in semanticDoc).
  if (isInlineDiffSupported(baseNode) && isInlineDiffSupported(afterNode)) {
    return diffTextBlock(baseNode, afterNode)
  }

  // Fallback: treat as replaced block.
  return [markNodeDeep(baseNode, MARK_DEL), markNodeDeep(afterNode, MARK_ADD)]
}

export function buildEditHistoryDiffDoc(baseDoc: PMDoc | null | undefined, afterDoc: PMDoc): PMDoc {
  const safeBase: PMDoc = isObject(baseDoc) ? (baseDoc as any) : { type: 'doc', content: [] }
  const safeAfter: PMDoc = isObject(afterDoc) ? (afterDoc as any) : { type: 'doc', content: [] }

  const baseBlocks = getArray(safeBase.content)
  const afterBlocks = getArray(safeAfter.content)

  const baseKeys = baseBlocks.map(getBlockKey)
  const afterKeys = buildAfterKeysWithSplitFix(baseBlocks, afterBlocks)
  const parts = diffArrays(baseKeys, afterKeys)

  const outBlocks: any[] = []
  let bi = 0
  let ai = 0

  for (const part of parts) {
    const values = Array.isArray(part.value) ? part.value : []
    if (part.added) {
      for (let i = 0; i < values.length; i++) {
        outBlocks.push(markNodeDeep(afterBlocks[ai++], MARK_ADD))
      }
      continue
    }
    if (part.removed) {
      for (let i = 0; i < values.length; i++) {
        outBlocks.push(markNodeDeep(baseBlocks[bi++], MARK_DEL))
      }
      continue
    }

    for (let i = 0; i < values.length; i++) {
      const baseNode = baseBlocks[bi++]
      const afterNode = afterBlocks[ai++]
      const r = diffBlock(baseNode, afterNode)
      if (Array.isArray(r)) outBlocks.push(...r)
      else outBlocks.push(r)
    }
  }

  const result: PMDoc = {
    ...safeAfter,
    type: 'doc',
    content: outBlocks,
  }

  const hasHistoryMarks = (node: any): boolean => {
    if (!node) return false
    if (Array.isArray(node)) return node.some(hasHistoryMarks)
    if (!isObject(node)) return false
    const marks = Array.isArray((node as any).marks) ? (node as any).marks : []
    if (marks.some((m: any) => isObject(m) && (m.type === MARK_ADD || m.type === MARK_DEL))) return true
    const content = getArray((node as any).content)
    return content.some(hasHistoryMarks)
  }

  if (!hasHistoryMarks(result) && !deepEqual(normalizeForCompare(safeBase), normalizeForCompare(safeAfter))) {
    result.content = getArray(result.content).map((b: any) => markNodeDeep(b, MARK_ADD))
  }

  return result
}

