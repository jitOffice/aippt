import { ref, computed } from 'vue'
import { Message } from '@arco-design/web-vue'

export interface Theme {
  name: string
  label: string
  category: 'light' | 'dark' | 'colorful'
  preview: string
  slideStyle: {
    background: string
    color: string
    fontFamily?: string
    border?: string
  }
}

export function useThemeManager() {
  const currentTheme = ref('default')
  const activeThemeCategory = ref<string>('all') // Changed to string to support more categories
  const previousThemeColor = ref<string | null>(null)

  const themes: Theme[] = [
    // Light Themes
    { 
      name: 'default', 
      label: 'Default', 
      category: 'light',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      slideStyle: { 
        background: 'white',
        color: '#1f2937',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      } 
    },
    { 
      name: 'piano', 
      label: 'Piano', 
      category: 'light',
      preview: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)', 
      slideStyle: { 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        color: '#0c4a6e',
        fontFamily: 'Georgia, serif'
      } 
    },
    { 
      name: 'wireframe', 
      label: 'Wireframe', 
      category: 'light',
      preview: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', 
      slideStyle: { 
        background: '#ffffff',
        color: '#111827',
        border: '2px solid #e5e7eb',
        fontFamily: '"Courier New", monospace'
      } 
    },
    { 
      name: 'seriph', 
      label: 'Seriph', 
      category: 'light',
      preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
      slideStyle: { 
        background: 'linear-gradient(135deg, #fff5f7 0%, #ffe0e8 100%)',
        color: '#881337',
        fontFamily: 'Georgia, "Times New Roman", serif'
      } 
    },
    
    // Dark Themes
    { 
      name: 'geist', 
      label: 'Geist', 
      category: 'dark',
      preview: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', 
      slideStyle: { 
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        color: '#e0e7ff',
        fontFamily: '"Inter", -apple-system, sans-serif'
      } 
    },
    { 
      name: 'aurum', 
      label: 'Aurum', 
      category: 'dark',
      preview: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', 
      slideStyle: { 
        background: '#1c1917',
        color: '#fbbf24',
        fontFamily: 'Georgia, serif'
      } 
    },
    { 
      name: 'chocolate', 
      label: 'Chocolate', 
      category: 'dark',
      preview: 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)', 
      slideStyle: { 
        background: 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)',
        color: '#fed7aa',
        fontFamily: 'Georgia, serif'
      } 
    },
    
    // Colorful Themes
    { 
      name: 'shibainu', 
      label: 'Shibainu', 
      category: 'colorful',
      preview: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
      slideStyle: { 
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        color: '#065f46',
        fontFamily: '"Comic Sans MS", cursive, sans-serif'
      } 
    },
    { 
      name: 'bricks', 
      label: 'Bricks', 
      category: 'colorful',
      preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
      slideStyle: { 
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        color: '#92400e',
        fontFamily: '"Arial Rounded MT Bold", sans-serif'
      } 
    },
    { 
      name: 'bee-happy', 
      label: 'Bee Happy', 
      category: 'colorful',
      preview: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
      slideStyle: { 
        background: '#fef3c7',
        color: '#78350f',
        fontFamily: '"Trebuchet MS", sans-serif'
      } 
    },
    { 
      name: 'atacama', 
      label: 'Atacama', 
      category: 'colorful',
      preview: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', 
      slideStyle: { 
        background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
        color: '#7c2d12',
        fontFamily: 'Georgia, serif'
      } 
    },
  ]

  const currentThemeStyle = computed(() => {
    const theme = themes.find(t => t.name === currentTheme.value)
    return theme ? theme.slideStyle : {}
  })

  const themesByCategory = computed(() => {
    return {
      all: themes, // All themes
      light: themes.filter(t => t.category === 'light'),
      dark: themes.filter(t => t.category === 'dark'),
      colorful: themes.filter(t => t.category === 'colorful'),
      business: themes.filter(t => t.category === 'light'), // Map to existing categories
      tech: themes.filter(t => t.category === 'dark'),
      education: themes.filter(t => t.category === 'colorful'),
      medical: themes.filter(t => t.category === 'light'),
      finance: themes.filter(t => t.category === 'dark'),
      marketing: themes.filter(t => t.category === 'colorful'),
      minimal: themes.filter(t => t.name === 'wireframe' || t.name === 'piano')
    }
  })

  const selectTheme = (themeName: string, visualSlideData?: any) => {
    currentTheme.value = themeName
    const theme = themes.find(t => t.name === themeName)
    if (theme) {
      Message.success(`Theme "${theme.label}" applied`)
    }
    
    // Update text colors in visual editor for ALL slides
    if (theme?.slideStyle?.color && visualSlideData) {
      const newColor = theme.slideStyle.color
      const oldColor = previousThemeColor.value
      
      // Iterate through all cached visual slide data
      Object.keys(visualSlideData.value || {}).forEach(slideKey => {
        const visualData = visualSlideData.value[slideKey]
        if (visualData && visualData.texts) {
          // Update all text colors to new theme color
          visualData.texts.forEach((text: any) => {
            // Check if text color should be updated:
            // 1. Default gray colors from markdown parsing
            // 2. Previous theme color (if exists)
            const isDefaultGray = text.fill && text.fill.startsWith('#') && 
              (text.fill === '#333' || text.fill === '#1f2937' || 
               text.fill === '#374151' || text.fill === '#4b5563' || 
               text.fill === '#6b7280')
            const isOldThemeColor = oldColor && text.fill === oldColor
            
            if (isDefaultGray || isOldThemeColor) {
              text.fill = newColor
            }
          })
        }
      })
      
      // Store current theme color for next update
      previousThemeColor.value = newColor
    }
  }

  return {
    themes,
    currentTheme,
    currentThemeStyle,
    themesByCategory,
    activeThemeCategory,
    previousThemeColor,
    selectTheme
  }
}
