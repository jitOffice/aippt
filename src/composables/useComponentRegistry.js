import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  textComponents, 
  shapeComponents, 
  chartComponents,
  searchableSubPanels
} from '../views/slide-page/config/component-definitions.js'
import { getCustomIcon, isCustomIcon } from '../views/slide-page/config/icon-mapping.js'

/**
 * Composable for managing component definitions and registry
 * @returns {Object} Component registry methods and data
 */
export function useComponentRegistry() {
  const { t, locale } = useI18n()
  
  // Process components with internationalization
  const processedTextComponents = computed(() => 
    textComponents.map(comp => ({
      ...comp,
      name: t(comp.name),
      sublabel: comp.sublabel
    }))
  )
  
  const processedShapeComponents = computed(() => 
    shapeComponents.map(comp => ({
      ...comp,
      name: t(comp.name)
    }))
  )
  
  const processedChartComponents = computed(() => 
    chartComponents.map(comp => ({
      ...comp,
      name: t(comp.name),
      sublabel: t(comp.sublabel)
    }))
  )
  
  // Media components with dynamic localization
  const getMediaComponents = () => {
    // Detect if user is in China based on i18n locale (more reliable than navigator.language)
    const currentLocale = locale.value
    const browserLang = navigator.language.toLowerCase()
    
    // Check both i18n locale and browser language
    const isChineseUser = currentLocale.startsWith('zh') || 
                         browserLang.startsWith('zh') || 
                         browserLang.includes('cn')
    
    // Debug: Log detection result
    console.log('[MediaComponents] Current locale:', currentLocale)
    console.log('[MediaComponents] Browser language:', browserLang)
    console.log('[MediaComponents] Is Chinese user:', isChineseUser)
    
    // Common video embed component (always shown)
    const commonComponents = [
      { 
        id: 'videoEmbed', 
        name: t('slide.visual.media.videoEmbed'), 
        sublabel: t('slide.visual.media.videoEmbedSublabel'), 
        icon: 'videoEmbed', 
        type: 'video'
      }
    ]
    
    // Chinese video platforms (for Chinese users)
    const chineseComponents = [
      { 
        id: 'bilibili', 
        name: t('slide.visual.media.bilibili'), 
        sublabel: t('slide.visual.media.bilibiliSublabel'), 
        icon: 'bilibili', 
        type: 'video', 
        color: '#00A1D6'
      },
      { 
        id: 'tencent', 
        name: t('slide.visual.media.tencent'), 
        sublabel: t('slide.visual.media.tencentSublabel'), 
        icon: 'tencent', 
        type: 'video', 
        color: '#FF6C00'
      },
      { 
        id: 'iqiyi', 
        name: t('slide.visual.media.iqiyi'), 
        sublabel: t('slide.visual.media.iqiyiSublabel'), 
        icon: 'iqiyi', 
        type: 'video', 
        color: '#00BE06'
      },
      { 
        id: 'youku', 
        name: t('slide.visual.media.youku'), 
        sublabel: t('slide.visual.media.youkuSublabel'), 
        icon: 'youku', 
        type: 'video', 
        color: '#00A0E9'
      }
    ]
    
    // International video platforms (for non-Chinese users)
    const internationalComponents = [
      { 
        id: 'youtube', 
        name: t('slide.visual.media.youtube'), 
        sublabel: t('slide.visual.media.youtubeSublabel'), 
        icon: 'youtube', 
        type: 'video', 
        color: '#FF0000'
      },
      { 
        id: 'vimeo', 
        name: t('slide.visual.media.vimeo'), 
        sublabel: t('slide.visual.media.vimeoSublabel'), 
        icon: 'vimeo', 
        type: 'video', 
        color: '#1AB7EA'
      },
      { 
        id: 'dailymotion', 
        name: t('slide.visual.media.dailymotion'), 
        sublabel: t('slide.visual.media.dailymotionSublabel'), 
        icon: 'dailymotion', 
        type: 'video', 
        color: '#0066DC'
      }
    ]
    
    // Return appropriate components based on user location
    const videoComponents = isChineseUser 
      ? [...commonComponents, ...chineseComponents]
      : [...commonComponents, ...internationalComponents]
    
    return [
      ...videoComponents,
      { 
        id: 'loom', 
        name: t('slide.visual.media.loom'), 
        sublabel: t('slide.visual.media.loomSublabel'), 
        icon: 'loom', 
        type: 'video', 
        color: '#625DF5'
      },
      { 
        id: 'spotify', 
        name: t('slide.visual.media.spotify'), 
        sublabel: '', 
        icon: 'spotify', 
        type: 'audio', 
        color: '#1db954', 
        comingSoon: true 
      }
    ]
  }
  
  // Images components with dynamic localization
  const getImagesComponents = () => [
    { 
      id: 'imageUpload', 
      name: t('slide.visual.images.imageUpload'), 
      sublabel: '', 
      icon: 'IconImage', 
      type: 'image' 
    },
    { 
      id: 'webSearch', 
      name: t('slide.visual.images.webSearch'), 
      sublabel: '', 
      icon: 'search', 
      type: 'image',
      comingSoon: true 
    },
    { 
      id: 'aiImages', 
      name: t('slide.visual.images.aiImages'), 
      sublabel: '', 
      icon: 'star', 
      type: 'image', 
      color: '#fbbf24', 
      comingSoon: true 
    },
    { 
      id: 'pexels', 
      name: t('slide.visual.images.pexels'), 
      sublabel: '', 
      icon: 'pexels', 
      type: 'image', 
      color: '#05A081', 
      comingSoon: true 
    },
    { 
      id: 'giphy', 
      name: t('slide.visual.images.giphy'), 
      sublabel: '', 
      icon: 'giphy', 
      type: 'image', 
      color: '#00ff99'
    },
    { 
      id: 'pictographic', 
      name: t('slide.visual.images.pictographic'), 
      sublabel: '', 
      icon: 'pictographic', 
      type: 'image', 
      color: '#6366f1',
      comingSoon: true
    },
    { 
      id: 'iconsClassic', 
      name: t('slide.visual.images.iconsClassic'), 
      sublabel: '', 
      icon: 'iconClassic', 
      type: 'image', 
      color: '#3b82f6',
      comingSoon: true 
    },
    { 
      id: 'iconsModern', 
      name: t('slide.visual.images.iconsModern'), 
      sublabel: '', 
      icon: 'iconModern', 
      type: 'image', 
      color: '#8b5cf6',
      comingSoon: true 
    },
    { 
      id: 'qrcode', 
      name: t('slide.visual.images.qrcode'), 
      sublabel: '', 
      icon: 'qrcode', 
      type: 'image', 
      color: '#1f2937', 
      comingSoon: true 
    },
    { 
      id: 'accentImages', 
      name: t('slide.visual.images.accentImages'), 
      sublabel: '', 
      icon: 'accentImage', 
      type: 'image', 
      color: '#6366f1', 
      comingSoon: true 
    },
    { 
      id: 'galleryImages', 
      name: t('slide.visual.images.gallery'), 
      sublabel: '/gallery', 
      icon: 'gallery', 
      type: 'image', 
      color: '#6366f1',
      comingSoon: true 
    }
  ]
  
  // Component lookup methods
  const getComponentById = (id) => {
    const allComponents = [
      ...processedTextComponents.value,
      ...processedShapeComponents.value,
      ...processedChartComponents.value,
      ...getMediaComponents(),
      ...getImagesComponents()
    ]
    return allComponents.find(comp => comp.id === id) || null
  }
  
  const getComponentsByType = (type) => {
    const allComponents = [
      ...processedTextComponents.value,
      ...processedShapeComponents.value,
      ...processedChartComponents.value,
      ...getMediaComponents(),
      ...getImagesComponents()
    ]
    return allComponents.filter(comp => comp.type === type)
  }
  
  // Utility methods
  const isSearchableComponent = (componentId) => {
    return searchableSubPanels.includes(componentId)
  }
  
  const isComingSoon = (component) => {
    return component?.comingSoon === true
  }
  
  const getComponentIcon = (component) => {
    if (isCustomIcon(component.icon)) {
      return getCustomIcon(component.icon)
    }
    return component.icon
  }
  
  return {
    // Processed component lists
    textComponents: processedTextComponents,
    shapeComponents: processedShapeComponents,
    chartComponents: processedChartComponents,
    getMediaComponents,
    getImagesComponents,
    
    // Lookup methods
    getComponentById,
    getComponentsByType,
    
    // Utility methods
    isSearchableComponent,
    isComingSoon,
    getComponentIcon
  }
}