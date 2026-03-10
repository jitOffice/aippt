/**
 * MathML到OMML转换辅助函数
 */

import { SPECIAL_CHARS, NARY_OPERATORS, LATEX_TO_UNICODE } from './mappings.js'

/**
 * 转义XML特殊字符
 * @param {string} text - 要转义的文本
 * @returns {string} 转义后的文本
 */
export function escapeXml(text) {
  if (!text) return ''
  return text.replace(/[<>&"']/g, char => SPECIAL_CHARS[char] || char)
}

/**
 * 获取元素的文本内容
 * @param {Element} element - DOM元素
 * @returns {string} 文本内容
 */
export function getTextContent(element) {
  if (!element) return ''
  return element.textContent || ''
}

/**
 * 获取元素的所有子元素
 * @param {Element} element - DOM元素
 * @returns {Element[]} 子元素数组
 */
export function getChildren(element) {
  if (!element || !element.children) return []
  return Array.from(element.children)
}

/**
 * 检查元素是否为空
 * @param {Element} element - DOM元素
 * @returns {boolean} 是否为空
 */
export function isEmpty(element) {
  if (!element) return true
  const text = getTextContent(element).trim()
  return text === '' && getChildren(element).length === 0
}

/**
 * 检查文本是否为N元运算符
 * @param {string} text - 要检查的文本
 * @returns {Object|null} 运算符信息或null
 */
export function isNaryOperator(text) {
  if (!text) return null
  const trimmed = text.trim()
  
  // 直接检查Unicode符号
  if (NARY_OPERATORS[trimmed]) {
    return NARY_OPERATORS[trimmed]
  }
  
  // 检查LaTeX命令
  if (LATEX_TO_UNICODE[trimmed]) {
    const unicode = LATEX_TO_UNICODE[trimmed]
    return NARY_OPERATORS[unicode] || null
  }
  
  return null
}

/**
 * 检查元素是否包含N元运算符
 * @param {Element} element - DOM元素
 * @returns {Object|null} 运算符信息或null
 */
export function containsNaryOperator(element) {
  if (!element) return null
  
  // 检查元素自身的文本
  const text = getTextContent(element)
  const operator = isNaryOperator(text)
  if (operator) return operator
  
  // 检查第一个子元素（通常是mo元素）
  const firstChild = element.children[0]
  if (firstChild && firstChild.tagName === 'mo') {
    const childText = getTextContent(firstChild)
    return isNaryOperator(childText)
  }
  
  return null
}

/**
 * 创建OMML文本运行元素
 * @param {string} text - 文本内容
 * @param {Object} options - 选项
 * @returns {string} OMML XML字符串
 */
export function createTextRun(text, options = {}) {
  if (!text) return ''

  // 将文本按字符拆分，每个字符创建一个<m:r>元素
  // 这是Word OMML的要求
  const chars = text.split('')
  let xml = ''

  for (const char of chars) {
    if (!char) continue

    const escapedChar = escapeXml(char)
    xml += '<m:r>'

    // 添加Word字体属性（必须）
    xml += '<w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math"/></w:rPr>'

    // 添加数学属性（可选）
    if (options.style) {
      xml += '<m:rPr>'
      if (options.style.bold) xml += '<m:sty m:val="b"/>'
      if (options.style.italic) xml += '<m:sty m:val="i"/>'
      if (options.style.font) xml += `<m:nor m:val="${options.style.font}"/>`
      xml += '</m:rPr>'
    }

    // 添加文本，确保有xml:space="preserve"属性
    xml += `<m:t xml:space="preserve">${escapedChar}</m:t>`
    xml += '</m:r>'
  }

  return xml
}

/**
 * 创建OMML N元运算符元素
 * @param {Object} operator - 运算符信息
 * @param {string} sub - 下标内容
 * @param {string} sup - 上标内容
 * @param {string} base - 基础内容
 * @returns {string} OMML XML字符串
 */
export function createNaryElement(operator, sub, sup, base) {
  let xml = '<m:nary>'
  
  // 添加属性
  xml += '<m:naryPr>'
  xml += `<m:chr m:val="${operator.chr}"/>`
  xml += '<m:limLoc m:val="undOvr"/>'
  xml += '<m:grow m:val="1"/>'
  xml += `<m:subHide m:val="${sub ? 'off' : 'on'}"/>`
  xml += `<m:supHide m:val="${sup ? 'off' : 'on'}"/>`
  xml += '</m:naryPr>'
  
  // 添加下标
  xml += '<m:sub>'
  xml += sub || ''
  xml += '</m:sub>'
  
  // 添加上标
  xml += '<m:sup>'
  xml += sup || ''
  xml += '</m:sup>'
  
  // 添加基础内容
  xml += '<m:e>'
  xml += base || ''
  xml += '</m:e>'
  
  xml += '</m:nary>'
  
  return xml
}

/**
 * 创建OMML分式元素
 * @param {string} numerator - 分子
 * @param {string} denominator - 分母
 * @returns {string} OMML XML字符串
 */
export function createFractionElement(numerator, denominator) {
  let xml = '<m:f>'
  
  // 添加属性
  xml += '<m:fPr>'
  xml += '<m:type m:val="bar"/>'
  xml += '</m:fPr>'
  
  // 添加分子
  xml += '<m:num>'
  xml += numerator || ''
  xml += '</m:num>'
  
  // 添加分母
  xml += '<m:den>'
  xml += denominator || ''
  xml += '</m:den>'
  
  xml += '</m:f>'
  
  return xml
}

/**
 * 创建OMML上标元素
 * @param {string} base - 基础内容
 * @param {string} sup - 上标内容
 * @returns {string} OMML XML字符串
 */
export function createSuperscriptElement(base, sup) {
  let xml = '<m:sSup>'
  
  // 添加属性
  xml += '<m:sSupPr/>'
  
  // 添加基础内容
  xml += '<m:e>'
  xml += base || ''
  xml += '</m:e>'
  
  // 添加上标
  xml += '<m:sup>'
  xml += sup || ''
  xml += '</m:sup>'
  
  xml += '</m:sSup>'
  
  return xml
}

/**
 * 创建OMML下标元素
 * @param {string} base - 基础内容
 * @param {string} sub - 下标内容
 * @returns {string} OMML XML字符串
 */
export function createSubscriptElement(base, sub) {
  let xml = '<m:sSub>'
  
  // 添加属性
  xml += '<m:sSubPr/>'
  
  // 添加基础内容
  xml += '<m:e>'
  xml += base || ''
  xml += '</m:e>'
  
  // 添加下标
  xml += '<m:sub>'
  xml += sub || ''
  xml += '</m:sub>'
  
  xml += '</m:sSub>'
  
  return xml
}

/**
 * 创建OMML上下标元素
 * @param {string} base - 基础内容
 * @param {string} sub - 下标内容
 * @param {string} sup - 上标内容
 * @returns {string} OMML XML字符串
 */
export function createSubSuperscriptElement(base, sub, sup) {
  let xml = '<m:sSubSup>'
  
  // 添加属性
  xml += '<m:sSubSupPr/>'
  
  // 添加基础内容
  xml += '<m:e>'
  xml += base || ''
  xml += '</m:e>'
  
  // 添加下标
  xml += '<m:sub>'
  xml += sub || ''
  xml += '</m:sub>'
  
  // 添加上标
  xml += '<m:sup>'
  xml += sup || ''
  xml += '</m:sup>'
  
  xml += '</m:sSubSup>'
  
  return xml
}

/**
 * 创建OMML根式元素
 * @param {string} base - 被开方数
 * @param {string} degree - 根指数（可选）
 * @returns {string} OMML XML字符串
 */
export function createRadicalElement(base, degree = null) {
  let xml = '<m:rad>'
  
  // 添加属性
  xml += '<m:radPr>'
  xml += `<m:degHide m:val="${degree ? 'off' : 'on'}"/>`
  xml += '</m:radPr>'
  
  // 添加根指数
  xml += '<m:deg>'
  xml += degree || ''
  xml += '</m:deg>'
  
  // 添加被开方数
  xml += '<m:e>'
  xml += base || ''
  xml += '</m:e>'
  
  xml += '</m:rad>'
  
  return xml
}

/**
 * 创建OMML括号元素
 * @param {string} content - 内容
 * @param {string} open - 开始括号
 * @param {string} close - 结束括号
 * @returns {string} OMML XML字符串
 */
export function createDelimiterElement(content, open = '(', close = ')') {
  let xml = '<m:d>'
  
  // 添加属性
  xml += '<m:dPr>'
  xml += `<m:begChr m:val="${escapeXml(open)}"/>`
  xml += `<m:endChr m:val="${escapeXml(close)}"/>`
  xml += '<m:grow m:val="1"/>'
  xml += '<m:shp m:val="centered"/>'
  xml += '</m:dPr>'
  
  // 添加内容
  xml += '<m:e>'
  xml += content || ''
  xml += '</m:e>'
  
  xml += '</m:d>'
  
  return xml
}

