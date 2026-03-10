// @ts-nocheck
import FingerprintJS from '@fingerprintjs/fingerprintjs';
/**
 * 随机生成8种预设的美观颜色（与白色文字兼容）
 * @returns {string} 十六进制颜色值（如 '#FF5252'）
 */
function generateRandomColor() {
  // 预设8种高对比度、美观的颜色（与白色文字搭配）
  const colors = [
    '#FF5252', // 红色 - 鲜明突出
    '#FF9800', // 橙色 - 活力温暖
    '#FFEB3B', // 黄色 - 明亮醒目
    '#4CAF50', // 绿色 - 自然清新
    '#2196F3', // 蓝色 - 专业可靠
    '#9C27B0', // 紫色 - 优雅神秘
    '#00BCD4', // 青色 - 科技感
    '#795548', // 棕色 - 稳重自然
  ];

  // 随机选择一种颜色
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * 从浏览器URL参数中获取指定字段的值
 * @param {string} field - 需要获取的字段名
 * @param {Object} [options] - 可选配置项
 * @param {boolean} [options.parseNumbers=false] - 是否将数值字符串转换为数字
 * @param {boolean} [options.parseBooleans=false] - 是否将布尔字符串转换为布尔值
 * @param {boolean} [options.arrayMode=false] - 是否强制返回数组（用于重复参数）
 * @param {string|number|boolean|null} [options.defaultValue=null] - 字段不存在时的默认值
 * @returns {string|number|boolean|Array|string[]|null} 解析后的字段值
 */
function getUrlParam(field, options = {}) {
  const {
    parseNumbers = false,
    parseBooleans = false,
    arrayMode = false,
    defaultValue = null
  } = options;

  try {
    // 获取URL中的查询字符串部分
    const queryString = window.location.search;
    if (!queryString) return defaultValue;

    // 创建URLSearchParams对象
    const urlParams = new URLSearchParams(queryString);

    // 处理数组模式
    if (arrayMode) {
      const values = urlParams.getAll(field);
      if (values.length === 0) return defaultValue;

      return values.map(value => {
        if (parseNumbers && !isNaN(Number(value))) return Number(value);
        if (parseBooleans) {
          if (value.toLowerCase() === 'true') return true;
          if (value.toLowerCase() === 'false') return false;
        }
        return value;
      });
    }

    // 处理单个值
    if (!urlParams.has(field)) return defaultValue;

    const value = urlParams.get(field);

    // 类型转换
    if (parseNumbers && !isNaN(Number(value))) return Number(value);
    if (parseBooleans) {
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
    }

    return value;
  } catch (error) {
    console.error(`解析URL参数时出错: ${error.message}`);
    return defaultValue;
  }
}

// 实现节流函数
function throttle(func, limit) {
  let inThrottle: boolean;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// y-websocket 服务地址（开发环境需使用 ws:// 协议）
const ws_url = process.env.BASE_WS_URL;

const createBrowserId = async () => {
  // 初始化
  const fpPromise = FingerprintJS.load();

  // 获取指纹
  const result = await fpPromise.then(fp => fp.get());
  return result.visitorId;
}

export { generateRandomColor, throttle, getUrlParam, ws_url, createBrowserId };
