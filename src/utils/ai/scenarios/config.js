/**
 * AI 写作场景配置
 * 预设常用的写作场景和对应的提示词模板
 */

// 场景分类
export const SCENARIO_CATEGORIES = {
  CREATE: 'create',     // 创作类
  EDIT: 'edit',         // 编辑类
  FORMAT: 'format',     // 格式类
  BUSINESS: 'business'  // 商务类
}

// 所有场景配置
export const AI_SCENARIOS = [
  // === 创作类场景 ===
  {
    id: 'continue',
    category: SCENARIO_CATEGORIES.CREATE,
    label: '续写',
    label_en: 'Continue',
    icon: '✍️',
    color: '22, 93, 255',
    prompt: '请根据上文内容继续写作，保持风格一致，内容连贯自然。',
    prompt_en: 'Please continue writing based on the previous content, maintaining consistent style and coherent narrative.'
  },
  {
    id: 'outline',
    category: SCENARIO_CATEGORIES.CREATE,
    label: '大纲',
    label_en: 'Outline',
    icon: '📋',
    color: '114, 46, 209',
    prompt: '请为以下内容生成结构化大纲，包含一级、二级标题和关键要点。',
    prompt_en: 'Please generate a structured outline for the following content, including primary and secondary headings with key points.'
  },
  {
    id: 'brainstorm',
    category: SCENARIO_CATEGORIES.CREATE,
    label: '头脑风暴',
    label_en: 'Brainstorm',
    icon: '💡',
    color: '245, 154, 35',
    prompt: '请围绕这个主题进行头脑风暴，提供多个创意角度和想法。',
    prompt_en: 'Please brainstorm around this topic, providing multiple creative angles and ideas.'
  },
  {
    id: 'blog',
    category: SCENARIO_CATEGORIES.CREATE,
    label: '博客',
    label_en: 'Blog',
    icon: '📰',
    color: '51, 102, 255',
    prompt: '请撰写一篇博客文章，包含：引人入胜的开头、清晰的结构、实用的内容、总结与号召。',
    prompt_en: 'Please write a blog post, including: engaging introduction, clear structure, practical content, and conclusion with call to action.'
  },

  // === 编辑类场景 ===
  {
    id: 'summary',
    category: SCENARIO_CATEGORIES.EDIT,
    label: '总结',
    label_en: 'Summary',
    icon: '📝',
    color: '0, 185, 107',
    prompt: '请对以下内容进行总结，提取核心要点，简洁清晰。',
    prompt_en: 'Please summarize the following content, extracting core points in a clear and concise manner.'
  },
  {
    id: 'expand',
    category: SCENARIO_CATEGORIES.EDIT,
    label: '扩写',
    label_en: 'Expand',
    icon: '📖',
    color: '19, 194, 194',
    prompt: '请对以下内容进行扩写，增加细节、例子和深度分析，使内容更加丰富。',
    prompt_en: 'Please expand on the following content, adding details, examples, and in-depth analysis to enrich the material.'
  },
  {
    id: 'polish',
    category: SCENARIO_CATEGORIES.EDIT,
    label: '润色',
    label_en: 'Polish',
    icon: '✨',
    color: '235, 47, 150',
    prompt: '请对以下内容进行润色，优化表达方式，使语言更加流畅专业。',
    prompt_en: 'Please polish the following content, optimizing the expression to make the language more fluent and professional.'
  },

  // === 格式类场景 ===
  {
    id: 'weekly_report',
    category: SCENARIO_CATEGORIES.FORMAT,
    label: '周报',
    label_en: 'Weekly Report',
    icon: '📊',
    color: '134, 144, 156',
    prompt: '请撰写本周工作周报，包含：本周工作概述、关键成果、问题与风险、下周计划。',
    prompt_en: 'Please write a weekly work report, including: work overview, key achievements, issues and risks, and next week\'s plans.'
  },

  // === 商务类场景 ===
  {
    id: 'business_plan',
    category: SCENARIO_CATEGORIES.BUSINESS,
    label: '商业计划',
    label_en: 'Business Plan',
    icon: '💼',
    color: '255, 165, 0',
    prompt: '请生成一份商业计划书，包含：执行摘要、公司描述、市场分析、组织管理、产品服务、营销策略、财务预测。',
    prompt_en: 'Please generate a business plan including: executive summary, company description, market analysis, organization management, products/services, marketing strategy, financial projections.'
  },
  {
    id: 'proposal',
    category: SCENARIO_CATEGORIES.BUSINESS,
    label: '提案',
    label_en: 'Proposal',
    icon: '📄',
    color: '70, 130, 180',
    prompt: '请撰写一份项目提案，包含：背景介绍、问题陈述、解决方案、实施计划、预算估算、预期成果。',
    prompt_en: 'Please write a project proposal including: background introduction, problem statement, proposed solution, implementation plan, budget estimate, expected outcomes.'
  }
]

// 分类配置
export const SCENARIO_CATEGORY_CONFIG = {
  [SCENARIO_CATEGORIES.CREATE]: {
    label: '创作',
    label_en: 'Create',
    icon: '✒️'
  },
  [SCENARIO_CATEGORIES.EDIT]: {
    label: '编辑',
    label_en: 'Edit',
    icon: '✂️'
  },
  [SCENARIO_CATEGORIES.FORMAT]: {
    label: '格式',
    label_en: 'Format',
    icon: '📋'
  },
  [SCENARIO_CATEGORIES.BUSINESS]: {
    label: '商务',
    label_en: 'Business',
    icon: '💼'
  }
}

/**
 * 根据场景ID获取场景配置
 */
export function getScenarioById(id) {
  return AI_SCENARIOS.find(s => s.id === id)
}

/**
 * 根据分类获取场景列表
 */
export function getScenariosByCategory(category) {
  return AI_SCENARIOS.filter(s => s.category === category)
}

/**
 * 获取所有分类
 */
export function getAllCategories() {
  return Object.keys(SCENARIO_CATEGORY_CONFIG)
}

/**
 * 搜索场景（支持模糊搜索）
 */
export function searchScenarios(keyword, language = 'zh') {
  if (!keyword) return AI_SCENARIOS
  
  const lowerKeyword = keyword.toLowerCase()
  return AI_SCENARIOS.filter(scenario => {
    const label = language === 'en' ? scenario.label_en : scenario.label
    const prompt = language === 'en' ? scenario.prompt_en : scenario.prompt
    return (
      label.toLowerCase().includes(lowerKeyword) ||
      prompt.toLowerCase().includes(lowerKeyword)
    )
  })
}

/**
 * 获取场景标签
 */
export function getScenarioLabel(id, language = 'zh') {
  const scenario = getScenarioById(id)
  return language === 'en' ? scenario?.label_en : scenario?.label
}

/**
 * 获取场景提示词
 */
export function getScenarioPrompt(id, language = 'zh') {
  const scenario = getScenarioById(id)
  return language === 'en' ? scenario?.prompt_en : scenario?.prompt
}

/**
 * 获取分类标签
 */
export function getCategoryLabel(category, language = 'zh') {
  const config = SCENARIO_CATEGORY_CONFIG[category]
  return language === 'en' ? config?.label_en : config?.label
}

/**
 * 获取分类图标
 */
export function getCategoryIcon(category) {
  return SCENARIO_CATEGORY_CONFIG[category]?.icon || '📁'
}
