/**
 * MathML到OMML转换器核心类
 * 
 * 转换流程：
 * 1. 解析MathML字符串为DOM
 * 2. 递归遍历DOM树
 * 3. 根据元素类型转换为OMML
 * 4. 特殊处理N元运算符（积分、求和等）
 * 5. 输出OMML XML字符串
 */

import {
  getTextContent,
  getChildren,
  isEmpty,
  containsNaryOperator,
  createTextRun,
  createNaryElement,
  createFractionElement,
  createSuperscriptElement,
  createSubscriptElement,
  createSubSuperscriptElement,
  createRadicalElement,
  createDelimiterElement,
  escapeXml
} from './helpers.js'

export class MathMLToOMMLConverter {
  constructor(mathml) {
    this.mathml = mathml
    this.omml = ''
    this.parser = null
    this.doc = null
  }

  /**
   * 执行转换
   * @returns {string} OMML XML字符串
   */
  convert() {
    try {
      // 解析MathML
      this.parser = new DOMParser()
      this.doc = this.parser.parseFromString(this.mathml, 'text/xml')
      
      // 检查解析错误
      const parserError = this.doc.querySelector('parsererror')
      if (parserError) {
        console.error('❌ MathML解析失败:', parserError.textContent)
        throw new Error('MathML解析失败')
      }
      
      // 获取math根元素
      const mathElement = this.doc.querySelector('math')
      if (!mathElement) {
        console.error('❌ 未找到math元素')
        throw new Error('未找到math元素')
      }
      
      // 转换为OMML
      this.omml = '<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">'
      this.omml += this.convertElement(mathElement)
      this.omml += '</m:oMath>'
      
      console.log('✅ MathML转OMML成功')
      return this.omml
      
    } catch (error) {
      console.error('❌ MathML转OMML失败:', error)
      throw error
    }
  }

  /**
   * 转换单个元素
   * @param {Element} element - MathML元素
   * @returns {string} OMML XML字符串
   */
  convertElement(element) {
    if (!element) return ''
    
    const tagName = element.tagName
    
    // 根据元素类型分发到不同的处理函数
    switch (tagName) {
      case 'math':
        return this.convertMath(element)
      case 'mrow':
        return this.convertMrow(element)
      case 'mn':
      case 'mi':
      case 'mo':
      case 'mtext':
        return this.convertToken(element)
      case 'mfrac':
        return this.convertMfrac(element)
      case 'msup':
        return this.convertMsup(element)
      case 'msub':
        return this.convertMsub(element)
      case 'msubsup':
        return this.convertMsubsup(element)
      case 'munderover':
        return this.convertMunderover(element)
      case 'munder':
        return this.convertMunder(element)
      case 'mover':
        return this.convertMover(element)
      case 'msqrt':
        return this.convertMsqrt(element)
      case 'mroot':
        return this.convertMroot(element)
      case 'mfenced':
        return this.convertMfenced(element)
      case 'mtable':
        return this.convertMtable(element)
      case 'mspace':
        return '' // 忽略空格元素
      case 'semantics':
        // semantics元素只处理第一个子元素
        return this.convertElement(element.children[0])
      default:
        console.warn(`⚠️ 未处理的MathML元素: ${tagName}`)
        return this.convertChildren(element)
    }
  }

  /**
   * 转换math根元素
   */
  convertMath(element) {
    return this.convertChildren(element)
  }

