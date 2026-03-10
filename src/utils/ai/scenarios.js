/**
 * AI 写作场景配置（向后兼容）
 * 预设常用的写作场景和对应的提示词模板
 */

import { AI_SCENARIOS, getScenarioLabel as _getScenarioLabel, getScenarioPrompt as _getScenarioPrompt } from './scenarios/config'

// 保持原有的导出接口以确保向后兼容
export { AI_SCENARIOS }

/**
 * 根据场景ID获取场景配置
 */
export function getScenarioById(id) {
  return AI_SCENARIOS.find(s => s.id === id)
}

/**
 * 获取场景标签（需要通过 i18n 获取）
 * @param {string} id - 场景ID
 * @param {Function} t - i18n t函数
 */
export function getScenarioLabel(id, t) {
  return _getScenarioLabel(id, t)
}

/**
 * 获取场景提示词（需要通过 i18n 获取）
 * @param {string} id - 场景ID
 * @param {Function} t - i18n t函数
 */
export function getScenarioPrompt(id, t) {
  return _getScenarioPrompt(id, t)
}
