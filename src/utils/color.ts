/**
 * 统一颜色格式处理函数
 * 确保颜色格式一致：去掉#号，因为不同地方的处理方式不同
 * @param {string|null} color - 颜色值
 * @returns {string} - 处理后的颜色值
 */
export const normalizeColor = (color) => {
  if (!color) return '06c' // 默认蓝色
  return color.startsWith('#') ? color.slice(1) : color
}

/**
 * 将颜色标准化为带#号的格式
 * @param {string|null} color - 颜色值
 * @returns {string} - 带#号的颜色值
 */
export const normalizeColorWithHash = (color) => {
  if (!color) return '#333333'
  if (color.startsWith('#')) return color
  return '#' + color
}
