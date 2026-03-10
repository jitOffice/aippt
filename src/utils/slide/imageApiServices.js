/**
 * Image API Services
 * Unified interface for different image search APIs
 */

// ===== GIPHY API =====
export class GiphyService {
  constructor(apiKey = import.meta.env.VITE_GIPHY_API_KEY || 'YOUR_GIPHY_KEY') {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.giphy.com/v1/gifs'
  }

  async search(query, limit = 20, offset = 0) {
    const url = `${this.baseUrl}/search?api_key=${this.apiKey}&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&rating=g&lang=en`
    
    try {
      const response = await fetch(url)
      const data = await response.json()
      
      return data.data.map(gif => ({
        id: gif.id,
        title: gif.title,
        preview: gif.images.fixed_height_small.url,
        original: gif.images.original.url,
        thumbnail: gif.images.fixed_height_small_still.url,
        width: gif.images.original.width,
        height: gif.images.original.height,
        source: 'giphy'
      }))
    } catch (error) {
      console.error('GIPHY API Error:', error)
      throw error
    }
  }

  async trending(limit = 20) {
    const url = `${this.baseUrl}/trending?api_key=${this.apiKey}&limit=${limit}&rating=g`
    
    try {
      const response = await fetch(url)
      const data = await response.json()
      
      return data.data.map(gif => ({
        id: gif.id,
        title: gif.title,
        preview: gif.images.fixed_height_small.url,
        original: gif.images.original.url,
        thumbnail: gif.images.fixed_height_small_still.url,
        source: 'giphy'
      }))
    } catch (error) {
      console.error('GIPHY Trending Error:', error)
      throw error
    }
  }
}

// ===== PEXELS API =====
export class PexelsService {
  constructor(apiKey = import.meta.env.VITE_PEXELS_API_KEY || 'YOUR_PEXELS_KEY') {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.pexels.com/v1'
  }

  async search(query, perPage = 20, page = 1) {
    const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': this.apiKey
        }
      })
      const data = await response.json()
      
      return data.photos.map(photo => ({
        id: photo.id,
        title: photo.alt || 'Pexels Photo',
        preview: photo.src.medium,
        original: photo.src.original,
        thumbnail: photo.src.small,
        width: photo.width,
        height: photo.height,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        source: 'pexels'
      }))
    } catch (error) {
      console.error('Pexels API Error:', error)
      throw error
    }
  }

  async curated(perPage = 20, page = 1) {
    const url = `${this.baseUrl}/curated?per_page=${perPage}&page=${page}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': this.apiKey
        }
      })
      const data = await response.json()
      
      return data.photos.map(photo => ({
        id: photo.id,
        title: photo.alt || 'Pexels Photo',
        preview: photo.src.medium,
        original: photo.src.original,
        thumbnail: photo.src.small,
        photographer: photo.photographer,
        source: 'pexels'
      }))
    } catch (error) {
      console.error('Pexels Curated Error:', error)
      throw error
    }
  }
}

// ===== UNSPLASH API =====
export class UnsplashService {
  constructor(accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_KEY') {
    this.accessKey = accessKey
    this.baseUrl = 'https://api.unsplash.com'
  }

  async search(query, perPage = 20, page = 1) {
    const url = `${this.baseUrl}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`
        }
      })
      const data = await response.json()
      
      return data.results.map(photo => ({
        id: photo.id,
        title: photo.description || photo.alt_description || 'Unsplash Photo',
        preview: photo.urls.regular,
        original: photo.urls.full,
        thumbnail: photo.urls.thumb,
        width: photo.width,
        height: photo.height,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        source: 'unsplash'
      }))
    } catch (error) {
      console.error('Unsplash API Error:', error)
      throw error
    }
  }

  async random(count = 20, query = null) {
    let url = `${this.baseUrl}/photos/random?count=${count}`
    if (query) {
      url += `&query=${encodeURIComponent(query)}`
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`
        }
      })
      const data = await response.json()
      
      const photos = Array.isArray(data) ? data : [data]
      return photos.map(photo => ({
        id: photo.id,
        title: photo.description || photo.alt_description || 'Unsplash Photo',
        preview: photo.urls.regular,
        original: photo.urls.full,
        thumbnail: photo.urls.thumb,
        photographer: photo.user.name,
        source: 'unsplash'
      }))
    } catch (error) {
      console.error('Unsplash Random Error:', error)
      throw error
    }
  }
}

// ===== PIXABAY API (Alternative Free Service) =====
export class PixabayService {
  constructor(apiKey = import.meta.env.VITE_PIXABAY_API_KEY || 'YOUR_PIXABAY_KEY') {
    this.apiKey = apiKey
    this.baseUrl = 'https://pixabay.com/api'
  }

  async search(query, perPage = 20, page = 1, imageType = 'all') {
    const url = `${this.baseUrl}/?key=${this.apiKey}&q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&image_type=${imageType}&safesearch=true`
    
    try {
      const response = await fetch(url)
      const data = await response.json()
      
      return data.hits.map(image => ({
        id: image.id,
        title: image.tags,
        preview: image.webformatURL,
        original: image.largeImageURL,
        thumbnail: image.previewURL,
        width: image.imageWidth,
        height: image.imageHeight,
        photographer: image.user,
        source: 'pixabay'
      }))
    } catch (error) {
      console.error('Pixabay API Error:', error)
      throw error
    }
  }
}

// ===== Unified Image Search Service =====
export class ImageSearchService {
  constructor() {
    this.giphy = new GiphyService()
    this.pexels = new PexelsService()
    this.unsplash = new UnsplashService()
    this.pixabay = new PixabayService()
  }

  async search(source, query, options = {}) {
    switch (source) {
      case 'giphy':
        return await this.giphy.search(query, options.limit || 20, options.offset || 0)
      case 'pexels':
        return await this.pexels.search(query, options.perPage || 20, options.page || 1)
      case 'webSearch':
      case 'unsplash':
        return await this.unsplash.search(query, options.perPage || 20, options.page || 1)
      case 'pixabay':
        return await this.pixabay.search(query, options.perPage || 20, options.page || 1)
      default:
        throw new Error(`Unknown image source: ${source}`)
    }
  }

  async getTrending(source, options = {}) {
    switch (source) {
      case 'giphy':
        return await this.giphy.trending(options.limit || 20)
      case 'pexels':
        return await this.pexels.curated(options.perPage || 20, options.page || 1)
      case 'unsplash':
        return await this.unsplash.random(options.count || 20)
      default:
        return []
    }
  }
}

// Export singleton instance
export const imageSearch = new ImageSearchService()
