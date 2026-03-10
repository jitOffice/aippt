import { computed } from 'vue'

/**
 * Editor Header 组合式函数
 * 提供头部组件所需的图标和工具函数
 */
export function useEditorHeader() {
  // SVG 图标定义
  const iconUser = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
  
  const iconAIWand = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"/></svg>'
  
  const iconHistory = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>'
  
  const iconMore = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>'
  
  const iconEye = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>'
  
  const iconShare = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>'
  const iconGlobe = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m6.93 6h-3.58a15.89 15.89 0 0 0-1.23-3.33A8.02 8.02 0 0 1 18.93 8M12 4.06c.83 1.24 1.5 2.68 1.96 4.24H10.04c.46-1.56 1.13-3 1.96-4.24M4.26 14a7.89 7.89 0 0 1 0-4h3.58c-.1.65-.16 1.31-.16 2s.06 1.35.16 2zm.81 2h3.58c.32 1.54.83 2.98 1.48 4.17A8.03 8.03 0 0 1 5.07 16M8.65 8H5.07a8.03 8.03 0 0 1 5.05-4.17C9.48 5.02 8.97 6.46 8.65 8m2.35 12c-.83-1.24-1.5-2.68-1.96-4.24h3.92c-.46 1.56-1.13 3-1.96 4.24M14.16 14H9.84c-.11-.65-.18-1.31-.18-2s.07-1.35.18-2h4.32c.11.65.18 1.31.18 2s-.07 1.35-.18 2m.71 6.17c.65-1.19 1.16-2.63 1.48-4.17h3.58a8.03 8.03 0 0 1-5.06 4.17M16.16 10h3.58a7.89 7.89 0 0 1 0 4h-3.58c.1-.65.16-1.31.16-2s-.06-1.35-.16-2"/></svg>'
  
  const iconSettings = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>'
  
  const iconDocuments = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M20 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M4 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm2 5h2v2H6zm5 0a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2zm-3 4H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1m-2 3H6v2h2zm2 1a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1" clip-rule="evenodd"/></svg>'
  
  const iconPlus = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6z"/></svg>'

  const iconDoc = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>'
  const iconSheet = '<svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5zm2-12h3v3H7V7zm0 4h3v3H7v-3zm0 4h3v3H7v-3zm4-8h3v3h-3V7zm0 4h3v3h-3v-3zm0 4h3v3h-3v-3zm4-8h3v3h-3V7zm0 4h3v3h-3v-3zm0 4h3v3h-3v-3z"/></svg>'

  const iconDocColor = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="SVG2m3AVb6p" x1="4.494" x2="13.832" y1="-1712.086" y2="-1695.914" gradientTransform="translate(0 1720)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2368c4"/><stop offset=".5" stop-color="#1a5dbe"/><stop offset="1" stop-color="#1146ac"/></linearGradient></defs><path fill="#41a5ee" d="M28.806 3H9.705a1.19 1.19 0 0 0-1.193 1.191V9.5l11.069 3.25L30 9.5V4.191A1.19 1.19 0 0 0 28.806 3"/><path fill="#2b7cd3" d="M30 9.5H8.512V16l11.069 1.95L30 16Z"/><path fill="#185abd" d="M8.512 16v6.5l10.418 1.3L30 22.5V16Z"/><path fill="#103f91" d="M9.705 29h19.1A1.19 1.19 0 0 0 30 27.809V22.5H8.512v5.309A1.19 1.19 0 0 0 9.705 29"/><path d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2" opacity="0.1"/><path d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/><path d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/><path d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/><path fill="url(#SVG2m3AVb6p)" d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.19 1.19 0 0 1 2 21.959V10.041A1.19 1.19 0 0 1 3.194 8.85"/><path fill="#fff" d="M6.9 17.988q.035.276.046.481h.028q.015-.195.065-.47c.05-.275.062-.338.089-.465l1.255-5.407h1.624l1.3 5.326a8 8 0 0 1 .162 1h.022a8 8 0 0 1 .135-.975l1.039-5.358h1.477l-1.824 7.748h-1.727l-1.237-5.126q-.054-.222-.122-.578t-.084-.52h-.021q-.021.189-.084.561t-.1.552L7.78 19.871H6.024L4.19 12.127h1.5l1.131 5.418a5 5 0 0 1 .079.443"/></svg>'

  const iconSheetColor = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#20744a" fill-rule="evenodd" d="M28.781 4.405h-10.13V2.018L2 4.588v22.527l16.651 2.868v-3.538h10.13A1.16 1.16 0 0 0 30 25.349V5.5a1.16 1.16 0 0 0-1.219-1.095m.16 21.126H18.617l-.017-1.889h2.487v-2.2h-2.506l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2h10.411Z"/><path fill="#20744a" d="M22.487 7.439h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323z"/><path fill="#fff" fill-rule="evenodd" d="m6.347 10.673l2.146-.123l1.349 3.709l1.594-3.862l2.146-.123l-2.606 5.266l2.606 5.279l-2.269-.153l-1.532-4.024l-1.533 3.871l-2.085-.184l2.422-4.663z"/></svg>'

  const iconMindmapColor = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="mindmap-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#C084FC"/><stop offset="100%" stop-color="#9333EA"/></linearGradient></defs><rect width="32" height="32" rx="6" fill="url(#mindmap-grad)"/><rect x="6" y="13.5" width="8" height="5" rx="1.5" fill="#fff"/><rect x="20" y="9" width="6" height="4" rx="1" fill="#fff" opacity="0.9"/><rect x="20" y="19" width="6" height="4" rx="1" fill="#fff" opacity="0.9"/><path d="M14 16C17 16 17 11 20 11M14 16C17 16 17 21 20 21" stroke="#fff" stroke-width="1.5" fill="none"/></svg>'

  const iconSlideColor = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="slide-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FF6B6B"/><stop offset="100%" stop-color="#D63031"/></linearGradient></defs><rect width="32" height="32" rx="6" fill="url(#slide-grad)"/><rect x="7" y="8" width="18" height="12" rx="1" fill="#fff" opacity="0.9"/><rect x="9" y="10" width="6" height="2" rx="0.5" fill="url(#slide-grad)"/><rect x="9" y="13" width="14" height="1" rx="0.5" fill="url(#slide-grad)" opacity="0.6"/><rect x="9" y="15" width="14" height="1" rx="0.5" fill="url(#slide-grad)" opacity="0.6"/><circle cx="23" cy="24" r="2" fill="#fff"/><circle cx="16" cy="24" r="1.5" fill="#fff" opacity="0.7"/><circle cx="9" cy="24" r="1.5" fill="#fff" opacity="0.7"/></svg>'

  const iconAiSparkle = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" style="color: #8b5cf6;"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 2L19 5L22 6L19 7L18 10L17 7L14 6L17 5L18 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  return {
    iconUser,
    iconAIWand,
    iconHistory,
    iconMore,
    iconEye,
    iconShare,
    iconGlobe,
    iconSettings,
    iconDocuments,
    iconPlus,
    iconDoc,
    iconSheet,
    iconDocColor,
    iconSheetColor,
    iconMindmapColor,
    iconSlideColor,
    iconAiSparkle
  }
}
