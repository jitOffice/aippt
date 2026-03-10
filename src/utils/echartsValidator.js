/**
 * ECharts配置验证和降级机制
 * 确保AI生成的配置始终有效且可渲染
 */

class EChartsValidator {
  constructor() {
    this.validationRules = {
      // 基础结构验证
      STRUCTURE: {
        required: ['series'],
        optional: ['title', 'tooltip', 'legend', 'xAxis', 'yAxis', 'grid', 'color']
      },
      
      // 系列数据验证
      SERIES: {
        requiredFields: ['type', 'data'],
        validTypes: ['bar', 'line', 'pie', 'scatter', 'area', 'horizontalBar', 'candlestick'],
        maxSeries: 10,
        minDataPoints: 1,
        maxDataPoints: 1000
      },
      
      // 数据验证
      DATA: {
        numericOnly: true,
        allowNegative: true,
        allowZero: true,
        maxDecimalPlaces: 6
      },
      
      // 性能限制
      PERFORMANCE: {
        maxCategories: 50,
        maxSeries: 8,
        maxDataPointsPerSeries: 200,
        maxTotalDataPoints: 1000
      }
    };
    
    this.fallbackTemplates = {
      BASIC_BAR: {
        title: { text: '数据可视化' },
        xAxis: { type: 'category', data: ['类别1', '类别2', '类别3'] },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: [10, 20, 30] }]
      },
      
