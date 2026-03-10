/**
 * MathML到OMML元素映射表
 * 基于OMML规范和实际测试结果
 */

/**
 * MathML元素到OMML元素的映射
 */
export const ELEMENT_MAPPINGS = {
  // 容器元素
  'math': 'oMath',
  'mrow': 'r',
  'mstyle': 'r',
  'mphantom': 'phant',
  
  // 标记元素（Token Elements）
  'mn': 'r',      // 数字
  'mi': 'r',      // 标识符
  'mo': 'r',      // 运算符
  'mtext': 'r',   // 文本
  'ms': 'r',      // 字符串
  'mspace': 'r',  // 空格
  
  // 脚本元素（Script Elements）
  'msup': 'sSup',         // 上标
  'msub': 'sSub',         // 下标
  'msubsup': 'sSubSup',   // 上下标
  'munder': 'func',       // 下标（用于函数）
  'mover': 'acc',         // 上标（用于重音）
  'munderover': 'nary',   // 上下标（用于N元运算符）
  
  // 分式（Fraction）
  'mfrac': 'f',
  
  // 根式（Radical）
  'msqrt': 'rad',
  'mroot': 'rad',
  
  // 括号（Fenced）
  'mfenced': 'd',
  
  // 表格（Table）
  'mtable': 'm',
  'mtr': 'mr',
  'mtd': 'e',
  
  // 其他
  'menclose': 'borderBox',
  'maction': 'r',
}

/**
 * N元运算符映射（积分、求和等）
 * 这些运算符需要特殊处理，转换为<m:nary>元素
 */
export const NARY_OPERATORS = {
  // 积分符号
  '∫': { chr: '∫', type: 'integral' },
  '∬': { chr: '∬', type: 'integral' },
  '∭': { chr: '∭', type: 'integral' },
  '∮': { chr: '∮', type: 'contour' },
  '∯': { chr: '∯', type: 'surface' },
  '∰': { chr: '∰', type: 'volume' },
  
  // 求和符号
  '∑': { chr: '∑', type: 'sum' },
  'Σ': { chr: '∑', type: 'sum' },
  
  // 乘积符号
  '∏': { chr: '∏', type: 'product' },
  'Π': { chr: '∏', type: 'product' },
  
  // 余积符号
  '∐': { chr: '∐', type: 'coproduct' },
  
  // 交集并集
  '⋂': { chr: '⋂', type: 'intersection' },
  '⋃': { chr: '⋃', type: 'union' },
  
  // 逻辑运算
  '⋀': { chr: '⋀', type: 'and' },
  '⋁': { chr: '⋁', type: 'or' },
}

/**
 * LaTeX命令到Unicode符号的映射
 * 用于处理KaTeX生成的MathML中的LaTeX命令
 */
export const LATEX_TO_UNICODE = {
  // 积分
  '\\int': '∫',
  '\\iint': '∬',
  '\\iiint': '∭',
  '\\oint': '∮',
  '\\oiint': '∯',
  '\\oiiint': '∰',
  
  // 求和乘积
  '\\sum': '∑',
  '\\prod': '∏',
  '\\coprod': '∐',
  
  // 极限
  '\\lim': 'lim',
  '\\limsup': 'lim sup',
  '\\liminf': 'lim inf',
  
  // 交集并集
  '\\bigcap': '⋂',
  '\\bigcup': '⋃',
  '\\bigwedge': '⋀',
  '\\bigvee': '⋁',
}

/**
 * 运算符属性映射
 * 定义运算符的显示属性
 */
export const OPERATOR_PROPERTIES = {
  // 括号类型
  brackets: {
    '(': { open: '(', close: ')' },
    '[': { open: '[', close: ']' },
    '{': { open: '{', close: '}' },
    '|': { open: '|', close: '|' },
    '⟨': { open: '⟨', close: '⟩' },
    '⌈': { open: '⌈', close: '⌉' },
    '⌊': { open: '⌊', close: '⌋' },
  },
  
  // 重音符号
  accents: {
    '̂': 'hat',
    '̃': 'tilde',
    '̄': 'bar',
    '̇': 'dot',
    '̈': 'ddot',
    '⃗': 'vec',
  },
}

/**
 * OMML属性默认值
 */
export const OMML_DEFAULTS = {
  // N元运算符属性
  nary: {
    limLoc: 'undOvr',  // 上下限位置：undOvr（上下）或 subSup（右侧）
    grow: '1',          // 符号是否随内容增长
    subHide: 'off',     // 是否隐藏下标
    supHide: 'off',     // 是否隐藏上标
  },
  
  // 分式属性
  fraction: {
    type: 'bar',        // 分数线类型：bar（横线）、skw（斜线）、lin（线性）、noBar（无线）
  },
  
  // 根式属性
  radical: {
    degHide: 'off',     // 是否隐藏根指数（平方根时为on）
  },
  
  // 括号属性
  delimiter: {
    begChr: '(',        // 开始字符
    endChr: ')',        // 结束字符
    grow: '1',          // 是否随内容增长
    shp: 'centered',    // 形状：centered（居中）、match（匹配）
  },
}

/**
 * 特殊字符转义映射
 */
export const SPECIAL_CHARS = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;',
}

/**
 * MathML属性到OMML属性的映射
 */
export const ATTRIBUTE_MAPPINGS = {
  // 字体样式
  'mathvariant': {
    'normal': 'p',
    'bold': 'b',
    'italic': 'i',
    'bold-italic': 'bi',
    'script': 'scr',
    'bold-script': 'b-scr',
    'fraktur': 'fraktur',
    'bold-fraktur': 'b-fraktur',
    'double-struck': 'double-struck',
    'sans-serif': 'sans-serif',
    'bold-sans-serif': 'b-sans-serif',
    'sans-serif-italic': 'sans-serif-i',
    'sans-serif-bold-italic': 'sans-serif-bi',
    'monospace': 'monospace',
  },
  
  // 颜色
  'mathcolor': 'color',
  'color': 'color',
  
  // 背景色
  'mathbackground': 'background',
  'background': 'background',
  
  // 大小
  'mathsize': 'size',
  'fontsize': 'size',
}

/**
 * 偏导数符号识别
 * 用于识别∂符号并正确处理
 */
export const PARTIAL_DERIVATIVE_SYMBOLS = ['∂', '\\partial']

/**
 * 向量符号识别
 */
export const VECTOR_SYMBOLS = ['⃗', '\\vec']

/**
 * 矩阵类型识别
 */
export const MATRIX_TYPES = {
  'matrix': 'matrix',
  'pmatrix': 'pmatrix',   // 圆括号
  'bmatrix': 'bmatrix',   // 方括号
  'Bmatrix': 'Bmatrix',   // 花括号
  'vmatrix': 'vmatrix',   // 竖线（行列式）
  'Vmatrix': 'Vmatrix',   // 双竖线
}