  /**
   * 转换mrow元素（行）
   * 特殊处理：当遇到N元运算符时，收集后面的兄弟节点作为运算符的内容
   */
  convertMrow(element) {
    const children = getChildren(element)
    if (children.length === 0) {
      const text = getTextContent(element)
      return text ? createTextRun(text) : ''
    }

    let result = ''
    let i = 0

    while (i < children.length) {
      const child = children[i]

      // 检查当前元素是否为N元运算符
      const operator = containsNaryOperator(child)

      if (operator) {
        // 是N元运算符，收集后面的兄弟节点
        console.log(`🔍 在mrow中发现N元运算符: ${operator.chr} (${operator.type})`)
        const naryResult = this.convertNaryWithSiblings(child, children, i)
        result += naryResult.omml
        i = naryResult.nextIndex  // 跳过已处理的兄弟节点
        console.log(`✅ N元运算符处理完成，跳转到索引 ${i}/${children.length}`)
      } else {
        // 不是N元运算符，正常转换
        result += this.convertElement(child)
        i++
      }
    }

    return result
  }

  /**
   * 转换标记元素（mn, mi, mo, mtext）
   */
  convertToken(element) {
    const text = getTextContent(element)
    if (!text || text.trim() === '') return ''
    
    return createTextRun(text)
  }

  /**
   * 转换分式元素
   */
  convertMfrac(element) {
    const children = getChildren(element)
    if (children.length < 2) {
      console.warn('⚠️ mfrac元素子元素不足')
      return ''
    }
    
    const numerator = this.convertElement(children[0])
    const denominator = this.convertElement(children[1])
    
    return createFractionElement(numerator, denominator)
  }

  /**
   * 转换上标元素
   */
  convertMsup(element) {
    const children = getChildren(element)
    if (children.length < 2) {
      console.warn('⚠️ msup元素子元素不足')
      return ''
    }

    const base = children[0]
    const sup = children[1]

    // 检查base是否为N元运算符
    const operator = containsNaryOperator(base)

    if (operator) {
      // 是N元运算符，转换为<m:nary>
      console.log(`✅ 识别N元运算符(msup): ${operator.chr} (${operator.type})`)
      const supContent = this.convertElement(sup)
      return createNaryElement(operator, '', supContent, '')
    } else {
      // 不是N元运算符，使用普通上标
      const baseContent = this.convertElement(base)
      const supContent = this.convertElement(sup)
      return createSuperscriptElement(baseContent, supContent)
    }
  }

  /**
   * 转换下标元素
   */
  convertMsub(element) {
    const children = getChildren(element)
    if (children.length < 2) {
      console.warn('⚠️ msub元素子元素不足')
      return ''
    }

    const base = children[0]
    const sub = children[1]

    // 检查base是否为N元运算符
    const operator = containsNaryOperator(base)

    if (operator) {
      // 是N元运算符，转换为<m:nary>
      console.log(`✅ 识别N元运算符(msub): ${operator.chr} (${operator.type})`)
      const subContent = this.convertElement(sub)
      return createNaryElement(operator, subContent, '', '')
    } else {
      // 不是N元运算符，使用普通下标
      const baseContent = this.convertElement(base)
      const subContent = this.convertElement(sub)
      return createSubscriptElement(baseContent, subContent)
    }
  }

  /**
   * 转换上下标元素
   */
  convertMsubsup(element) {
    const children = getChildren(element)
    if (children.length < 3) {
      console.warn('⚠️ msubsup元素子元素不足')
      return ''
    }

    const base = children[0]
    const sub = children[1]
    const sup = children[2]

    // 检查base是否为N元运算符
    const operator = containsNaryOperator(base)

    if (operator) {
      // 是N元运算符，转换为<m:nary>
      console.log(`✅ 识别N元运算符(msubsup): ${operator.chr} (${operator.type})`)
      const subContent = this.convertElement(sub)
      const supContent = this.convertElement(sup)
      return createNaryElement(operator, subContent, supContent, '')
    } else {
      // 不是N元运算符，使用普通上下标
      const baseContent = this.convertElement(base)
      const subContent = this.convertElement(sub)
      const supContent = this.convertElement(sup)
      return createSubSuperscriptElement(baseContent, subContent, supContent)
    }
  }

