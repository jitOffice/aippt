import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'

/**
 * Composable for handling component action logic
 * @param {Function} emit - Vue emit function
 * @returns {Object} Component action methods
 */
export function useComponentActions(emit) {
  const { t } = useI18n()
  
  /**
   * Handle adding a component
   * @param {Object} component - Component definition
   * @param {Object} options - Additional options
   */
  const addComponent = (component, options = {}) => {
    try {
      emit('add-component', {
        ...component,
        ...options
      })
      
      // Show success message for certain actions
      if (component.type === 'image' && component.props?.src) {
        Message.success(t('slide.visual.images.added'))
      }
      
      return true
    } catch (error) {
      console.error('Error adding component:', error)
      Message.error(t('slide.visual.errors.addComponent'))
      return false
    }
  }
  
  /**
   * Handle image selection from search results
   * @param {Object} image - Selected image data
   */
  const handleImageSelect = (image) => {
    const imageComponent = {
      id: 'image',
      type: 'image',
      props: {
        src: image.original,
        preview: image.preview,
        width: image.width,
        height: image.height,
        title: image.title,
        photographer: image.photographer,
        photographerUrl: image.photographerUrl,
        source: image.source
      }
    }
    
    return addComponent(imageComponent)
  }
  
  /**
   * Handle coming soon features
   * @param {Object} component - Component that's not yet implemented
   */
  const handleComingSoon = (component) => {
    Message.info(`${component.name} ${t('slide.visual.messages.comingSoon').toLowerCase()}`)
  }
  
  /**
   * Validate component before adding
   * @param {Object} component - Component to validate
   * @returns {boolean} Whether component is valid
   */
  const validateComponent = (component) => {
    if (!component || !component.id) {
      console.warn('Invalid component: missing id')
      return false
    }
    
    if (!component.type) {
      console.warn(`Component ${component.id} missing type`)
      return false
    }
    
    return true
  }
  
  /**
   * Prepare component for addition with default props
   * @param {Object} component - Base component
   * @param {Object} defaultProps - Default properties to merge
   * @returns {Object} Prepared component
   */
  const prepareComponent = (component, defaultProps = {}) => {
    return {
      ...component,
      props: {
        ...defaultProps,
        ...(component.props || {})
      }
    }
  }
  
  return {
    addComponent,
    handleImageSelect,
    handleComingSoon,
    validateComponent,
    prepareComponent
  }
}