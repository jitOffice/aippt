/**
 * Convert string to kebab-case
 * @param {string} str - The string to convert
 * @returns {string} - The kebab-case string
 */
export function convertToKebabCase(str) {
  if (!str) return ''
  
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')  // camelCase to kebab-case
    .replace(/[\s_]+/g, '-')               // spaces and underscores to hyphens
    .toLowerCase()
}
