/**
 * 智能图表类型检测和推荐系统
 * 基于文本内容和数据特征自动选择最合适的图表类型
 */

class SmartChartDetector {
  constructor() {
    this.patterns = {
      // 时间序列模式
      TIME_SERIES: [
        /\b(时间|日期|月份|季度|年份|time|date|month|quarter|year)\b/i,
        /\b(增长|下降|趋势|变化|increase|decrease|trend|change)\b/i,
        /\b(\d{4}[-年]\d{1,2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i
      ],
      
      // 占比关系模式
      PROPORTION: [
        /\b(占比|比例|百分比|份额|percentage|ratio|share|构成|distribution)\b/i,
        /[百分之\d]+|%/,
        /\b(饼图|圆形|circle|pie)\b/i
      ],
      
      // 相关性分析模式
      CORRELATION: [
        /\b(相关|关联|correlation|relationship|散点|scatter)\b/i,
        /\bx[:：].+y\b/i,
        /\b(正相关|负相关|positive|negative)\b/i
      ],
      
      // 横向对比模式
      HORIZONTAL_COMPARISON: [
        /\b(排名|排行|rank|top|领先|落后)\b/i,
        /\b(对比|比较|comparison|versus|vs)\b/i,
        /.{50,}横向.{50,}/i  // 长文本中的横向关键词
      ],
      
      // 地理数据模式
      GEOGRAPHIC: [
        /\b(地区|城市|省份|国家|region|city|province|country)\b/i,
        /\b(地图|地理|geographic|map)\b/i,
        /\b(lat|lng|longitude|latitude)\b/i
      ],
      
      // 金融数据模式
      FINANCIAL: [
        /\b(股价|股票|stock|price|市值|market cap)\b/i,
        /\b(收益|利润|profit|revenue|财务|financial)\b/i,
        /\$(\d+(?:\.\d{2})?)\b/,
        /\b(USD|EUR|CNY|currency)\b/i
      ]
    };
    
    this.scoringWeights = {
      confidence: 0.4,    // 置信度权重
      dataMatch: 0.3,     // 数据匹配度权重
      contextFit: 0.2,    // 上下文适配权重
      userPreference: 0.1 // 用户偏好权重
    };
  }

  /**
   * 主要检测入口
   * @param {string} text - 输入文本
   * @param {Object} context - 上下文信息
   * @returns {Object} 检测结果
   */
  detectBestChartType(text, context = {}) {
    const results = [];
    
    // 测试各种图表类型
    const chartTypes = [
      { type: 'line', detector: this.detectTimeSeries.bind(this) },
      { type: 'pie', detector: this.detectProportion.bind(this) },
      { type: 'scatter', detector: this.detectCorrelation.bind(this) },
      { type: 'horizontalBar', detector: this.detectHorizontalComparison.bind(this) },
      { type: 'map', detector: this.detectGeographic.bind(this) },
      { type: 'candlestick', detector: this.detectFinancial.bind(this) },
      { type: 'bar', detector: this.detectGeneralComparison.bind(this) }
    ];
    
    // 执行所有检测器
    chartTypes.forEach(({ type, detector }) => {
      const score = detector(text, context);
      if (score > 0) {
        results.push({ type, score });
      }
    });
    
    // 如果没有匹配，返回默认值
    if (results.length === 0) {
      return {
        type: 'bar',
        confidence: 0.3,
        reason: '未检测到明确模式，使用默认柱状图',
        alternatives: ['bar', 'line']
      };
    }
    
    // 按分数排序
    results.sort((a, b) => b.score - a.score);
    
    // 返回最佳结果
    const bestResult = results[0];
    return {
      type: bestResult.type,
      confidence: Math.min(bestResult.score, 1.0),
      reason: this.getReason(bestResult.type, bestResult.score),
      alternatives: results.slice(0, 3).map(r => r.type),
      scores: results.reduce((acc, curr) => {
        acc[curr.type] = curr.score;
        return acc;
      }, {})
    };
  }

  /**
   * 时间序列检测
   */
  detectTimeSeries(text, context) {
    let score = 0;
    
    // 基础模式匹配
    const timeMatches = this.countPatternMatches(text, this.patterns.TIME_SERIES);
    score += timeMatches * 0.3;
    
    // 数值序列检测
    const numberSequences = this.findNumberSequences(text);
    if (numberSequences.length >= 3) {
      score += 0.4;
    }
    
    // 时间格式检测
    const timeFormats = this.detectTimeFormats(text);
    score += timeFormats.length * 0.2;
    
    // 上下文增强
    if (context.domain === 'finance' || context.domain === 'business') {
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 占比关系检测
   */
  detectProportion(text, context) {
    let score = 0;
    
    // 百分比检测
    const percentageCount = (text.match(/%/g) || []).length;
    score += Math.min(percentageCount * 0.2, 0.6);
    
    // 占比关键词检测
    const proportionMatches = this.countPatternMatches(text, this.patterns.PROPORTION);
    score += proportionMatches * 0.3;
    
    // 数值总和接近100检测
    const numbers = this.extractNumbers(text);
    const sum = numbers.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 100) < 15 && numbers.length >= 2) {
      score += 0.3;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 相关性分析检测
   */
  detectCorrelation(text, context) {
    let score = 0;
    
    // 相关性关键词
    const correlationMatches = this.countPatternMatches(text, this.patterns.CORRELATION);
    score += correlationMatches * 0.4;
    
    // XY坐标对检测
    const coordinatePairs = this.findCoordinatePairs(text);
    score += Math.min(coordinatePairs.length * 0.3, 0.6);
    
    // 数学关系检测
    if (/[xy]\s*[=+\-*\/]\s*\d+/i.test(text)) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 横向对比检测
   */
  detectHorizontalComparison(text, context) {
    let score = 0;
    
    // 对比关键词
    const comparisonMatches = this.countPatternMatches(text, this.patterns.HORIZONTAL_COMPARISON);
    score += comparisonMatches * 0.3;
    
    // 长文本优势（横向图表更适合长标签）
    if (text.length > 100) {
      score += 0.2;
    }
    
    // 排名数据检测
    if (/\b(第\d+|top\s*\d+|排名|rank)\b/i.test(text)) {
      score += 0.3;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 地理数据检测
   */
  detectGeographic(text, context) {
    let score = 0;
    
    const geoMatches = this.countPatternMatches(text, this.patterns.GEOGRAPHIC);
    score += geoMatches * 0.4;
    
    // 地名检测
    const locations = this.extractLocations(text);
    score += Math.min(locations.length * 0.2, 0.4);
    
    return Math.min(score, 1.0);
  }

  /**
   * 金融数据检测
   */
  detectFinancial(text, context) {
    let score = 0;
    
    const financialMatches = this.countPatternMatches(text, this.patterns.FINANCIAL);
    score += financialMatches * 0.4;
    
    // 价格数据检测
    const pricePatterns = (text.match(/\$\d+\.?\d*/g) || []).length;
    score += Math.min(pricePatterns * 0.2, 0.4);
    
    // OHLC数据检测（开盘、最高、最低、收盘）
    if (this.hasOHLCData(text)) {
      score += 0.3;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 通用对比检测（柱状图）
   */
  detectGeneralComparison(text, context) {
    let score = 0.1; // 基础分数
    
    // 数值比较检测
    const numbers = this.extractNumbers(text);
    if (numbers.length >= 3) {
      score += 0.3;
    }
    
    // 分类数据检测
    const categories = this.extractCategories(text);
    if (categories.length >= 2) {
      score += 0.3;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * 辅助方法：统计模式匹配数量
   */
  countPatternMatches(text, patterns) {
    return patterns.reduce((count, pattern) => {
      return count + (pattern.test(text) ? 1 : 0);
    }, 0);
  }

  /**
   * 辅助方法：提取数字
   */
  extractNumbers(text) {
    const matches = text.match(/[-+]?\d*\.?\d+/g);
    return matches ? matches.map(Number).filter(n => !isNaN(n)) : [];
  }

  /**
   * 辅助方法：查找数字序列
   */
  findNumberSequences(text) {
    const numbers = this.extractNumbers(text);
    const sequences = [];
    
    for (let i = 0; i < numbers.length - 2; i++) {
      if (this.isSequential([numbers[i], numbers[i+1], numbers[i+2]])) {
        sequences.push(numbers.slice(i, i+3));
      }
    }
    
    return sequences;
  }

  /**
   * 辅助方法：检测时间格式
   */
  detectTimeFormats(text) {
    const formats = [];
    
    // YYYY-MM-DD
    if (/\d{4}-\d{2}-\d{2}/.test(text)) formats.push('YYYY-MM-DD');
    
    // MM/DD/YYYY
    if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(text)) formats.push('MM/DD/YYYY');
    
    // 月份英文
    if (/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(text)) {
      formats.push('Month');
    }
    
    return formats;
  }

  /**
   * 辅助方法：查找坐标对
   */
  findCoordinatePairs(text) {
    const pairs = [];
    const coordRegex = /[([]?\s*(-?\d+\.?\d*)\s*[,，]\s*(-?\d+\.?\d*)\s*[)\]]?/g;
    let match;
    
    while ((match = coordRegex.exec(text)) !== null) {
      pairs.push([parseFloat(match[1]), parseFloat(match[2])]);
    }
    
    return pairs;
  }

  /**
   * 辅助方法：提取地名
   */
  extractLocations(text) {
    // 简化的位置提取（实际应用中可能需要更复杂的地理实体识别）
    const locationPatterns = [
      /\b(北京|上海|广州|深圳|杭州|南京|成都|武汉|西安|重庆)\b/,
      /\b(China|USA|UK|Japan|Germany|France)\b/i
    ];
    
    return locationPatterns.filter(pattern => pattern.test(text));
  }

  /**
   * 辅助方法：检查OHLC数据
   */
  hasOHLCData(text) {
    // 检查是否存在开盘、最高、最低、收盘的数据模式
    const ohlcPattern = /开[:：]?\s*\d+\.?\d*\s*高[:：]?\s*\d+\.?\d*\s*低[:：]?\s*\d+\.?\d*\s*收[:：]?\s*\d+\.?\d*/i;
    return ohlcPattern.test(text);
  }

  /**
   * 辅助方法：判断数字是否连续
   */
  isSequential(numbers) {
    if (numbers.length < 2) return false;
    
    const diffs = [];
    for (let i = 1; i < numbers.length; i++) {
      diffs.push(Math.abs(numbers[i] - numbers[i-1]));
    }
    
    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    return avgDiff <= 5; // 允许一定的误差
  }

  /**
   * 辅助方法：提取分类数据
   */
  extractCategories(text) {
    // 简化的分类提取
    const chineseCategories = text.match(/[\u4e00-\u9fa5]{2,6}/g) || [];
    const englishCategories = text.match(/[A-Za-z]{3,12}/g) || [];
    
    return [...chineseCategories, ...englishCategories].slice(0, 10);
  }

  /**
   * 生成推荐理由
   */
  getReason(chartType, score) {
    const reasons = {
      line: `检测到时间序列数据，${score > 0.7 ? '强烈推荐' : '建议'}使用折线图展示趋势变化`,
      pie: `发现占比关系数据，${score > 0.7 ? '强烈推荐' : '建议'}使用饼图展示比例构成`,
      scatter: `识别到相关性分析需求，${score > 0.7 ? '强烈推荐' : '建议'}使用散点图探索变量关系`,
      horizontalBar: `包含横向对比数据，${score > 0.7 ? '强烈推荐' : '建议'}使用横向柱状图提升可读性`,
      map: `检测到地理位置信息，${score > 0.7 ? '强烈推荐' : '建议'}使用地图进行地理可视化`,
      candlestick: `识别金融交易数据，${score > 0.7 ? '强烈推荐' : '建议'}使用K线图展示价格波动`,
      bar: `发现分类对比数据，${score > 0.7 ? '强烈推荐' : '建议'}使用柱状图进行直观比较`
    };
    
    return reasons[chartType] || '基于数据分析特征推荐此图表类型';
  }

  /**
   * 获取图表类型说明
   */
  getChartTypeInfo(chartType) {
    const info = {
      line: {
        name: '折线图',
        description: '适用于展示数据随时间的变化趋势',
        bestFor: ['时间序列', '趋势分析', '连续数据'],
        limitations: ['不适合展示离散分类数据']
      },
      pie: {
        name: '饼图',
        description: '适用于展示各部分占总体的比例关系',
        bestFor: ['占比分析', '构成比例', '市场份额'],
        limitations: ['不宜超过8个分类', '难以比较相近数值']
      },
      scatter: {
        name: '散点图',
        description: '适用于探索两个变量之间的相关性',
        bestFor: ['相关性分析', '数据分布', '异常值检测'],
        limitations: ['大数据集可能产生重叠']
      },
      bar: {
        name: '柱状图',
        description: '适用于比较不同类别的数值大小',
        bestFor: ['分类对比', '排名展示', '基础数据比较'],
        limitations: ['长标签可能导致拥挤']
      },
      horizontalBar: {
        name: '横向柱状图',
        description: '适用于标签较长的分类数据对比',
        bestFor: ['长标签数据', '排名展示', '横向比较'],
        limitations: ['垂直空间利用效率较低']
      }
    };
    
    return info[chartType] || { name: chartType, description: '通用图表类型' };
  }
}

// 导出单例实例
export default new SmartChartDetector();