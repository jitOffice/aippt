// Centralized prompts for AI Quick Rewrite operations

export type RewriteOp =
  | 'polish'
  | 'expand'
  | 'shrink'
  | 'correct'
  | 'formal'
  | 'casual'
  | 'toEn'
  | 'toZh'
  | 'summarize'
  | 'custom'

export const REWRITE_OP_OPTIONS: Array<{ label: string; value: RewriteOp }> = [
  { label: '润色', value: 'polish' },
  { label: '扩写', value: 'expand' },
  { label: '精简', value: 'shrink' },
  { label: '纠错', value: 'correct' },
  { label: '总结要点', value: 'summarize' },
  { label: '更正式', value: 'formal' },
  { label: '更口语', value: 'casual' },
  { label: '翻译为英文', value: 'toEn' },
  { label: '翻译为中文', value: 'toZh' },
  { label: '自定义', value: 'custom' },
]

export const BASE_INSTRUCTIONS: Record<string, string> = {
  polish: '按“润色”要求：仅优化措辞、语气与语法，不新增事实或段落。',
  expand: '按“扩写”要求：在不改变原意下，适度补充细节与解释，不杜撰具体数据或引用。',
  shrink: '按“精简”要求：压缩表达，仅保留要点，删除重复与赘述。',
  correct: '按“纠错”要求：只修正语病、错别字和逻辑不顺，不改变原意。',
  formal: '将语气调整为更正式/学术风格，不改变信息。',
  casual: '将语气调整为更口语自然的风格，不改变信息。',
  toEn: '把以下中文内容翻译成英文，保持 Markdown 结构与术语准确。',
  toZh: '把以下英文内容翻译成中文，保持 Markdown 结构与术语准确。',
  summarize: '将以下内容总结为要点列表（不引入新信息）。',
}

export function buildUserInstruction(op: RewriteOp, customInstruction?: string): string {
  if (op === 'custom' && customInstruction?.trim()) return customInstruction.trim() + '\n\n'
  const t = BASE_INSTRUCTIONS[op] || '请根据指令改写以下文本。'
  return t + '\n\n'
}

export function buildSystemPrompt(op: RewriteOp): string {
  const common = [
    '你是严格遵循指令的改写助手，只输出重写后的 Markdown 内容，不要任何解释、前后缀、代码块包裹或分割线。',
    '保持原有语言种类、术语与专有名词、段落与列表结构、行内代码、链接、粗斜体等 Markdown 格式。',
    '不得凭空编造事实、数据或参考资料；如原文无信息，仅优化表达。',
    '不要新增或变更标题层级；除非原文存在，禁止输出水平分割线或额外标题。',
  ]
  const rules: Partial<Record<RewriteOp, string[]>> = {
    polish: ['长度控制在原文的 90%~110%。'],
    correct: ['仅做最小必要修改，长度控制在原文的 95%~105%。'],
    shrink: ['将长度压缩到原文的 50%~70%，保留关键信息与逻辑。'],
    expand: [
      '在不改变结构的情况下，扩展到原文的 130%~180%。',
      '可补充背景/原因/举例，但不引入具体可核查数字或引用。',
    ],
    formal: ['长度 90%~110%，语气更正式/学术。'],
    casual: ['长度 90%~110%，语气更口语自然。'],
    toEn: ['保持术语准确与专有名词大小写，保留 Markdown 结构。'],
    toZh: ['保持术语准确与专有名词，保留 Markdown 结构。'],
    summarize: ['输出为 Markdown 无序列表，3~8 条要点；不要额外段落或标题。'],
    custom: [],
  }
  return [...common, ...(rules[op] || [])].join('\n')
}

