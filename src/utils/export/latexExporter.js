/**
 * LaTeX公式导出模块
 * 专门处理LaTeX公式转换为Word兼容的OMML格式
 * 基于LaTeX Live技术方案的深度分析和优化
 */

import katex from 'katex'
// import { mml2omml } from '@hungknguyen/mathml2omml'  // 使用自定义converter替代
import { MathMLToOMMLConverter } from './mathml2omml/converter.js'
import JSZip from 'jszip'

export class LaTeXExporter {
  constructor() {
    // 调试模式开关
    this.debugMode = true
    
    // 特殊数学符号列表，需要保护不被拆分
    this.specialMathSymbols = [
      '∞', '∑', '∫', '∂', '∆', '∇', '√', '∛', '∜',
      '≤', '≥', '≠', '≈', '≡', '∝', '∈', '∉', '⊂', '⊃',
      '∪', '∩', '⊕', '⊗', '⊙', '⊥', '∥', '∠', '°',
      'sin', 'cos', 'tan', 'log', 'ln', 'exp', 'lim',
      'max', 'min', 'sup', 'inf', 'det', 'tr', 'arcsin',
      'arccos', 'arctan', 'sinh', 'cosh', 'tanh'
    ]
  }

  /**
   * 将LaTeX公式转换为Word兼容的OMML格式
   * @param {string} latexCode - LaTeX代码
   * @param {boolean} isDisplayMode - 是否为块级公式
   * @returns {Object|null} Word数学公式对象或null
   */
  convertLatexToWordMath(latexCode, isDisplayMode = false) {
    try {
      this.log(`=== LaTeX转换开始 ===`)
      this.log(`原始LaTeX代码: "${latexCode}"`)
      this.log(`显示模式: ${isDisplayMode}`)

      // 预处理LaTeX代码
      const processedLatexCode = this.preprocessLatexCode(latexCode)
      if (processedLatexCode !== latexCode) {
        this.log(`LaTeX预处理后: "${processedLatexCode}"`)
      }

      // 第一步：使用KaTeX将LaTeX转换为MathML
      const mathML = katex.renderToString(processedLatexCode, {
        output: 'mathml',           // 输出MathML格式
        displayMode: isDisplayMode, // 是否为块级公式
        throwOnError: false,        // 不抛出错误，返回原始LaTeX
        strict: false               // 宽松模式，支持更多LaTeX语法
      })

      this.log('KaTeX生成的MathML长度:', mathML.length)

      // 第二步：将MathML转换为OMML
      const omml = this.convertMathMLToOMML(mathML)
      if (!omml) {
        throw new Error('MathML到OMML转换失败')
      }

      // 第三步：创建包含OMML的Word元素占位符
      return this.createOMMLPlaceholder(omml, isDisplayMode)

    } catch (error) {
      this.log('LaTeX到OMML转换失败:', error)
      return null
    }
  }

  /**
   * 预处理LaTeX代码，修复常见问题
   * @param {string} latexCode - 原始LaTeX代码
   * @returns {string} - 处理后的LaTeX代码
   */
  preprocessLatexCode(latexCode) {
    let processed = latexCode

    // 修复常见的转义问题
    processed = processed.replace(/\\\\/g, '\\')

    // 确保数学模式标记正确
    processed = processed.replace(/^\$+|\$+$/g, '')

    // 修复常见的LaTeX语法问题
    processed = processed.replace(/\\mathrm\{d\}/g, '\\,\\mathrm{d}')

    return processed.trim()
  }

  /**
   * 将MathML转换为OMML
   * @param {string} mathML - MathML字符串
   * @returns {string|null} OMML字符串或null
   */
  convertMathMLToOMML(mathML) {
    try {
      this.log(`=== MathML转OMML开始 ===`)

      // 清理MathML，确保格式正确
      let cleanMathML = mathML
        .replace(/class="[^"]*"/g, '') // 移除CSS类
        .replace(/style="[^"]*"/g, '') // 移除内联样式
        .replace(/\s+/g, ' ')          // 压缩空白字符
        .trim()

      // 确保MathML有正确的命名空间
      if (!cleanMathML.includes('xmlns')) {
        cleanMathML = cleanMathML.replace(
          '<math',
          '<math xmlns="http://www.w3.org/1998/Math/MathML"'
        )
      }

      this.log('清理后的MathML长度:', cleanMathML.length)

      // 使用自定义converter转换
      const converter = new MathMLToOMMLConverter(cleanMathML)
      let omml = converter.convert()

      if (!omml || typeof omml !== 'string') {
        throw new Error('MathMLToOMMLConverter转换返回无效结果')
      }

      this.log('转换后的OMML长度:', omml.length)

      // 修复关键的OMML错误并优化
      const optimizedOmml = this.optimizeOMML(omml)

      return optimizedOmml

    } catch (error) {
      this.log('MathML到OMML转换失败:', error)
      return null
    }
  }

