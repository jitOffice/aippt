// Custom SVG icon definitions for components that don't have Arco Design equivalents

export const customIcons = {
  // Rectangle icon
  rectangle: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="4" y="7" width="16" height="10" rx="1" />
    </svg>
  `,
  
  // Square icon
  square: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  `,
  
  // Triangle icon
  triangle: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4 L20 20 L4 20 Z" />
    </svg>
  `,
  
  // Search icon
  search: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  `,
  
  // Star (AI) icon
  star: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/>
    </svg>
  `,
  
  // Pexels logo
  pexels: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21A1.5 1.5 0 0124 1.5v21a1.5 1.5 0 01-1.5 1.5h-21A1.5 1.5 0 010 22.5v-21A1.5 1.5 0 011.5 0zM6 4.5v15h4.5v-6h3c3.3 0 6-2.7 6-6S16.8 1.5 13.5 1.5H6v3zm4.5 3h3c1.65 0 3 1.35 3 3s-1.35 3-3 3h-3v-6z"/>
    </svg>
  `,
  
  // GIPHY logo
  giphy: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M8 8h8v3h-3v5H8z"/>
    </svg>
  `,
  
  // Pictographic icon
  pictographic: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 3H3v18h18V3zM8 17c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm8-6h4m-4 4h4"/>
    </svg>
  `,
  
  // Icon Classic
  iconClassic: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
    </svg>
  `,
  
  // Icon Modern
  iconModern: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" opacity="0.7"/>
      <circle cx="18" cy="6" r="3"/>
    </svg>
  `,
  
  // QR Code icon
  qrcode: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <rect x="16" y="16" width="2" height="2"/>
      <rect x="19" y="16" width="2" height="2"/>
      <rect x="16" y="19" width="2" height="2"/>
      <rect x="14" y="14" width="2" height="2"/>
    </svg>
  `,
  
  // Accent Image icon
  accentImage: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 11a2 2 0 100-4 2 2 0 000 4zM21 15l-5-5L5 21"/>
    </svg>
  `,
  
  // Gallery icon
  gallery: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1" opacity="0.6" />
      <rect x="13" y="3" width="7" height="7" rx="1" opacity="0.8" />
      <rect x="3" y="13" width="7" height="7" rx="1" opacity="0.8" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  `,
  
  // YouTube icon
  youtube: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  `,
  
  // Vimeo icon
  vimeo: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
    </svg>
  `,
  
  // Loom icon
  loom: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
      <path d="M12 2v4m0 12v4M2 12h4m12 0h4" stroke="currentColor" stroke-width="2" opacity="0.5"/>
    </svg>
  `,
  
  // Wistia icon
  wistia: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 18l-8-4V8.5l8 4v7.5z" opacity="0.8"/>
      <path d="M12 12l8-4v7.5l-8 4V12z"/>
    </svg>
  `,
  
  // TikTok icon
  tiktok: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/>
    </svg>
  `,
  
  // Spotify icon
  spotify: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  `,
  
  // Bilibili icon (哔哩哔哩)
  bilibili: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z"/>
    </svg>
  `,
  
  // Tencent Video icon (腾讯视频)
  tencent: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-4.5h4l-2-5z"/>
      <circle cx="12" cy="8" r="1.5"/>
      <path d="M16.5 12l-1.5 3h-2l1.5-3z" opacity="0.7"/>
      <path d="M7.5 12l1.5 3h2l-1.5-3z" opacity="0.7"/>
    </svg>
  `,
  
  // iQiyi icon (爱奇艺)
  iqiyi: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5z"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 7v2m0 6v2M7 12h2m6 0h2" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
    </svg>
  `,
  
  // Youku icon (优酷)
  youku: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M10 8v8l6-4z"/>
    </svg>
  `,
  
  // Dailymotion icon
  dailymotion: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M9 8l6 4-6 4V8z"/>
    </svg>
  `,
  
  // Video Embed icon (generic video/audio embed)
  videoEmbed: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M9 8l6 4-6 4V8z"/>
      <circle cx="6" cy="18" r="1" opacity="0.6"/>
      <circle cx="9" cy="18" r="1" opacity="0.6"/>
      <circle cx="12" cy="18" r="1" opacity="0.6"/>
    </svg>
  `,
  
  // Bar Chart icon
  barChart: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <rect x="4" y="14" width="3" height="6" fill="currentColor" rx="1" />
      <rect x="10" y="8" width="3" height="12" fill="currentColor" rx="1" />
      <rect x="16" y="11" width="3" height="9" fill="currentColor" rx="1" />
    </svg>
  `,
  
  // Line Chart icon
  lineChart: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <polyline points="4,18 8,12 12,14 16,8 20,10" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" />
      <circle cx="8" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
      <circle cx="20" cy="10" r="1.5" fill="currentColor" />
    </svg>
  `,
  
  // Pie Chart icon
  pieChart: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="8" fill="none" />
      <path d="M12 12 L12 4 A8 8 0 0 1 18.3 7.5 Z" fill="currentColor" opacity="0.6" />
      <path d="M12 12 L18.3 7.5 A8 8 0 0 1 19.9 13 Z" fill="currentColor" opacity="0.3" />
    </svg>
  `,
  
  // Area Chart icon
  areaChart: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M4 18 L8 12 L12 14 L16 8 L20 10 L20 20 L4 20 Z" fill="currentColor" opacity="0.3" />
      <polyline points="4,18 8,12 12,14 16,8 20,10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>
  `,
  
  // Scatter Chart icon
  scatterChart: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="6" cy="16" r="1.8" />
      <circle cx="9" cy="11" r="1.8" />
      <circle cx="12" cy="14" r="1.8" />
      <circle cx="15" cy="9" r="1.8" />
      <circle cx="18" cy="12" r="1.8" />
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="14" cy="7" r="1.5" />
      <circle cx="17" cy="15" r="1.5" />
    </svg>
  `,
  
  // Radar Chart icon
  radarChart: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon points="12,4 19,8 19,16 12,20 5,16 5,8" fill="none" />
      <polygon points="12,7 16,9 16,15 12,17 8,15 8,9" fill="currentColor" opacity="0.2" />
      <line x1="12" y1="4" x2="12" y2="12" />
      <line x1="19" y1="8" x2="12" y2="12" />
      <line x1="19" y1="16" x2="12" y2="12" />
      <line x1="12" y1="20" x2="12" y2="12" />
      <line x1="5" y1="16" x2="12" y2="12" />
      <line x1="5" y1="8" x2="12" y2="12" />
    </svg>
  `,
  
  // Funnel Chart icon
  funnelChart: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5 L18 5 L16 9 L8 9 Z" opacity="0.8" />
      <path d="M8 9 L16 9 L14.5 13 L9.5 13 Z" opacity="0.6" />
      <path d="M9.5 13 L14.5 13 L13 17 L11 17 Z" opacity="0.4" />
      <path d="M11 17 L13 17 L12.5 20 L11.5 20 Z" opacity="0.2" />
    </svg>
  `,
  
  // Gauge Chart icon
  gaugeChart: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 16 A8 8 0 0 1 20 16" fill="none" stroke-linecap="round" />
      <path d="M6 15 A6 6 0 0 1 18 15" fill="none" stroke="currentColor" opacity="0.3" stroke-width="3" />
      <line x1="12" y1="16" x2="16" y2="10" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  `,
  
  // Line icons for decorative lines
  'line-simple': `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  
  'line-thick': `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    </svg>
  `,
  
  'line-gradient': `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <!-- Use multiple segments with different colors to simulate gradient -->
      <line x1="4" y1="16" x2="12" y2="16" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
      <line x1="12" y1="16" x2="20" y2="16" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/>
      <line x1="20" y1="16" x2="28" y2="16" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  
  'line-dotted': `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="1,4"/>
    </svg>
  `,
  
  'line-dashed': `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="6,3"/>
    </svg>
  `
}

// Function to get SVG icon by name
export function getCustomIcon(name) {
  return customIcons[name] || null
}

// Check if an icon is a custom SVG
export function isCustomIcon(name) {
  return name in customIcons
}