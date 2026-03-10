/**
 * Convert a paginated ProseMirror/Tiptap JSON document (doc -> page* -> pageBody -> block*)
 * into a semantic document (doc -> block*).
 *
 * Goals:
 * - Remove pagination container nodes: page/pageBody/pageHeader/pageFooter
 * - Merge continued textblocks split by pagination (paragraph/heading)
 * - Strip pagination-only attrs (e.g. attrs.continued) to keep stored/exported JSON clean
 *
 * This is intentionally schema-agnostic and operates on plain JSON objects.
 */

const PAGE_TYPE = 'page'
const PAGE_BODY_TYPE = 'pageBody'
const PAGE_HEADER_TYPE = 'pageHeader'
const PAGE_FOOTER_TYPE = 'pageFooter'

function isObject(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function getArray(v) {
  return Array.isArray(v) ? v : []
}

function extractPageBodyBlocks(pageNode) {
  const children = getArray(pageNode?.content)
  const body = children.find((n) => isObject(n) && n.type === PAGE_BODY_TYPE)
  if (body && Array.isArray(body.content)) {
    return body.content
  }

  // Fallback: collect everything except header/footer; if pageBody exists but has no content, skip it.
  const blocks = []
  for (const child of children) {
    if (!isObject(child)) continue
    if (child.type === PAGE_HEADER_TYPE || child.type === PAGE_FOOTER_TYPE) continue
    if (child.type === PAGE_BODY_TYPE) {
      blocks.push(...getArray(child.content))
      continue
    }
    blocks.push(child)
  }
  return blocks
}

function stripContinuedAttrInPlace(node) {
  if (Array.isArray(node)) {
    for (const item of node) stripContinuedAttrInPlace(item)
    return
  }
  if (!isObject(node)) return

  if (isObject(node.attrs) && Object.prototype.hasOwnProperty.call(node.attrs, 'continued')) {
    delete node.attrs.continued
    if (Object.keys(node.attrs).length === 0) delete node.attrs
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) stripContinuedAttrInPlace(child)
  }
}

function canMergeContinued(prev, cur) {
  if (!isObject(prev) || !isObject(cur)) return false
  if (prev.type !== cur.type) return false
  if (!Array.isArray(prev.content) || !Array.isArray(cur.content)) return false
  if (prev.type === 'heading') {
    const prevLevel = prev.attrs?.level
    const curLevel = cur.attrs?.level
    if (prevLevel != null && curLevel != null && prevLevel !== curLevel) return false
  }
  return true
}

function mergeContinuedBlocksInPlace(blocks) {
  const out = []
  for (const node of blocks) {
    const continued = !!node?.attrs?.continued
    if (continued && out.length > 0) {
      const prev = out[out.length - 1]
      if (canMergeContinued(prev, node)) {
        prev.content.push(...node.content)
        continue
      }
    }
    out.push(node)
  }
  return out
}

export function toSemanticDoc(doc) {
  if (!isObject(doc)) return doc

  const top = getArray(doc.content)
  if (top.length === 0) return doc

  const blocks = []
  for (const node of top) {
    if (isObject(node) && node.type === PAGE_TYPE) {
      blocks.push(...extractPageBodyBlocks(node))
    } else {
      blocks.push(node)
    }
  }

  const merged = mergeContinuedBlocksInPlace(blocks)
  const out = { ...doc, type: doc.type || 'doc', content: merged }

  // Remove pagination-only attrs everywhere to keep stored/exported content clean.
  stripContinuedAttrInPlace(out)
  return out
}