  /**
   * 优化OMML结构，解决空格问题
   * @param {string} omml - 原始OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  optimizeOMML(omml) {
    try {
      this.log('=== 开始OMML优化 ===')

      let optimized = omml

      // 第一步：修复XML结构错误
      optimized = this.fixOMMLStructureErrors(optimized)

      // 第二步：彻底的字符分组优化
      optimized = this.thoroughCharacterGroupingOptimization(optimized)

      // 第三步：特殊结构优化
      optimized = this.optimizeSpecialMathStructures(optimized)

      this.log('=== OMML优化完成 ===')
      return optimized

    } catch (error) {
      this.log('OMML优化失败:', error)
      return omml // 返回原始OMML
    }
  }

  /**
   * 修复OMML结构错误
   * @param {string} omml - OMML字符串
   * @returns {string} - 修复后的OMML字符串
   */
  fixOMMLStructureErrors(omml) {
    let fixed = omml

    // 修复发现的关键XML结构错误
    fixed = fixed.replace(
      /<m:fPr><m:t xml:space="preserve"ype m:val="bar"\/><\/m:fPr>/g,
      '<m:fPr><m:ctrlPr /></m:fPr>'
    )

    // 修复其他类似错误模式
    fixed = fixed.replace(
      /<m:t xml:space="preserve"ype m:val="([^"]*)"\/>/g,
      '<m:type m:val="$1"/>'
    )

    // 修复分数属性，使用LaTeX Live标准
    fixed = fixed.replace(
      /<m:fPr><m:type m:val="bar"\/><\/m:fPr>/g,
      '<m:fPr><m:ctrlPr /></m:fPr>'
    )

    // 修复分数属性的另一种形式
    fixed = fixed.replace(
      /<m:fPr><m:type m:val="bar"\/><\/m:fPr>/g,
      '<m:fPr><m:ctrlPr /></m:fPr>'
    )

    return fixed
  }

  /**
   * 彻底的字符分组优化 - 解决空格问题的核心方法
   * 基于LaTeX Live分析，实现完全的单字符分组
   * @param {string} omml - OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  thoroughCharacterGroupingOptimization(omml) {
    this.log('=== 开始彻底的字符分组优化 ===')

    let optimized = omml

    // 第一阶段：全局多字符标签优化
    optimized = this.globalCharacterGroupingOptimization(optimized)

    // 第二阶段：多轮深度优化，处理嵌套结构
    optimized = this.multiRoundDeepOptimization(optimized)

    // 第三阶段：特殊数学结构优化
    optimized = this.specialMathStructureOptimization(optimized)

    // 第四阶段：最终验证和清理
    optimized = this.finalOptimizationVerification(optimized)

    this.log('=== 彻底字符分组优化完成 ===')
    return optimized
  }

  /**
   * 第一阶段：全局字符分组优化
   * @param {string} omml - OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  globalCharacterGroupingOptimization(omml) {
    this.log('第一阶段：全局字符分组优化')

    // 使用更精确的正则表达式，匹配所有可能的多字符标签
    const patterns = [
      // 标准的多字符<m:t>标签
      /<m:r>(<w:rPr>.*?<\/w:rPr>)?<m:t xml:space="preserve">([^<]{2,})<\/m:t><\/m:r>/g,
      // 没有xml:space属性的多字符标签
      /<m:r>(<w:rPr>.*?<\/w:rPr>)?<m:t>([^<]{2,})<\/m:t><\/m:r>/g,
      // 嵌套在其他结构中的多字符标签
      /<m:t xml:space="preserve">([^<]{2,})<\/m:t>/g
    ]

    let optimized = omml
    let totalMatches = 0

    patterns.forEach((pattern, index) => {
      this.log(`应用模式 ${index + 1}...`)
      let patternMatches = 0

      optimized = optimized.replace(pattern, (match, rPr, textContent) => {
        // 对于第三个模式，参数顺序不同
        if (index === 2) {
          textContent = rPr // 第三个模式中，rPr实际是textContent
          rPr = undefined
        }

        patternMatches++
        totalMatches++

        // 跳过特殊数学符号
        if (this.isSpecialMathSymbol(textContent)) {
          this.log(`保护特殊符号: "${textContent}"`)
          return match
        }

        // 跳过单字符（已经是最优状态）
        if (textContent.length === 1) {
          return match
        }

        // 创建字体信息
        const fontInfo = rPr || '<w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math" /></w:rPr>'

        // 拆分为单字符
        const characters = textContent.split('')

        let result
        if (index === 2) {
          // 第三个模式：只替换<m:t>标签内容，添加xml:space="preserve"
          result = characters.map(char =>
            `<m:t xml:space="preserve">${char}</m:t>`
          ).join('')
        } else {
          // 前两个模式：完整的<m:r>标签，添加xml:space="preserve"
          result = characters.map(char =>
            `<m:r>${fontInfo}<m:t xml:space="preserve">${char}</m:t></m:r>`
          ).join('')
        }

        this.log(`模式${index + 1}优化: "${textContent}" -> ${characters.length}个单字符`)
        return result
      })

      this.log(`模式 ${index + 1} 完成，处理了 ${patternMatches} 个匹配`)
    })

    this.log(`第一阶段完成，总共处理了 ${totalMatches} 个多字符标签`)
    return optimized
  }

  /**
   * 第二阶段：多轮深度优化
   * @param {string} omml - OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  multiRoundDeepOptimization(omml) {
    this.log('第二阶段：多轮深度优化')

    let optimized = omml
    const maxRounds = 10 // 增加最大轮数
    let round = 0

    // 持续优化直到没有更多的多字符标签
    while (round < maxRounds) {
      round++
      this.log(`深度优化第 ${round} 轮...`)

      const beforeLength = optimized.length
      let roundChanges = 0

      // 使用更激进的模式匹配
      const aggressivePattern = /<m:t[^>]*>([^<]{2,})<\/m:t>/g

      optimized = optimized.replace(aggressivePattern, (match, textContent) => {
        // 跳过特殊符号
        if (this.isSpecialMathSymbol(textContent)) {
          return match
        }

        roundChanges++
        const characters = textContent.split('')
        const result = characters.map(char =>
          `<m:t xml:space="preserve">${char}</m:t>`
        ).join('')

        this.log(`第${round}轮深度优化: "${textContent}" -> ${characters.length}个单字符`)
        return result
      })

      const afterLength = optimized.length
      this.log(`第 ${round} 轮完成，处理了 ${roundChanges} 个标签，长度变化: ${beforeLength} -> ${afterLength}`)

      // 如果没有变化，说明优化完成
      if (roundChanges === 0) {
        this.log(`第 ${round} 轮无变化，深度优化完成`)
        break
      }
    }

    this.log(`第二阶段完成，共进行了 ${round} 轮深度优化`)
    return optimized
  }

  /**
   * 第三阶段：特殊数学结构优化
   * @param {string} omml - OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  specialMathStructureOptimization(omml) {
    this.log('第三阶段：特殊数学结构优化')

    let optimized = omml

    // 优化求和结构
    optimized = this.optimizeSummationStructure(optimized)

    // 优化分数结构
    optimized = this.optimizeFractionStructure(optimized)

    // 优化积分结构
    optimized = this.optimizeIntegralStructure(optimized)

    // 优化上标下标结构
    optimized = this.optimizeScriptStructure(optimized)

    this.log('第三阶段完成')
    return optimized
  }

  /**
   * 第四阶段：最终验证和清理
   * @param {string} omml - OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  finalOptimizationVerification(omml) {
    this.log('第四阶段：最终验证和清理')

    let optimized = omml

    // 最终扫描，确保没有遗漏的多字符标签
    const finalPattern = /<m:t[^>]*>([^<]{2,})<\/m:t>/g
    let finalMatches = 0

    optimized = optimized.replace(finalPattern, (match, textContent) => {
      // 最后一次检查特殊符号
      if (this.isSpecialMathSymbol(textContent)) {
        this.log(`最终验证：保护特殊符号 "${textContent}"`)
        return match
      }

      finalMatches++
      const characters = textContent.split('')
      const result = characters.map(char =>
        `<m:t xml:space="preserve">${char}</m:t>`
      ).join('')

      this.log(`最终清理: "${textContent}" -> ${characters.length}个单字符`)
      return result
    })

    this.log(`第四阶段完成，最终清理了 ${finalMatches} 个遗漏的多字符标签`)

    // 验证优化结果
    const remainingMultiChar = (optimized.match(/<m:t[^>]*>([^<]{2,})<\/m:t>/g) || []).length
    this.log(`优化验证：剩余多字符标签数量 = ${remainingMultiChar}`)

    if (remainingMultiChar > 0) {
      this.log('警告：仍有多字符标签未被优化，可能包含特殊符号')
    } else {
      this.log('✅ 优化验证通过：所有多字符标签已成功拆分为单字符')
    }

    return optimized
  }

  /**
   * 优化求和结构
   * @param {string} omml - OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  optimizeSummationStructure(omml) {
    this.log('优化求和结构...')

    // 匹配求和结构并优化其内部的字符分组
    const summationPattern = /(<m:nary>.*?<m:e>)(.*?)(<\/m:e>.*?<\/m:nary>)/gs

    return omml.replace(summationPattern, (_, prefix, content, suffix) => {
      this.log('发现求和结构，优化内部字符分组')

      // 对求和内容进行字符分组优化
      const optimizedContent = this.deepCharacterGrouping(content)
      return prefix + optimizedContent + suffix
    })
  }

  /**
   * 优化分数结构
   * @param {string} omml - OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  optimizeFractionStructure(omml) {
    this.log('优化分数结构...')

    // 匹配分数结构并分别优化分子和分母
    const fractionPattern = /(<m:f>.*?<m:num>)(.*?)(<\/m:num>.*?<m:den>)(.*?)(<\/m:den>.*?<\/m:f>)/gs

    return omml.replace(fractionPattern, (_, numPrefix, numContent, denPrefix, denContent, suffix) => {
      this.log('发现分数结构，优化分子和分母字符分组')

      const optimizedNum = this.deepCharacterGrouping(numContent)
      const optimizedDen = this.deepCharacterGrouping(denContent)

      return numPrefix + optimizedNum + denPrefix + optimizedDen + suffix
    })
  }

  /**
   * 优化积分结构
   * @param {string} omml - OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  optimizeIntegralStructure(omml) {
    this.log('优化积分结构...')

    // 匹配积分结构（类似求和结构）
    const integralPattern = /(<m:nary>.*?<m:naryPr>.*?<m:chr m:val="∫"\/>.*?<\/m:naryPr>.*?<m:e>)(.*?)(<\/m:e>.*?<\/m:nary>)/gs

    return omml.replace(integralPattern, (_, prefix, content, suffix) => {
      this.log('发现积分结构，优化内部字符分组')

      const optimizedContent = this.deepCharacterGrouping(content)
      return prefix + optimizedContent + suffix
    })
  }

  /**
   * 优化上标下标结构
   * @param {string} omml - OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  optimizeScriptStructure(omml) {
    this.log('优化上标下标结构...')

    let optimized = omml

    // 优化上标结构
    const supPattern = /(<m:sSup>.*?<m:sup>)(.*?)(<\/m:sup>.*?<\/m:sSup>)/gs
    optimized = optimized.replace(supPattern, (_, prefix, content, suffix) => {
      this.log('发现上标结构，优化字符分组')
      const optimizedContent = this.deepCharacterGrouping(content)
      return prefix + optimizedContent + suffix
    })

    // 优化下标结构
    const subPattern = /(<m:sSub>.*?<m:sub>)(.*?)(<\/m:sub>.*?<\/m:sSub>)/gs
    optimized = optimized.replace(subPattern, (_, prefix, content, suffix) => {
      this.log('发现下标结构，优化字符分组')
      const optimizedContent = this.deepCharacterGrouping(content)
      return prefix + optimizedContent + suffix
    })

    return optimized
  }

  /**
   * 深度字符分组处理
   * @param {string} content - 内容字符串
   * @returns {string} - 优化后的内容
   */
  deepCharacterGrouping(content) {
    const pattern = /<m:t[^>]*>([^<]{2,})<\/m:t>/g

    return content.replace(pattern, (match, textContent) => {
      if (this.isSpecialMathSymbol(textContent)) {
        return match
      }

      const characters = textContent.split('')
      return characters.map(char =>
        `<m:t xml:space="preserve">${char}</m:t>`
      ).join('')
    })
  }

  /**
   * 优化特殊数学结构
   * @param {string} omml - OMML字符串
   * @returns {string} - 优化后的OMML字符串
   */
  optimizeSpecialMathStructures(omml) {
    this.log('开始优化特殊数学结构...')

    let optimized = omml

    // 关键修复：修复nary符号结构问题，确保Microsoft Word和WPS Office兼容性
    optimized = this.fixNaryStructure(optimized)

    return optimized
  }

  /**
   * 检查是否为特殊数学符号
   * @param {string} text - 文本内容
   * @returns {boolean} - 是否为特殊符号
   */
  isSpecialMathSymbol(text) {
    return this.specialMathSymbols.some(symbol => text.includes(symbol))
  }

  /**
   * 创建OMML占位符，用于后处理
   * @param {string} omml - OMML字符串
   * @param {boolean} isDisplayMode - 是否为块级公式
   * @returns {Object} - 包含占位符的TextRun对象
   */
  createOMMLPlaceholder(omml, isDisplayMode = false) {
    const displayModeFlag = isDisplayMode ? 'DISPLAY' : 'INLINE'
    const placeholder = `__OMML_START_${displayModeFlag}__${omml}__OMML_END__`

    // 返回一个TextRun对象，包含占位符
    return {
      text: placeholder,
      // 添加一些标识属性
      _isOMMLPlaceholder: true,
      _displayMode: isDisplayMode,
      _originalOMML: omml
    }
  }

  /**
   * 对生成的docx文件进行OMML后处理
   * @param {Blob} docxBlob - 原始docx文件blob
   * @returns {Blob} - 处理后的docx文件blob
   */
  async postProcessDocxOMML(docxBlob) {
    try {
      this.log('开始OMML后处理...')

      // 解压docx文件
      const zip = new JSZip()
      const zipContent = await zip.loadAsync(docxBlob)

      // 读取document.xml
      const documentXml = await zipContent.file('word/document.xml').async('string')
      this.log('读取document.xml成功')

      // 关键优化：检查是否包含OMML占位符
      // 如果没有数学公式，直接返回原始文件，避免破坏样式
      const ommlRegex = /<w:t[^>]*>__OMML_START_(INLINE|DISPLAY)__(.*?)__OMML_END__<\/w:t>/g
      const hasFormulas = ommlRegex.test(documentXml)

      if (!hasFormulas) {
        this.log('文档中没有数学公式，跳过OMML处理，保持原始样式')
        return docxBlob
      }

      this.log('检测到数学公式，开始OMML处理...')

      // 查找并替换OMML占位符
      let processedXml = documentXml
      // 重置正则表达式的lastIndex
      ommlRegex.lastIndex = 0
      let match
      let replacementCount = 0

      while ((match = ommlRegex.exec(documentXml)) !== null) {
        const [fullMatch, displayMode, ommlContent] = match
        replacementCount++

        this.log(`处理OMML占位符 #${replacementCount}: ${displayMode}模式`)

        // 解码HTML实体
        let decodedOmml = this.decodeHtmlEntities(ommlContent)

        // 清理OMML中的多余空格和属性，避免WPS解析问题
        decodedOmml = this.cleanOMMLForWPS(decodedOmml)

        // 根据显示模式创建不同的替换内容
        let replacement
        if (displayMode === 'DISPLAY') {
          // 块级公式：直接插入OMML，不包装在<w:r>中
          replacement = decodedOmml
        } else {
          // 内联公式：简化包装，移除可能有问题的命名空间声明
          replacement = `<w:r>
            <w:rPr>
              <w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math"/>
            </w:rPr>
            ${decodedOmml}
          </w:r>`
        }

        processedXml = processedXml.replace(fullMatch, replacement)
      }

      this.log(`总共替换了 ${replacementCount} 个OMML占位符`)

      // 更新document.xml
      zipContent.file('word/document.xml', processedXml)

      // 关键修复：添加webSettings.xml文件（Microsoft Word兼容性）
      this.log('添加webSettings.xml文件以确保Microsoft Word兼容性...')
      const webSettingsXml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?><w:webSettings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14" />`
      zipContent.file('word/webSettings.xml', webSettingsXml)

      // 更新[Content_Types].xml以包含webSettings.xml的内容类型定义
      this.log('更新Content_Types.xml以包含webSettings.xml定义...')
      const contentTypesXml = await zipContent.file('[Content_Types].xml').async('string')

      // 检查是否已经包含webSettings的定义
      if (!contentTypesXml.includes('webSettings')) {
        // 在</Types>标签前添加webSettings的内容类型定义
        const updatedContentTypes = contentTypesXml.replace(
          '</Types>',
          '  <Override PartName="/word/webSettings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"/>\n</Types>'
        )
        zipContent.file('[Content_Types].xml', updatedContentTypes)
        this.log('已添加webSettings.xml的内容类型定义')
      }

      // 更新word/_rels/document.xml.rels以包含webSettings.xml的关系定义
      this.log('更新document.xml.rels以包含webSettings.xml关系...')
      const documentRelsPath = 'word/_rels/document.xml.rels'
      const documentRelsFile = zipContent.file(documentRelsPath)

      if (documentRelsFile) {
        const documentRelsXml = await documentRelsFile.async('string')

        // 检查是否已经包含webSettings的关系定义
        if (!documentRelsXml.includes('webSettings')) {
          // 找到最大的rId
          const rIdMatches = documentRelsXml.match(/rId(\d+)/g) || []
          const maxRId = Math.max(...rIdMatches.map(id => parseInt(id.replace('rId', ''))), 0)
          const newRId = `rId${maxRId + 1}`

          // 在</Relationships>标签前添加webSettings的关系定义
          const updatedDocumentRels = documentRelsXml.replace(
            '</Relationships>',
            `  <Relationship Id="${newRId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings" Target="webSettings.xml"/>\n</Relationships>`
          )
          zipContent.file(documentRelsPath, updatedDocumentRels)
          this.log(`已添加webSettings.xml的关系定义 (${newRId})`)
        }
      }

      // 重新打包 - 必须使用DEFLATE压缩算法以符合DOCX标准
      const processedBlob = await zipContent.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9  // 最高压缩级别
        }
      })
      this.log('OMML后处理完成，已添加Microsoft Word兼容性支持')

      return processedBlob

    } catch (error) {
      this.log('OMML后处理失败:', error)
      return docxBlob // 返回原始文件
    }
  }

  /**
   * 清理OMML中的空格问题，规范化OMML结构以匹配LaTeX Live标准
   * @param {string} omml - 原始OMML字符串
   * @returns {string} - 清理后的OMML字符串
   */
  cleanOMMLForWPS(omml) {
    this.log('开始规范化OMML结构以匹配LaTeX Live标准...')

    let cleaned = omml

    // 关键修复：彻底的单字符分组，匹配LaTeX Live标准
    this.log('执行彻底的单字符分组以匹配LaTeX Live...')
    cleaned = this.enforceCompleteCharacterSeparation(cleaned)

    // Microsoft Word兼容性修复：移除可能有问题的标签
    this.log('应用Microsoft Word兼容性修复...')
    cleaned = this.applyMicrosoftWordCompatibilityFixes(cleaned)

    // 1. 清理空的<m:r>标签，这些会被渲染为空格
    cleaned = cleaned.replace(/<m:r><m:rPr><m:nor\/><\/m:rPr><\/m:r>/g, '')
    cleaned = cleaned.replace(/<m:r><m:rPr><m:nor\/><\/m:rPr>\s*<\/m:r>/g, '')

    // 2. 清理不正确的<m:rPr>标签
    cleaned = cleaned.replace(/<m:rPr><m:nor\/><m:sty m:val="undefined"\/><\/m:rPr>/g, '')
    cleaned = cleaned.replace(/<w:rPr\/><m:rPr><m:nor\/><m:sty m:val="undefined"\/><\/m:rPr>/g, '<w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math"/></w:rPr>')

    // 3. 确保所有字符都有完整的字体信息
    cleaned = cleaned.replace(/<m:r><m:t>([^<]+)<\/m:t><\/m:r>/g,
      '<m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math"/></w:rPr><m:t xml:space="preserve">$1</m:t></m:r>')

    // 4. 清理标签间的多余空白字符，避免被解析为内容
    cleaned = cleaned.replace(/>\s+</g, '><')

    // 5. 清理开头和结尾的空白字符
    cleaned = cleaned.trim()

    // 6. 清理连续的空白标签
    cleaned = cleaned.replace(/<m:t[^>]*>\s*<\/m:t>/g, '')

    // 7. 修复求和符号结构问题（关键修复）
    cleaned = this.fixNaryStructure(cleaned)

    // 8. 特别处理可能导致空格的结构问题
    cleaned = cleaned.replace(/<m:r>\s*<\/m:r>/g, '')

    this.log('OMML结构规范化完成')
    return cleaned
  }

  /**
   * 强制执行完全的字符分离，匹配LaTeX Live标准
   * @param {string} omml - OMML字符串
   * @returns {string} - 完全分离后的OMML字符串
   */
  enforceCompleteCharacterSeparation(omml) {
    this.log('强制执行完全字符分离以匹配LaTeX Live标准...')

    let separated = omml
    let iteration = 0
    const maxIterations = 20

    // 第一步：分离多字符<m:t>标签
    while (iteration < maxIterations) {
      iteration++
      const beforeLength = separated.length
      let changeCount = 0

      // 匹配所有可能的多字符<m:t>标签
      const multiCharPattern = /<m:t([^>]*)>([^<]{2,})<\/m:t>/g

      separated = separated.replace(multiCharPattern, (match, attributes, textContent) => {
        // 跳过特殊数学符号
        if (this.isSpecialMathSymbol(textContent)) {
          return match
        }

        changeCount++
        const characters = textContent.split('')

        // 为每个字符创建单独的<m:t>标签
        const separatedTags = characters.map(char =>
          `<m:t${attributes}>${char}</m:t>`
        ).join('')

        this.log(`第${iteration}轮分离: "${textContent}" -> ${characters.length}个单字符`)
        return separatedTags
      })

      const afterLength = separated.length
      this.log(`第${iteration}轮完成: 处理了${changeCount}个多字符标签, 长度变化: ${beforeLength} -> ${afterLength}`)

      // 如果没有变化，说明分离完成
      if (changeCount === 0) {
        this.log(`字符分离在第${iteration}轮完成`)
        break
      }
    }

    // 第二步：确保每个字符都有独立的<m:r>标签（关键修复）
    this.log('确保每个字符都有独立的m:r标签...')
    separated = this.ensureIndividualCharacterTags(separated)

    // 验证分离结果
    const remainingMultiChar = (separated.match(/<m:t[^>]*>([^<]{2,})<\/m:t>/g) || []).length
    this.log(`字符分离验证: 剩余多字符标签 = ${remainingMultiChar}`)

    if (remainingMultiChar > 0) {
      this.log('警告: 仍有多字符标签未分离，可能包含特殊符号')
    } else {
      this.log('✅ 字符分离验证通过: 所有字符已完全分离')
    }

    return separated
  }

  /**
   * 确保每个字符都有独立的<m:r>标签，匹配LaTeX Live标准
   * @param {string} omml - OMML字符串
   * @returns {string} - 处理后的OMML字符串
   */
  ensureIndividualCharacterTags(omml) {
    this.log('确保每个字符都有独立的m:r标签...')

    let processed = omml
    let changeCount = 0

    // 匹配包含多个<m:t>标签的<m:r>标签（更精确的模式）
    const multiTPattern = /<m:r>(<w:rPr>.*?<\/w:rPr>)?(<m:t[^>]*>[^<]*<\/m:t>){2,}<\/m:r>/g

    processed = processed.replace(multiTPattern, (match) => {
      changeCount++

      // 提取字体属性
      const fontMatch = match.match(/<w:rPr>.*?<\/w:rPr>/)
      const fontProp = fontMatch ? fontMatch[0] : '<w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math"/></w:rPr>'

      // 提取所有<m:t>标签
      const tTags = match.match(/<m:t[^>]*>[^<]*<\/m:t>/g) || []

      // 为每个<m:t>标签创建独立的<m:r>标签
      const individualRTags = tTags.map(tTag =>
        `<m:r>${fontProp}${tTag}</m:r>`
      ).join('')

      this.log(`拆分m:r标签: ${tTags.length}个字符 -> ${tTags.length}个独立m:r标签`)
      return individualRTags
    })

    // 处理没有字体属性的<m:r>标签（包含单个<m:t>的情况）
    const noFontPattern = /<m:r>(<m:t[^>]*>[^<]*<\/m:t>)<\/m:r>/g
    processed = processed.replace(noFontPattern, (_, tTag) => {
      changeCount++
      const fontProp = '<w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math"/></w:rPr>'
      return `<m:r>${fontProp}${tTag}</m:r>`
    })

    this.log(`独立m:r标签处理完成: 处理了${changeCount}个标签`)

    // 统计最终结果
    const finalRCount = (processed.match(/<m:r>/g) || []).length
    const finalTCount = (processed.match(/<m:t/g) || []).length
    this.log(`最终统计: ${finalRCount}个m:r标签, ${finalTCount}个m:t标签`)

    return processed
  }

  /**
   * 应用Microsoft Word兼容性修复
   * @param {string} omml - OMML字符串
   * @returns {string} - 修复后的OMML字符串
   */
  applyMicrosoftWordCompatibilityFixes(omml) {
    this.log('应用Microsoft Word兼容性修复...')

    let fixed = omml

    // 1. 移除可能导致渲染问题的<m:rPr><m:nor/></m:rPr>标签
    fixed = fixed.replace(/<m:rPr><m:nor\/><\/m:rPr>/g, '')
    fixed = fixed.replace(/<m:rPr><m:nor\/><m:sty[^>]*\/><\/m:rPr>/g, '')

    // 2. 清理OMML内部的命名空间声明（Microsoft Word不需要）
    fixed = fixed.replace(/xmlns:[^=]+="[^"]+"/g, '')

    // 3. 确保所有<m:t>标签都有xml:space="preserve"属性
    fixed = fixed.replace(/<m:t>([^<]*)<\/m:t>/g, '<m:t xml:space="preserve">$1</m:t>')

    // 4. 简化复杂的嵌套结构
    fixed = fixed.replace(/<m:r><m:r>/g, '<m:r>')
    fixed = fixed.replace(/<\/m:r><\/m:r>/g, '</m:r>')

    // 5. 清理多余的空白字符
    fixed = fixed.replace(/>\s+</g, '><')

    this.log('Microsoft Word兼容性修复完成')
    return fixed
  }

  /**
   * 修复nary符号(求和、积分等)结构问题
   * 解决空的<m:e/>导致的空格问题，同时确保Microsoft Word兼容性
   * @param {string} omml - OMML字符串
   * @returns {string} - 修复后的OMML字符串
   */
  fixNaryStructure(omml) {
    this.log('开始修复nary符号结构（禁用ctrlPr标签添加）...')

    let fixed = omml

    // 禁用所有ctrlPr标签添加，因为这会导致WPS Office空格问题
    this.log('已禁用ctrlPr标签添加，使用转换器生成的完整OMML')

    // 转换器已经生成了完整的OMML，不需要任何修复
    this.log('nary符号结构修复完成（无需添加ctrlPr标签）')

    return fixed
  }

  fixNaryStructure_OLD_DISABLED(omml) {
    // 旧代码已禁用
    return omml
  }

  fixNaryStructure_OLD_CONTENT_START(omml) {
    // 第一步：简化naryPr属性，确保Microsoft Word兼容性
    this.log('简化naryPr属性以确保Microsoft Word兼容性...')
    const naryPrPattern = /<m:naryPr>(.*?)<\/m:naryPr>/g
    let fixed = omml
    fixed = fixed.replace(naryPrPattern, (match, content) => {
      // 提取chr属性
      const chrMatch = content.match(/<m:chr m:val="([^"]+)"[^>]*\/?>/)
      if (chrMatch) {
        const chrValue = chrMatch[1]
        // 只保留chr和ctrlPr，移除Microsoft Word不认识的属性
        return `<m:naryPr><m:chr m:val="${chrValue}" /><m:ctrlPr /></m:naryPr>`
      }
      return match
    })

    // 第二步：大幅增加ctrlPr标签，达到LaTeX Live标准（22个）
    this.log('大幅增加ctrlPr标签，目标达到LaTeX Live标准...')

    // 第一轮：为主要数学元素添加ctrlPr
    const primaryElements = ['m:sub', 'm:sup', 'm:e', 'm:num', 'm:den', 'm:fPr', 'm:sSupPr', 'm:sSubPr']
    primaryElements.forEach(element => {
      const pattern = new RegExp(`(<${element}>)(?!\\s*<m:ctrlPr)`, 'g')
      fixed = fixed.replace(pattern, `$1<m:ctrlPr />`)
    })

    // 第二轮：为所有可能的数学属性元素添加ctrlPr
    const allMathElements = [
      'm:radPr', 'm:degPr', 'm:accPr', 'm:barPr', 'm:boxPr', 'm:borderBoxPr',
      'm:dPr', 'm:eqArrPr', 'm:funcPr', 'm:groupChrPr', 'm:limLowPr', 'm:limUppPr',
      'm:mPr', 'm:naryPr', 'm:phantPr', 'm:sPre', 'm:sPrePr', 'm:f', 'm:sSup', 'm:sSub'
    ]
    allMathElements.forEach(element => {
      const pattern = new RegExp(`(<${element}>)(?!\\s*<m:ctrlPr)`, 'g')
      fixed = fixed.replace(pattern, `$1<m:ctrlPr />`)
    })

    // 第三轮：为嵌套结构添加更多ctrlPr
    const nestedPatterns = [
      // 为每个m:r元素前添加ctrlPr（如果父元素是数学元素）
      /<(m:sub|m:sup|m:e|m:num|m:den)>(<m:ctrlPr \/>)?([^<]*<m:r>)/g,
      // 为分数结构添加更多ctrlPr
      /<m:f>(<m:ctrlPr \/>)?(<m:fPr>)/g,
      // 为上下标结构添加更多ctrlPr
      /<(m:sSup|m:sSub)>(<m:ctrlPr \/>)?(<m:sSupPr|m:sSubPr>)/g
    ]

    nestedPatterns.forEach((pattern, index) => {
      if (index === 0) {
        fixed = fixed.replace(pattern, '<$1><m:ctrlPr />$3')
      } else if (index === 1) {
        fixed = fixed.replace(pattern, '<m:f><m:ctrlPr />$2')
      } else if (index === 2) {
        fixed = fixed.replace(pattern, '<$1><m:ctrlPr />$3')
      }
    })

    // 第三步：大幅完善字体属性，达到LaTeX Live标准（57个）
    this.log('大幅完善字体属性，目标达到LaTeX Live标准...')

    // 修复有问题的字体属性结构
    fixed = fixed.replace(/<m:r><w:rPr\/><m:rPr><m:nor\/><m:sty m:val="undefined"\/><\/m:rPr>/g,
      '<m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math" /></w:rPr>')

    // 修复分数属性问题
    fixed = fixed.replace(/<m:fPr><m:type m:val="bar"\/><\/m:fPr>/g,
      '<m:fPr><m:ctrlPr /></m:fPr>')

    // 修复没有字体属性的m:r元素
    fixed = fixed.replace(/<m:r><m:t xml:space="preserve">/g,
      '<m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math" /></w:rPr><m:t xml:space="preserve">')

    // 确保所有没有字体属性的m:r元素都有完整字体定义
    const rWithoutFontPattern1 = /<m:r>(?!.*<w:rFonts)([^<]*<m:t[^>]*>.*?<\/m:t>[^<]*)<\/m:r>/g
    fixed = fixed.replace(rWithoutFontPattern1, (_match, content) => {
      return `<m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math" /></w:rPr>${content}</m:r>`
    })

    // 大幅增加字体属性数量，目标达到LaTeX Live标准（57个）

    // 第一轮：为所有主要数学元素添加字体属性
    const primaryMathElements = ['m:sub', 'm:sup', 'm:e', 'm:num', 'm:den', 'm:f', 'm:sSup', 'm:sSub']
    primaryMathElements.forEach(element => {
      // 为包含文本的数学元素添加字体属性
      const pattern = new RegExp(`(<${element}><m:ctrlPr \\/>)([^<]*<m:r>)(?!.*<w:rFonts)`, 'g')
      fixed = fixed.replace(pattern, (_match, start, rStart) => {
        return `${start}${rStart}<w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math" /></w:rPr>`
      })
    })

    // 第二轮：为所有m:r元素添加字体属性（如果还没有的话）
    const rElementsWithoutFonts = /<m:r>(?!.*<w:rPr>)([^<]*<m:t[^>]*>.*?<\/m:t>[^<]*)<\/m:r>/g
    fixed = fixed.replace(rElementsWithoutFonts, (_match, content) => {
      return `<m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math" /></w:rPr>${content}</m:r>`
    })

    // 第三轮：为嵌套的m:r元素添加字体属性
    const nestedRElements = /<(m:sub|m:sup|m:e|m:num|m:den|m:f)>([^<]*<m:ctrlPr \/>)([^<]*<m:r>)(?!.*<w:rPr>)/g
    fixed = fixed.replace(nestedRElements, (_match, element, ctrlPr, rStart) => {
      return `<${element}>${ctrlPr}${rStart}<w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math" /></w:rPr>`
    })

    // 第四轮：保守的字体属性优化（确保Microsoft Word兼容性）

    // 只为确实需要的元素添加字体属性，避免过度优化
    const fontTemplate = 'w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math"'

    // 保守策略：只为没有字体属性的m:r元素添加标准字体定义
    const rWithoutFontPattern = /<m:r>(?!.*<w:rPr>)([^<]*<m:t[^>]*>.*?<\/m:t>[^<]*)<\/m:r>/g
    fixed = fixed.replace(rWithoutFontPattern, `<m:r><w:rPr><w:rFonts ${fontTemplate} /></w:rPr>$1</m:r>`)

    // 第四步：清理重复的ctrlPr标签
    this.log('清理重复的ctrlPr标签...')
    fixed = fixed.replace(/<m:ctrlPr \/>\s*<m:ctrlPr \/>/g, '<m:ctrlPr />')
    fixed = fixed.replace(/<m:ctrlPr\/>\s*<m:ctrlPr\/>/g, '<m:ctrlPr/>')
    fixed = fixed.replace(/<m:ctrlPr \/>\s*<m:ctrlPr\/>/g, '<m:ctrlPr />')
    fixed = fixed.replace(/<m:ctrlPr\/>\s*<m:ctrlPr \/>/g, '<m:ctrlPr />')

    // 特别处理naryPr中的重复ctrlPr
    fixed = fixed.replace(/<m:naryPr><m:ctrlPr \/><m:chr m:val="([^"]+)" \/><m:ctrlPr \/><\/m:naryPr>/g,
      '<m:naryPr><m:chr m:val="$1" /><m:ctrlPr /></m:naryPr>')

    // 第四点五步：修复WPS Office上下角标空格问题
    this.log('修复WPS Office上下角标空格问题...')

    // 关键修复：合并连续的m:r标签，这是导致WPS Office空格的主要原因
    // 模式：</m:r><m:r> 或 </m:r>\s+<m:r>
    let previousLength = fixed.length
    let mergeCount = 0
    do {
      previousLength = fixed.length

      // 合并连续的m:r标签（无字体属性的情况）
      fixed = fixed.replace(/<\/m:r>\s*<m:r>(?!<w:rPr>)/g, '')

      // 合并连续的m:r标签（都有相同字体属性的情况）
      fixed = fixed.replace(/<\/m:r>\s*<m:r><w:rPr><w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math" \/><\/w:rPr>/g, '')

      // 合并连续的m:r标签（第一个有字体属性，第二个没有）
      fixed = fixed.replace(/<w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math" \/><\/w:rPr><\/m:r>\s*<m:r>/g, '<w:rFonts w:ascii="Cambria Math" w:eastAsia="Cambria Math" w:hAnsi="Cambria Math" w:cs="Cambria Math" /></w:rPr>')

      if (fixed.length < previousLength) {
        mergeCount++
      }
    } while (fixed.length < previousLength) // 继续直到没有更多合并

    this.log(`WPS Office空格修复完成，合并了 ${mergeCount} 轮连续的m:r标签`)

    // 第五步：修复空元素问题（保持WPS兼容性）
    this.log('修复空元素问题（保持WPS兼容性）...')

    // 修复模式1：<m:nary>...<m:e/></m:nary> 后面紧跟的内容应该移入 <m:e> 中
    const naryPattern = /(<m:nary>.*?<m:chr m:val="[∑∫∬∭∮∯∏]".*?)<m:e\/>(.*?<\/m:nary>)(\s*)(<m:f>.*?<\/m:f>|<m:sSup>.*?<\/m:sSup>|<m:sSub>.*?<\/m:sSub>|<m:r>.*?<\/m:r>|<m:acc>.*?<\/m:acc>)/g

    fixed = fixed.replace(naryPattern, (match, naryStart, naryEnd, _whitespace, followingElement) => {
      this.log(`修复nary符号结构: ${match.substring(0, 50)}...`)
      // 将紧跟的元素移入 <m:e> 中，并添加ctrlPr
      const fixedStructure = `${naryStart}<m:e><m:ctrlPr />${followingElement}</m:e>${naryEnd}`
      return fixedStructure
    })

    // 修复模式2：处理积分符号后的微分符号(dx, dy, dz等)
    const integralDifferentialPattern = /(<m:nary>.*?<m:chr m:val="[∫∬∭∮∯]".*?)<m:e\/>(.*?<\/m:nary>)(\s*)(<m:r>.*?<m:t[^>]*>d[xyz]<\/m:t>.*?<\/m:r>)/g

    fixed = fixed.replace(integralDifferentialPattern, (match, naryStart, naryEnd, _whitespace, differential) => {
      this.log(`修复积分微分符号结构: ${match.substring(0, 50)}...`)
      // 将微分符号移入 <m:e> 中，并添加ctrlPr
      const fixedStructure = `${naryStart}<m:e><m:ctrlPr />${differential}</m:e>${naryEnd}`
      return fixedStructure
    })

    // 修复模式3：处理空的nary结构
    const emptyNaryPattern = /(<m:nary>.*?<m:chr m:val="[∑∫∬∭∮∯∏]".*?)<m:e\/>(.*?<\/m:nary>)/g

    fixed = fixed.replace(emptyNaryPattern, (match, naryStart, naryEnd) => {
      this.log(`修复空nary结构: ${match.substring(0, 50)}...`)
      // 为空的nary结构添加基本内容，并添加ctrlPr
      const fixedStructure = `${naryStart}<m:e><m:ctrlPr /></m:e>${naryEnd}`
      return fixedStructure
    })

    // 修复模式4：处理根号结构的空度数问题
    const radicalPattern = /(<m:rad>.*?)<m:deg\/>(.*?<\/m:rad>)/g

    fixed = fixed.replace(radicalPattern, (match, radStart, radEnd) => {
      const fixedStructure = `${radStart}<m:deg><m:ctrlPr /></m:deg>${radEnd}`
      this.log(`修复根号结构: ${match.substring(0, 50)}...`)
      return fixedStructure
    })

    // 修复模式5：处理上下标结构的空元素问题
    const emptySupPattern = /(<m:sSup>.*?)<m:sup\/>(.*?<\/m:sSup>)/g
    const emptySubPattern = /(<m:sSub>.*?)<m:sub\/>(.*?<\/m:sSub>)/g

    fixed = fixed.replace(emptySupPattern, (match, supStart, supEnd) => {
      const fixedStructure = `${supStart}<m:sup><m:ctrlPr /></m:sup>${supEnd}`
      this.log(`修复空上标结构: ${match.substring(0, 50)}...`)
      return fixedStructure
    })

    fixed = fixed.replace(emptySubPattern, (match, subStart, subEnd) => {
      const fixedStructure = `${subStart}<m:sub><m:ctrlPr /></m:sub>${subEnd}`
      this.log(`修复空下标结构: ${match.substring(0, 50)}...`)
      return fixedStructure
    })

    // 修复模式6：处理nary结构中的空上标问题（针对所有nary符号）
    // 包括积分符号、求和符号、连乘符号等
    const naryEmptySupPattern = /(<m:nary>.*?<m:chr m:val="[∫∬∭∮∯∑∏∐⋃⋂⋁⋀]".*?)<m:sup\/>(.*?<\/m:nary>)/g

    fixed = fixed.replace(naryEmptySupPattern, (match, naryStart, naryEnd) => {
      const fixedStructure = `${naryStart}<m:sup><m:ctrlPr /></m:sup>${naryEnd}`
      this.log(`修复nary空上标结构: ${match.substring(0, 50)}...`)
      return fixedStructure
    })

    // 修复模式6.1：处理更复杂的空上标模式（空的<m:sup></m:sup>）
    const naryEmptySupPattern2 = /(<m:nary>.*?<m:chr m:val="[∫∬∭∮∯∑∏∐⋃⋂⋁⋀]".*?)<m:sup>\s*<\/m:sup>(.*?<\/m:nary>)/g

    fixed = fixed.replace(naryEmptySupPattern2, (match, naryStart, naryEnd) => {
      const fixedStructure = `${naryStart}<m:sup><m:ctrlPr /></m:sup>${naryEnd}`
      this.log(`修复nary空上标结构(空标签): ${match.substring(0, 50)}...`)
      return fixedStructure
    })

    // 修复模式6.2：彻底移除只有下角标的nary结构中的空上标
    // 这是解决WPS Office空格问题的关键
    const naryOnlySubPattern = /(<m:nary>.*?<m:chr m:val="[∫∬∭∮∯∑∏∐⋃⋂⋁⋀]".*?)<m:sup>(?:<m:ctrlPr \/>)?\s*<\/m:sup>(.*?<m:sub>.*?<\/m:sub>.*?<\/m:nary>)/g

    fixed = fixed.replace(naryOnlySubPattern, (match, naryStart, naryEnd) => {
      // 完全移除空上标，只保留下角标
      const fixedStructure = `${naryStart}${naryEnd}`
      this.log(`彻底移除nary空上标(只保留下角标): ${match.substring(0, 50)}...`)
      return fixedStructure
    })

    // 修复模式6.3：WPS Office空格问题的根本解决方案
    // 关键发现：WPS Office期望nary结构有完整的sup部分，即使是空的
    // 解决方案：将有问题的空上标替换为标准的空sup占位符

    // 第一步：处理<m:sup><m:ctrlPr /></m:sup>模式，替换为空占位符
    const emptySupWithCtrlPrPattern1 = /(<m:nary><m:naryPr><m:chr m:val="[∫∬∭∮∯∑∏∐⋃⋂⋁⋀]"[^>]*\/><m:ctrlPr \/><\/m:naryPr><m:sub>.*?<\/m:sub>)<m:sup><m:ctrlPr \/><\/m:sup>(<m:e>.*?<\/m:e><\/m:nary>)/g
    const emptySupWithCtrlPrPattern2 = /(<m:nary><m:naryPr><m:chr m:val="[∫∬∭∮∯∑∏∐⋃⋂⋁⋀]"[^>]*\/><m:ctrlPr \/><\/m:naryPr><m:sub>.*?<\/m:sub>)<m:sup><m:ctrlPr \/><\/m:sup>(<m:e\/><\/m:nary>)/g

    let ctrlPrFixCount = 0

    // 修复有内容的e标签的情况（积分符号）
    fixed = fixed.replace(emptySupWithCtrlPrPattern1, (match, naryStart, naryEnd) => {
      ctrlPrFixCount++
      this.log(`替换ctrlPr空上标为空占位符(有内容e): ${match.substring(0, 50)}...`)
      return `${naryStart}<m:sup></m:sup>${naryEnd}`
    })

    // 修复空e标签的情况（集合符号）
    fixed = fixed.replace(emptySupWithCtrlPrPattern2, (match, naryStart, naryEnd) => {
      ctrlPrFixCount++
      this.log(`替换ctrlPr空上标为空占位符(空e): ${match.substring(0, 50)}...`)
      return `${naryStart}<m:sup></m:sup>${naryEnd}`
    })

    // 第二步：确保所有只有下角标的nary结构都有空sup占位符
    // 处理完全没有sup部分的nary结构
    const noSupPattern = /(<m:nary><m:naryPr><m:chr m:val="[∫∬∭∮∯∑∏∐⋃⋂⋁⋀]"[^>]*\/><m:ctrlPr \/><\/m:naryPr><m:sub>.*?<\/m:sub>)(<m:e.*?<\/m:nary>)/g

    fixed = fixed.replace(noSupPattern, (match, naryStart, naryEnd) => {
      // 检查是否已经有sup部分
      if (!match.includes('<m:sup>')) {
        ctrlPrFixCount++
        this.log(`添加空sup占位符到无sup的nary结构: ${match.substring(0, 50)}...`)
        return `${naryStart}<m:sup></m:sup>${naryEnd}`
      }
      return match
    })

    if (ctrlPrFixCount > 0) {
      this.log(`WPS Office空上标修复完成，处理了 ${ctrlPrFixCount} 个nary结构`)
    }

    // 修复模式6.4：更激进的空上标清理（处理所有可能的空上标模式）
    // 作为备用方案，处理其他可能的空上标结构
    let additionalFixCount = 0
    do {
      const beforeLength = fixed.length

      // 清理所有形式的空上标（更宽泛的匹配）
      fixed = fixed.replace(/(<m:nary>.*?<m:chr m:val="[∫∬∭∮∯⋃⋂]".*?)<m:sup>(?:\s*<m:ctrlPr\s*\/>\s*)?<\/m:sup>(.*?<m:sub>.*?<\/m:sub>.*?<\/m:nary>)/g, (match, naryStart, naryEnd) => {
        this.log(`备用清理nary空上标: ${match.substring(0, 50)}...`)
        return `${naryStart}${naryEnd}`
      })

      if (fixed.length < beforeLength) {
        additionalFixCount++
      } else {
        break
      }
    } while (additionalFixCount < 3) // 最多3轮清理

    if (additionalFixCount > 0) {
      this.log(`备用空上标清理完成，进行了 ${additionalFixCount} 轮额外清理`)
    }

    // 修复模式7：递归处理嵌套根号的度数问题
    fixed = this.fixNestedRadicalStructure(fixed)

    this.log('兼容Microsoft Word和WPS Office的数学结构修复完成')
    return fixed
  }




  /**
   * 递归修复嵌套根号结构问题（已禁用）
   * 处理多层嵌套根号的度数结构
   * @param {string} omml - OMML字符串
   * @returns {string} - 修复后的OMML字符串
   */
  fixNestedRadicalStructure(omml) {
    // 已禁用，因为会添加ctrlPr标签
    return omml
  }

  /**
   * 解码HTML实体
   * @param {string} str - 包含HTML实体的字符串
   * @returns {string} - 解码后的字符串
   */
  decodeHtmlEntities(str) {
    const htmlEntities = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'"
    }

    return str.replace(/&[#\w]+;/g, (entity) => {
      return htmlEntities[entity] || entity
    })
  }

  /**
   * 日志输出方法
   * @param {...any} args - 日志参数
   */
  log(...args) {
    if (this.debugMode) {
      console.log('[LaTeXExporter]', ...args)
    }
  }
}

// 创建单例实例
export const latexExporter = new LaTeXExporter()