      BASIC_LINE: {
        title: { text: '趋势分析' },
        xAxis: { type: 'category', data: ['1月', '2月', '3月'] },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [15, 25, 35] }]
      },
      
      BASIC_PIE: {
        title: { text: '占比分析' },
        series: [{
          type: 'pie',
          data: [
            { name: '类别A', value: 30 },
            { name: '类别B', value: 70 }
          ]
        }]
      }
    };
  }

  /**
   * 主验证入口
   * @param {Object} config - ECharts配置对象
   * @param {Object} options - 验证选项
   * @returns {Object} 验证结果
   */
  validate(config, options = {}) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      fixedConfig: null
    };

    try {
      // 基础结构验证
      this.validateStructure(config, result);
      
      // 系列数据验证
      this.validateSeries(config, result);
      
      // 数据质量验证
      this.validateDataQuality(config, result);
      
      // 性能优化建议
      this.checkPerformance(config, result);
      
      // 生成修复后的配置
      if (result.errors.length > 0) {
        result.fixedConfig = this.applyFixes(config, result.errors);
      } else {
        result.fixedConfig = config;
      }
      
      // 最终有效性判断
      result.isValid = result.errors.length === 0;
      
    } catch (error) {
      result.isValid = false;
      result.errors.push({
        type: 'VALIDATION_ERROR',
        message: `验证过程异常: ${error.message}`,
        severity: 'critical'
      });
      result.fixedConfig = this.getSafeFallback(config);
    }

    return result;
  }

  /**
   * 基础结构验证
   */
  validateStructure(config, result) {
    const { required, optional } = this.validationRules.STRUCTURE;
    
    // 检查必需字段
    required.forEach(field => {
      if (!config[field]) {
        result.errors.push({
          type: 'MISSING_REQUIRED_FIELD',
          field,
          message: `缺少必需字段: ${field}`,
          severity: 'critical'
        });
      }
    });
    
    // 检查未知字段
    const allValidFields = [...required, ...optional];
    Object.keys(config).forEach(field => {
      if (!allValidFields.includes(field)) {
        result.warnings.push({
          type: 'UNKNOWN_FIELD',
          field,
          message: `未知字段: ${field}`,
          severity: 'warning'
        });
      }
    });
  }

  /**
   * 系列数据验证
   */
  validateSeries(config, result) {
    if (!config.series || !Array.isArray(config.series)) {
      result.errors.push({
        type: 'INVALID_SERIES',
        message: 'series必须是数组',
        severity: 'critical'
      });
      return;
    }

    const { requiredFields, validTypes, maxSeries } = this.validationRules.SERIES;
    
    // 检查系列数量
    if (config.series.length > maxSeries) {
      result.warnings.push({
        type: 'TOO_MANY_SERIES',
        message: `系列数量过多 (${config.series.length})，建议不超过 ${maxSeries} 个`,
        severity: 'warning'
      });
    }
    
    // 验证每个系列
    config.series.forEach((series, index) => {
      // 检查必需字段
      requiredFields.forEach(field => {
        if (series[field] === undefined) {
          result.errors.push({
            type: 'MISSING_SERIES_FIELD',
            field: `${index}.${field}`,
            message: `系列[${index}]缺少字段: ${field}`,
            severity: 'error'
          });
        }
      });
      
      // 验证图表类型
      if (series.type && !validTypes.includes(series.type)) {
        result.warnings.push({
          type: 'INVALID_CHART_TYPE',
          field: `${index}.type`,
          message: `不支持的图表类型: ${series.type}`,
          severity: 'warning',
          suggestion: `建议使用: ${validTypes.join(', ')}`
        });
      }
      
      // 验证数据
      this.validateSeriesData(series, index, result);
    });
  }

  /**
   * 系列数据验证
   */
  validateSeriesData(series, index, result) {
    const { minDataPoints, maxDataPoints } = this.validationRules.SERIES;
    const { numericOnly, allowNegative, allowZero, maxDecimalPlaces } = this.validationRules.DATA;
    
    if (!Array.isArray(series.data)) {
      result.errors.push({
        type: 'INVALID_DATA_FORMAT',
        field: `${index}.data`,
        message: `系列[${index}]的数据必须是数组`,
        severity: 'error'
      });
      return;
    }
    
    // 检查数据点数量
    if (series.data.length < minDataPoints) {
      result.errors.push({
        type: 'INSUFFICIENT_DATA',
        field: `${index}.data`,
        message: `系列[${index}]数据点过少 (${series.data.length})`,
        severity: 'error'
      });
    }
    
    if (series.data.length > maxDataPoints) {
      result.warnings.push({
        type: 'EXCESSIVE_DATA',
        field: `${index}.data`,
        message: `系列[${index}]数据点过多 (${series.data.length})`,
        severity: 'warning'
      });
    }
    
    // 验证数据值
    series.data.forEach((value, dataIndex) => {
      const path = `${index}.data[${dataIndex}]`;
      
      // 数值验证
      if (numericOnly && typeof value !== 'number') {
        result.errors.push({
          type: 'NON_NUMERIC_VALUE',
          field: path,
          message: `数据必须是数值类型: ${typeof value}`,
          severity: 'error'
        });
        return;
      }
      
      // 负数验证
      if (!allowNegative && value < 0) {
        result.warnings.push({
          type: 'NEGATIVE_VALUE',
          field: path,
          message: `发现负数值: ${value}`,
          severity: 'warning'
        });
      }
      
      // 小数位数验证
      if (typeof value === 'number' && maxDecimalPlaces) {
        const decimalPlaces = (value.toString().split('.')[1] || '').length;
        if (decimalPlaces > maxDecimalPlaces) {
          result.warnings.push({
            type: 'EXCESSIVE_DECIMAL_PLACES',
            field: path,
            message: `小数位数过多 (${decimalPlaces})，建议不超过 ${maxDecimalPlaces} 位`,
            severity: 'warning'
          });
        }
      }
    });
  }

  /**
   * 数据质量验证
   */
  validateDataQuality(config, result) {
    // 检查空数据
    if (config.series) {
      const hasAnyData = config.series.some(series => 
        series.data && series.data.length > 0 && 
        series.data.some(val => val !== null && val !== undefined)
      );
      
      if (!hasAnyData) {
        result.errors.push({
          type: 'EMPTY_DATA',
          message: '所有系列都为空数据',
          severity: 'critical'
        });
      }
    }
    
    // 检查异常值
    this.checkOutliers(config, result);
    
    // 检查数据一致性
    this.checkDataConsistency(config, result);
  }

  /**
   * 异常值检测
   */
  checkOutliers(config, result) {
    if (!config.series) return;
    
    config.series.forEach((series, index) => {
      if (!Array.isArray(series.data)) return;
      
      const numericData = series.data.filter(val => typeof val === 'number');
      if (numericData.length === 0) return;
      
      const mean = numericData.reduce((a, b) => a + b, 0) / numericData.length;
      const variance = numericData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericData.length;
      const stdDev = Math.sqrt(variance);
      
      numericData.forEach((value, dataIndex) => {
        const zScore = Math.abs((value - mean) / stdDev);
        if (zScore > 3) { // 3σ准则
          result.warnings.push({
            type: 'OUTLIER_DETECTED',
            field: `${index}.data[${dataIndex}]`,
            message: `检测到异常值: ${value} (Z-score: ${zScore.toFixed(2)})`,
            severity: 'warning'
          });
        }
      });
    });
  }

  /**
   * 数据一致性检查
   */
  checkDataConsistency(config, result) {
    // 检查X轴数据长度一致性
    if (config.xAxis && config.xAxis.data && config.series) {
      const xAxisLength = config.xAxis.data.length;
      config.series.forEach((series, index) => {
        if (series.data && series.data.length !== xAxisLength) {
          result.warnings.push({
            type: 'DATA_LENGTH_MISMATCH',
            field: `${index}.data`,
            message: `系列[${index}]数据长度(${series.data.length})与X轴(${xAxisLength})不匹配`,
            severity: 'warning'
          });
        }
      });
    }
  }

  /**
   * 性能检查
   */
  checkPerformance(config, result) {
    const { maxCategories, maxSeries, maxDataPointsPerSeries, maxTotalDataPoints } = this.validationRules.PERFORMANCE;
    
    // 类别数量检查
    if (config.xAxis && config.xAxis.data) {
      const categoryCount = config.xAxis.data.length;
      if (categoryCount > maxCategories) {
        result.warnings.push({
          type: 'TOO_MANY_CATEGORIES',
          message: `类别数量过多 (${categoryCount})，可能影响渲染性能`,
          severity: 'performance',
          suggestion: '考虑数据聚合或分页显示'
        });
      }
    }
    
    // 系列性能检查
    if (config.series && config.series.length > maxSeries) {
      result.warnings.push({
        type: 'PERFORMANCE_WARNING',
        message: `系列数量较多 (${config.series.length})，可能影响交互性能`,
        severity: 'performance'
      });
    }
    
    // 数据点性能检查
    if (config.series) {
      let totalPoints = 0;
      config.series.forEach((series, index) => {
        if (series.data) {
          const pointCount = series.data.length;
          totalPoints += pointCount;
          
          if (pointCount > maxDataPointsPerSeries) {
            result.warnings.push({
              type: 'PERFORMANCE_WARNING',
              field: `${index}.data`,
              message: `单个系列数据点过多 (${pointCount})`,
              severity: 'performance',
              suggestion: '启用大数据优化模式'
            });
          }
        }
      });
      
      if (totalPoints > maxTotalDataPoints) {
        result.warnings.push({
          type: 'PERFORMANCE_WARNING',
          message: `总数据点过多 (${totalPoints})，严重影响性能`,
          severity: 'performance',
          suggestion: '强烈建议启用采样或聚合'
        });
      }
    }
  }

  /**
   * 应用修复
   */
  applyFixes(config, errors) {
    const fixedConfig = JSON.parse(JSON.stringify(config)); // 深拷贝
    
    errors.forEach(error => {
      switch (error.type) {
        case 'MISSING_REQUIRED_FIELD':
          if (error.field === 'series') {
            fixedConfig.series = [{ type: 'bar', data: [0] }];
          }
          break;
          
        case 'INVALID_SERIES':
          fixedConfig.series = [{ type: 'bar', data: [0] }];
          break;
          
        case 'INVALID_CHART_TYPE':
          // 修正无效的图表类型
          const seriesIndex = parseInt(error.field);
          if (fixedConfig.series[seriesIndex]) {
            fixedConfig.series[seriesIndex].type = 'bar';
          }
          break;
          
        case 'NON_NUMERIC_VALUE':
          // 尝试转换为数值
          const [seriesIdx, , dataIdx] = error.field.split(/[\.\[\]]+/);
          const value = fixedConfig.series[seriesIdx]?.data[dataIdx];
          if (value !== undefined) {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue)) {
              fixedConfig.series[seriesIdx].data[dataIdx] = numericValue;
            } else {
              fixedConfig.series[seriesIdx].data[dataIdx] = 0;
            }
          }
          break;
      }
    });
    
    return fixedConfig;
  }

  /**
   * 获取安全的降级配置
   */
  getSafeFallback(originalConfig) {
    // 根据原始配置选择合适的模板
    if (originalConfig && originalConfig.series && originalConfig.series[0]) {
      const chartType = originalConfig.series[0].type;
      
      switch (chartType) {
        case 'line':
          return this.fallbackTemplates.BASIC_LINE;
        case 'pie':
          return this.fallbackTemplates.BASIC_PIE;
        default:
          return this.fallbackTemplates.BASIC_BAR;
      }
    }
    
    return this.fallbackTemplates.BASIC_BAR;
  }

  /**
   * 生成优化建议
   */
  generateSuggestions(validationResult) {
    const suggestions = [];
    
    // 性能优化建议
    validationResult.warnings.forEach(warning => {
      if (warning.severity === 'performance') {
        suggestions.push({
          type: 'PERFORMANCE_OPTIMIZATION',
          priority: 'high',
          message: warning.message,
          suggestion: warning.suggestion || '启用性能优化模式'
        });
      }
    });
    
    // 可视化改进建议
    if (validationResult.warnings.some(w => w.type === 'TOO_MANY_CATEGORIES')) {
      suggestions.push({
        type: 'VISUALIZATION_IMPROVEMENT',
        priority: 'medium',
        message: '类别过多影响可读性',
        suggestion: '考虑使用横向柱状图或数据分组'
      });
    }
    
    return suggestions;
  }
}

/**
 * 实时配置监控Hook
 */
export function useConfigValidation() {
  const validator = new EChartsValidator();
  const validationState = ref({
    isValid: false,
    errors: [],
    warnings: [],
    suggestions: []
  });

  const validateConfig = (config) => {
    const result = validator.validate(config);
    validationState.value = result;
    return result;
  };

  const getFixedConfig = () => {
    return validationState.value.fixedConfig;
  };

  return {
    validationState,
    validateConfig,
    getFixedConfig
  };
}

/**
 * 配置健康度评分
 */
export function calculateConfigHealth(config) {
  const validator = new EChartsValidator();
  const result = validator.validate(config);
  
  let score = 100;
  
  // 扣分规则
  result.errors.forEach(error => {
    switch (error.severity) {
      case 'critical':
        score -= 30;
        break;
      case 'error':
        score -= 15;
        break;
    }
  });
  
  result.warnings.forEach(warning => {
    switch (warning.severity) {
      case 'warning':
        score -= 5;
        break;
      case 'performance':
        score -= 3;
        break;
    }
  });
  
  return Math.max(0, score);
}

export default new EChartsValidator();