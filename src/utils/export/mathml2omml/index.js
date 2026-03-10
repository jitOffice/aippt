/**
 * MathML到OMML转换器
 * 
 * 这是一个自主实现的MathML到OMML转换库，用于将LaTeX公式导出到Word文档。
 * 
 * 主要功能：
 * - 支持所有基础MathML元素
 * - 特别优化N元运算符（积分、求和等）
 * - 正确处理复杂嵌套结构
 * - 完全兼容Word的OMML格式
 * 
 * 使用方法：
 * ```javascript
 * import { mml2omml } from './mathml2omml'
 * 
 * const mathml = '<math><mrow>...</mrow></math>'
 * const omml = mml2omml(mathml)
 * ```
 * 
 * @author px-doc team
 * @version 1.0.0
 * @license MIT
 */

import { MathMLToOMMLConverter } from './converter.js'

/**
 * 将MathML转换为OMML
 * 
 * @param {string} mathml - MathML XML字符串
 * @returns {string} OMML XML字符串
 * @throws {Error} 如果转换失败
 * 
 * @example
 * // 简单公式
 * const mathml = '<math><mrow><mi>x</mi><mo>+</mo><mi>y</mi></mrow></math>'
 * const omml = mml2omml(mathml)
 * 
 * @example
 * // 复杂公式（格林公式）
 * const mathml = `
 *   <math>
 *     <mrow>
 *       <munderover>
 *         <mo>∮</mo>
 *         <mi>L</mi>
 *         <mi></mi>
 *       </munderover>
 *       <mi>P</mi>
 *       <mo>dx</mo>
 *       <mo>+</mo>
 *       <mi>Q</mi>
 *       <mo>dy</mo>
 *       <mo>=</mo>
 *       <munderover>
 *         <mo>∬</mo>
 *         <mi>D</mi>
 *         <mi></mi>
 *       </munderover>
 *       <mfrac>
 *         <mrow><mo>∂</mo><mi>Q</mi></mrow>
 *         <mrow><mo>∂</mo><mi>x</mi></mrow>
 *       </mfrac>
 *       <mo>-</mo>
 *       <mfrac>
 *         <mrow><mo>∂</mo><mi>P</mi></mrow>
 *         <mrow><mo>∂</mo><mi>y</mi></mrow>
 *       </mfrac>
 *       <mo>dx</mo>
 *       <mo>dy</mo>
 *     </mrow>
 *   </math>
 * `
 * const omml = mml2omml(mathml)
 */
export function mml2omml(mathml) {
  if (!mathml || typeof mathml !== 'string') {
    throw new Error('Invalid MathML input: must be a non-empty string')
  }
  
  try {
    const converter = new MathMLToOMMLConverter(mathml)
    return converter.convert()
  } catch (error) {
    console.error('❌ MathML to OMML conversion failed:', error)
    throw error
  }
}

/**
 * 批量转换MathML到OMML
 * 
 * @param {string[]} mathmlArray - MathML字符串数组
 * @returns {string[]} OMML字符串数组
 * 
 * @example
 * const mathmlArray = [
 *   '<math><mi>x</mi></math>',
 *   '<math><mi>y</mi></math>'
 * ]
 * const ommlArray = mml2ommlBatch(mathmlArray)
 */
export function mml2ommlBatch(mathmlArray) {
  if (!Array.isArray(mathmlArray)) {
    throw new Error('Invalid input: must be an array')
  }
  
  return mathmlArray.map((mathml, index) => {
    try {
      return mml2omml(mathml)
    } catch (error) {
      console.error(`❌ Failed to convert MathML at index ${index}:`, error)
      return null
    }
  }).filter(omml => omml !== null)
}

/**
 * 验证MathML是否有效
 * 
 * @param {string} mathml - MathML XML字符串
 * @returns {boolean} 是否有效
 * 
 * @example
 * const isValid = validateMathML('<math><mi>x</mi></math>')
 * console.log(isValid) // true
 */
export function validateMathML(mathml) {
  if (!mathml || typeof mathml !== 'string') {
    return false
  }
  
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(mathml, 'text/xml')
    
    // 检查解析错误
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      return false
    }
    
    // 检查是否有math元素
    const mathElement = doc.querySelector('math')
    return mathElement !== null
    
  } catch (error) {
    return false
  }
}

/**
 * 获取转换器版本信息
 * 
 * @returns {Object} 版本信息
 */
export function getVersion() {
  return {
    name: 'mathml2omml',
    version: '1.0.0',
    author: 'px-doc team',
    description: 'MathML to OMML converter for Word document export',
    features: [
      'Basic MathML elements support',
      'N-ary operators (integrals, sums, etc.)',
      'Complex nested structures',
      'Fractions, superscripts, subscripts',
      'Radicals, delimiters, matrices',
      'Full OMML compatibility'
    ]
  }
}

// 导出转换器类（用于高级用法）
export { MathMLToOMMLConverter } from './converter.js'

// 导出辅助函数（用于自定义扩展）
export * from './helpers.js'

// 导出映射表（用于自定义配置）
export * from './mappings.js'