  /**
   * 转换上下限元素（关键！处理积分、求和等）
   * 这是解决公式3问题的核心函数
   */
  convertMunderover(element) {
    const children = getChildren(element)
    if (children.length < 3) {
      console.warn('⚠️ munderover元素子元素不足')
      return ''
    }
    
    const base = children[0]
    const under = children[1]
    const over = children[2]
    
    // 检查base是否为N元运算符
    const operator = containsNaryOperator(base)
    
    if (operator) {
      // 是N元运算符，转换为<m:nary>
      console.log(`✅ 识别N元运算符: ${operator.chr} (${operator.type})`)
      
      const subContent = this.convertElement(under)
      const supContent = this.convertElement(over)
      const baseContent = '' // N元运算符后面的内容在外部处理
      
      return createNaryElement(operator, subContent, supContent, baseContent)
    } else {
      // 不是N元运算符，使用普通的上下标
      console.log('⚠️ munderover不是N元运算符，使用普通上下标')
      const baseContent = this.convertElement(base)
      const subContent = this.convertElement(under)
      const supContent = this.convertElement(over)
      
      return createSubSuperscriptElement(baseContent, subContent, supContent)
    }
  }

  /**
   * 转换下限元素
   */
  convertMunder(element) {
    const children = getChildren(element)
    if (children.length < 2) {
      console.warn('⚠️ munder元素子元素不足')
      return ''
    }
    
    const base = children[0]
    const under = children[1]
    
    // 检查是否为N元运算符
    const operator = containsNaryOperator(base)
    
    if (operator) {
      const subContent = this.convertElement(under)
      return createNaryElement(operator, subContent, '', '')
    } else {
      const baseContent = this.convertElement(base)
      const subContent = this.convertElement(under)
      return createSubscriptElement(baseContent, subContent)
    }
  }

  /**
   * 转换上限元素
   */
  convertMover(element) {
    const children = getChildren(element)
    if (children.length < 2) {
      console.warn('⚠️ mover元素子元素不足')
      return ''
    }
    
    const base = children[0]
    const over = children[1]
    
    // 检查是否为N元运算符
    const operator = containsNaryOperator(base)
    
    if (operator) {
      const supContent = this.convertElement(over)
      return createNaryElement(operator, '', supContent, '')
    } else {
      const baseContent = this.convertElement(base)
      const supContent = this.convertElement(over)
      return createSuperscriptElement(baseContent, supContent)
    }
  }

  /**
   * 转换平方根元素
   */
  convertMsqrt(element) {
    const content = this.convertChildren(element)
    return createRadicalElement(content)
  }

  /**
   * 转换N次根元素
   */
  convertMroot(element) {
    const children = getChildren(element)
    if (children.length < 2) {
      console.warn('⚠️ mroot元素子元素不足')
      return ''
    }
    
    const base = this.convertElement(children[0])
    const degree = this.convertElement(children[1])
    
    return createRadicalElement(base, degree)
  }

  /**
   * 转换括号元素
   */
  convertMfenced(element) {
    const open = element.getAttribute('open') || '('
    const close = element.getAttribute('close') || ')'
    const content = this.convertChildren(element)
    
    return createDelimiterElement(content, open, close)
  }

  /**
   * 转换表格元素（矩阵）
   */
  convertMtable(element) {
    // 简化处理：将表格转换为括号包围的内容
    const content = this.convertChildren(element)
    return createDelimiterElement(content, '[', ']')
  }

  /**
   * 转换所有子元素
   */
  convertChildren(element) {
    const children = getChildren(element)
    if (children.length === 0) {
      // 如果没有子元素，返回文本内容
      const text = getTextContent(element)
      return text ? createTextRun(text) : ''
    }

    return children.map(child => this.convertElement(child)).join('')
  }

