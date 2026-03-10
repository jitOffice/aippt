import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { imageSearch } from '../utils/slide/imageApiServices'

/**
 * Composable for managing image search functionality
 * @param {Object} options - Configuration options
 * @returns {Object} Image search methods and state
 */
export function useImageSearch(options = {}) {
  const { t } = useI18n()
  
  // State
  const searchResults = ref([])
  const isLoading = ref(false)
  const hasError = ref(false)
  const errorMessage = ref('')
  const currentPage = ref(1)
  const hasMore = ref(true)
  const searchQuery = ref('')
  const activeSource = ref(null)
  
  let debounceTimer = null
  
  // Search methods
  const searchImages = async (source, query = '', append = false) => {
    if (isLoading.value || (!append && currentPage.value > 1)) return
    
    if (!source) return
    
    try {
      isLoading.value = true
      hasError.value = false
      
      let results = []
      
      if (!query.trim()) {
        // Get trending images
        results = await imageSearch.getTrending(source, {
          limit: 20,
          perPage: 20,
          count: 20,
          page: currentPage.value
        })
      } else {
        // Search with query
        results = await imageSearch.search(source, query, {
          limit: 20,
          perPage: 20,
          page: currentPage.value,
          offset: (currentPage.value - 1) * 20
        })
      }
      
      if (append) {
        searchResults.value = [...searchResults.value, ...results]
      } else {
        searchResults.value = results
      }
      
      hasMore.value = results.length === 20
      
    } catch (error) {
      console.error('Image search error:', error)
      hasError.value = true
      errorMessage.value = error.message || t('slide.visual.images.searchError')
      Message.error(errorMessage.value)
    } finally {
      isLoading.value = false
    }
  }
  
  const loadMoreResults = async () => {
    if (!hasMore.value || isLoading.value) return
    currentPage.value++
    await searchImages(activeSource.value, searchQuery.value, true)
  }
  
  const resetSearch = () => {
    searchResults.value = []
    currentPage.value = 1
    hasMore.value = true
    hasError.value = false
    errorMessage.value = ''
  }
  
  const setActiveSource = (source) => {
    if (activeSource.value !== source) {
      activeSource.value = source
      resetSearch()
      searchQuery.value = ''
    }
  }
  
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }
  
  // Debounced search
  const debouncedSearch = (delay = 500) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(() => {
      resetSearch()
      searchImages(activeSource.value, searchQuery.value)
    }, delay)
  }
  
  // Watch for search query changes
  watch(searchQuery, () => {
    if (!activeSource.value) return
    debouncedSearch()
  })
  
  // Watch for source changes
  watch(activeSource, (newSource) => {
    if (newSource) {
      resetSearch()
      searchImages(newSource, searchQuery.value)
    }
  })
  
  // Cleanup
  const cleanup = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  }
  
  return {
    // State
    searchResults,
    isLoading,
    hasError,
    errorMessage,
    currentPage,
    hasMore,
    searchQuery,
    activeSource,
    
    // Methods
    searchImages,
    loadMoreResults,
    resetSearch,
    setActiveSource,
    setSearchQuery,
    debouncedSearch,
    cleanup
  }
}