  /**
   * 转换N元运算符及其后面的兄弟节点
   * @param {Element} naryElement - N元运算符元素
   * @param {Array} siblings - 所有兄弟节点数组
   * @param {number} currentIndex - 当前N元运算符在兄弟节点中的索引
   * @returns {Object} { omml: OMML字符串, nextIndex: 下一个未处理的索引 }
   */
  convertNaryWithSiblings(naryElement, siblings, currentIndex) {
    // 提取N元运算符的各部分（运算符、上下标）
    const { operator, sub, sup } = this.extractNaryParts(naryElement)

    console.log(`📦 提取N元运算符: ${operator.chr}, sub=${sub ? '有' : '无'}, sup=${sup ? '有' : '无'}`)

    // 收集后面的兄弟节点，直到遇到：
    // 1. 另一个N元运算符
    // 2. 分隔符（=、+、-等）
    // 3. 兄弟节点结束
    let baseContent = ''
    let nextIndex = currentIndex + 1
    let collectedCount = 0

    console.log(`🔍 开始收集兄弟节点，从索引 ${nextIndex} 开始，共 ${siblings.length} 个节点`)

    while (nextIndex < siblings.length) {
      const sibling = siblings[nextIndex]

      // 检查是否为N元运算符
      if (containsNaryOperator(sibling)) {
        console.log(`⛔ 遇到另一个N元运算符，停止收集`)
        break  // 遇到另一个N元运算符，停止收集
      }

      // 检查是否为分隔符
      if (this.isSeparator(sibling)) {
        console.log(`⛔ 遇到分隔符，停止收集`)
        break  // 遇到分隔符，停止收集
      }

      // 转换并收集兄弟节点
      const siblingOmml = this.convertElement(sibling)
      baseContent += siblingOmml
      collectedCount++
      nextIndex++
    }

    console.log(`✅ 收集完成，共收集 ${collectedCount} 个兄弟节点`)
    console.log(`📝 baseContent长度: ${baseContent.length}`)

    // 创建OMML
    const omml = createNaryElement(operator, sub, sup, baseContent)

    return {
      omml,
      nextIndex  // 返回下一个未处理的索引
    }
  }

  /**
   * 提取N元运算符的各部分（运算符、上下标）
   * @param {Element} element - N元运算符元素
   * @returns {Object} { operator, sub, sup }
   */
  extractNaryParts(element) {
    const tagName = element.tagName.toLowerCase()
    const operator = containsNaryOperator(element)

    let sub = ''
    let sup = ''

    if (tagName === 'msubsup') {
      const children = getChildren(element)
      if (children.length >= 3) {
        sub = this.convertElement(children[1])  // 下标
        sup = this.convertElement(children[2])  // 上标
      }
    } else if (tagName === 'msub') {
      const children = getChildren(element)
      if (children.length >= 2) {
        sub = this.convertElement(children[1])  // 下标
      }
    } else if (tagName === 'msup') {
      const children = getChildren(element)
      if (children.length >= 2) {
        sup = this.convertElement(children[1])  // 上标
      }
    } else if (tagName === 'munderover') {
      const children = getChildren(element)
      if (children.length >= 3) {
        sub = this.convertElement(children[1])  // 下标
        sup = this.convertElement(children[2])  // 上标
      }
    } else if (tagName === 'munder') {
      const children = getChildren(element)
      if (children.length >= 2) {
        sub = this.convertElement(children[1])  // 下标
      }
    } else if (tagName === 'mover') {
      const children = getChildren(element)
      if (children.length >= 2) {
        sup = this.convertElement(children[1])  // 上标
      }
    }

    return { operator, sub, sup }
  }

  /**
   * 检查元素是否为分隔符
   * @param {Element} element - 要检查的元素
   * @returns {boolean} 是否为分隔符
   */
  isSeparator(element) {
    const tagName = element.tagName.toLowerCase()
    if (tagName !== 'mo') return false

    const text = getTextContent(element)
    const separators = ['=', '+', '-', '×', '÷', '<', '>', '≤', '≥', '≠', '≈', '∈', '∉', '⊂', '⊃', '⊆', '⊇']
    return separators.includes(text.trim())
  }
}

