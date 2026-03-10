import { ref, computed } from 'vue'
import { Message } from '@arco-design/web-vue'

/**
 * Video Management Composable
 * Handles all video-related operations including:
 * - Video state management
 * - Drag and drop
 * - Resize functionality
 * - URL extraction and validation
 * - Local file upload
 */
export function useVideoManagement(props, { videos, saveToHistory, emitUpdate, t }) {
  // ========== Video State ==========
  // Dragging state
  const draggingVideoId = ref(null)
  const videoDragStart = ref({ x: 0, y: 0 })
  const videoInitialPos = ref({ x: 0, y: 0 })
  const isDragging = ref(false)

  // Resizing state
  const resizingVideoId = ref(null)
  const videoResizeHandle = ref(null)
  const videoResizeStart = ref({ x: 0, y: 0 })
  const videoInitialBounds = ref({ x: 0, y: 0, width: 0, height: 0 })
  const isResizingVideo = ref(false)

  // Video URL input dialog
  const showVideoUrlInput = ref(false)
  const videoUrl = ref('')

  // ========== Video URL Extraction ==========
  /**
   * Extract video ID and generate embed URL from various video platforms
   * Supports: Bilibili, Tencent Video, iQiyi, Youku, YouTube, Vimeo, Dailymotion, Loom
   */
  const extractVideoId = (url) => {
    // Bilibili
    const bilibiliRegex = /bilibili\.com\/video\/(BV[a-zA-Z0-9]+|av\d+)/
    const bilibiliMatch = url.match(bilibiliRegex)
    if (bilibiliMatch) {
      const videoId = bilibiliMatch[1]
      return {
        provider: 'bilibili',
        videoId: videoId,
        embedUrl: `https://player.bilibili.com/player.html?bvid=${videoId}&high_quality=1&danmaku=0`
      }
    }

    // Tencent Video
    const tencentRegex = /v\.qq\.com\/x\/(?:page|cover)\/[^\/]*\/([a-zA-Z0-9]+)/
    const tencentMatch = url.match(tencentRegex)
    if (tencentMatch) {
      const videoId = tencentMatch[1]
      return {
        provider: 'tencent',
        videoId: videoId,
        embedUrl: `https://v.qq.com/txp/iframe/player.html?vid=${videoId}&auto=0`
      }
    }

    // iQiyi
    const iqiyiRegex = /iqiyi\.com\/v_([a-zA-Z0-9_]+)\.html/
    const iqiyiMatch = url.match(iqiyiRegex)
    if (iqiyiMatch) {
      const videoId = iqiyiMatch[1]
      return {
        provider: 'iqiyi',
        videoId: videoId,
        embedUrl: `https://open.iqiyi.com/developer/player_js/coopPlayerIndex.html?vid=${videoId}&tvId=&accessToken=&appKey=&appId=`
      }
    }

    // Youku
    const youkuRegex = /youku\.com\/v_show\/id_([a-zA-Z0-9=]+)/
    const youkuMatch = url.match(youkuRegex)
    if (youkuMatch) {
      const videoId = youkuMatch[1]
      return {
        provider: 'youku',
        videoId: videoId,
        embedUrl: `https://player.youku.com/embed/${videoId}`
      }
    }

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch) {
      return {
        provider: 'youtube',
        videoId: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`
      }
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return {
        provider: 'vimeo',
        videoId: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
      }
    }

    // Dailymotion
    const dailymotionRegex = /dailymotion\.com\/video\/([a-zA-Z0-9]+)/
    const dailymotionMatch = url.match(dailymotionRegex)
    if (dailymotionMatch) {
      return {
        provider: 'dailymotion',
        videoId: dailymotionMatch[1],
        embedUrl: `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}`
      }
    }

    // Loom
    const loomRegex = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/
    const loomMatch = url.match(loomRegex)
    if (loomMatch) {
      return {
        provider: 'loom',
        videoId: loomMatch[1],
        embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`
      }
    }

    // Default to custom URL
    return {
      provider: 'custom',
      videoId: null,
      embedUrl: url
    }
  }

  // ========== Video CRUD Operations ==========
  /**
   * Add video from URL
   */
  const addVideoFromUrl = () => {
    if (!videoUrl.value.trim()) {
      Message.warning(t('slide.visual.messages.pleaseEnterVideoUrl') || 'Please enter a video URL')
      return
    }

    const videoInfo = extractVideoId(videoUrl.value)
    const videoId = `video-${Date.now()}`

    const newVideo = {
      id: videoId,
      x: 480 - 240, // Center horizontally
      y: 270 - 135, // Center vertically
      width: 480,
      height: 270,
      url: videoUrl.value,
      embedUrl: videoInfo.embedUrl,
      provider: videoInfo.provider,
      draggable: true,
      name: videoId,
      __zIndex: videos.value.length
    }

    videos.value.push(newVideo)
    saveToHistory()
    emitUpdate()

    showVideoUrlInput.value = false
    videoUrl.value = ''
    Message.success(t('slide.visual.messages.videoAdded') || 'Video added successfully')
  }

  /**
   * Handle local video/audio file upload
   */
  const handleVideoFileUpload = (file) => {
    if (!file) return

    const isVideo = file.type.startsWith('video/')
    const isAudio = file.type.startsWith('audio/')

    if (!isVideo && !isAudio) {
      Message.warning(t('slide.visual.messages.invalidVideoFile') || 'Please select a valid video or audio file')
      return
    }

    // Create a URL for the local file
    const fileUrl = URL.createObjectURL(file)
    const videoId = `video-${Date.now()}`

    const newVideo = {
      id: videoId,
      x: 480 - 240, // Center horizontally
      y: 270 - 135, // Center vertically
      width: 480,
      height: isAudio ? 60 : 270, // Audio players are smaller
      url: fileUrl,
      embedUrl: fileUrl,
      provider: 'local',
      isLocal: true,
      fileName: file.name,
      fileType: file.type,
      isAudio: isAudio,
      draggable: true,
      name: videoId,
      __zIndex: videos.value.length
    }

    videos.value.push(newVideo)
    saveToHistory()
    emitUpdate()

    Message.success(t('slide.visual.messages.videoAdded') || `${isAudio ? 'Audio' : 'Video'} added successfully`)
  }

  /**
   * Replace video URL or local file
   */
  const handleVideoReplaceUrl = (selectedId) => {
    if (!selectedId) return

    const video = videos.value.find(v => v.id === selectedId)
    if (!video) return

    if (video.isLocal) {
      // For local videos, trigger file picker
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'video/*,audio/*'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          const isVideo = file.type.startsWith('video/')
          const isAudio = file.type.startsWith('audio/')

          if (!isVideo && !isAudio) {
            Message.warning(t('slide.visual.messages.invalidVideoFile') || 'Please select a valid video or audio file')
            return
          }

          // Create new URL for the replacement file
          const fileUrl = URL.createObjectURL(file)

          // Update the existing video
          saveToHistory()
          video.url = fileUrl
          video.embedUrl = fileUrl
          video.fileName = file.name
          video.fileType = file.type
          video.isAudio = isAudio
          video.height = isAudio ? 60 : video.height

          emitUpdate()
          Message.success(t('slide.visual.messages.videoUpdated') || 'Video file replaced successfully')
        }
      }
      input.click()
    } else {
      // For online videos, show URL input dialog
      showVideoUrlInput.value = true
      videoUrl.value = video.url || ''

      // Store the video ID being edited
      const editingVideoId = video.id

      const updateVideoUrl = () => {
        if (!videoUrl.value.trim()) {
          Message.warning(t('slide.visual.messages.pleaseEnterVideoUrl') || 'Please enter a video URL')
          return
        }

        const videoInfo = extractVideoId(videoUrl.value)
        const videoToUpdate = videos.value.find(v => v.id === editingVideoId)

        if (videoToUpdate) {
          saveToHistory()
          videoToUpdate.url = videoUrl.value
          videoToUpdate.embedUrl = videoInfo.embedUrl
          videoToUpdate.provider = videoInfo.provider
          emitUpdate()

          showVideoUrlInput.value = false
          videoUrl.value = ''
          Message.success(t('slide.visual.messages.videoUpdated') || 'Video URL updated successfully')
        }
      }

      window._tempVideoUpdateHandler = updateVideoUrl
    }
  }

  // ========== Video Drag Handlers ==========
  const handleVideoClick = (videoId, handleShapeClick) => {
    console.log('[Video] Clicked:', videoId)
    if (props.readonly) return
    handleShapeClick(videoId)
  }

  const handleVideoMouseDown = (video, event) => {
    if (props.readonly) return

    draggingVideoId.value = video.id
    isDragging.value = false
    videoDragStart.value = { x: event.clientX, y: event.clientY }
    videoInitialPos.value = { x: video.x, y: video.y }

    document.addEventListener('mousemove', handleVideoMouseMove)
    document.addEventListener('mouseup', handleVideoMouseUp)
  }

  const handleVideoMouseMove = (event) => {
    if (!draggingVideoId.value) return

    const deltaX = event.clientX - videoDragStart.value.x
    const deltaY = event.clientY - videoDragStart.value.y

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (distance > 5) {
      isDragging.value = true
    }

    if (isDragging.value) {
      const videoIndex = videos.value.findIndex(v => v.id === draggingVideoId.value)
      if (videoIndex !== -1) {
        videos.value[videoIndex].x = videoInitialPos.value.x + deltaX
        videos.value[videoIndex].y = videoInitialPos.value.y + deltaY
      }
    }
  }

  const handleVideoMouseUp = () => {
    if (draggingVideoId.value) {
      if (isDragging.value) {
        saveToHistory()
        emitUpdate()
      }

      draggingVideoId.value = null
      isDragging.value = false

      document.removeEventListener('mousemove', handleVideoMouseMove)
      document.removeEventListener('mouseup', handleVideoMouseUp)
    }
  }

  // ========== Video Resize Handlers ==========
  const handleVideoResizeStart = (video, handle, event) => {
    if (props.readonly) return

    event.preventDefault()
    event.stopPropagation()

    console.log('[Video] Resize start:', { videoId: video.id, handle })

    resizingVideoId.value = video.id
    videoResizeHandle.value = handle
    isResizingVideo.value = false
    videoResizeStart.value = {
      x: event.clientX,
      y: event.clientY
    }
    videoInitialBounds.value = {
      x: video.x,
      y: video.y,
      width: video.width || 480,
      height: video.height || 270
    }

    document.addEventListener('mousemove', handleVideoResizeMove)
    document.addEventListener('mouseup', handleVideoResizeEnd)
  }

  const handleVideoResizeMove = (event) => {
    if (!resizingVideoId.value) return

    const deltaX = event.clientX - videoResizeStart.value.x
    const deltaY = event.clientY - videoResizeStart.value.y

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (distance > 3) {
      isResizingVideo.value = true
    }

    if (isResizingVideo.value) {
      const videoIndex = videos.value.findIndex(v => v.id === resizingVideoId.value)
      if (videoIndex !== -1) {
        const video = videos.value[videoIndex]
        const bounds = videoInitialBounds.value

        let newWidth = bounds.width
        let newHeight = bounds.height
        let newX = bounds.x
        let newY = bounds.y

        // Handle different resize handles
        switch (videoResizeHandle.value) {
          case 'top-left':
            newWidth = Math.max(100, bounds.width - deltaX)
            newHeight = Math.max(60, bounds.height - deltaY)
            newX = bounds.x + (bounds.width - newWidth)
            newY = bounds.y + (bounds.height - newHeight)
            break
          case 'top-right':
            newWidth = Math.max(100, bounds.width + deltaX)
            newHeight = Math.max(60, bounds.height - deltaY)
            newY = bounds.y + (bounds.height - newHeight)
            break
          case 'bottom-left':
            newWidth = Math.max(100, bounds.width - deltaX)
            newHeight = Math.max(60, bounds.height + deltaY)
            newX = bounds.x + (bounds.width - newWidth)
            break
          case 'bottom-right':
            newWidth = Math.max(100, bounds.width + deltaX)
            newHeight = Math.max(60, bounds.height + deltaY)
            break
          case 'top-center':
            newHeight = Math.max(60, bounds.height - deltaY)
            newY = bounds.y + (bounds.height - newHeight)
            break
          case 'bottom-center':
            newHeight = Math.max(60, bounds.height + deltaY)
            break
          case 'middle-left':
            newWidth = Math.max(100, bounds.width - deltaX)
            newX = bounds.x + (bounds.width - newWidth)
            break
          case 'middle-right':
            newWidth = Math.max(100, bounds.width + deltaX)
            break
        }

        video.x = newX
        video.y = newY
        video.width = newWidth
        video.height = newHeight
      }
    }
  }

  const handleVideoResizeEnd = () => {
    if (resizingVideoId.value) {
      console.log('[Video] Resize end, was resizing:', isResizingVideo.value)

      if (isResizingVideo.value) {
        saveToHistory()
        emitUpdate()
      }

      resizingVideoId.value = null
      videoResizeHandle.value = null
      isResizingVideo.value = false

      document.removeEventListener('mousemove', handleVideoResizeMove)
      document.removeEventListener('mouseup', handleVideoResizeEnd)
    }
  }

  // ========== Cleanup ==========
  const cleanupVideoListeners = () => {
    document.removeEventListener('mousemove', handleVideoMouseMove)
    document.removeEventListener('mouseup', handleVideoMouseUp)
    document.removeEventListener('mousemove', handleVideoResizeMove)
    document.removeEventListener('mouseup', handleVideoResizeEnd)
  }

  // ========== Computed ==========
  const selectedVideoData = computed(() => {
    return (selectedId) => {
      if (!selectedId) return null
      return videos.value.find(v => v.id === selectedId) || null
    }
  })

  return {
    // State
    draggingVideoId,
    isDragging,
    isResizingVideo,
    showVideoUrlInput,
    videoUrl,

    // Computed
    selectedVideoData,

    // Methods - Video CRUD
    addVideoFromUrl,
    handleVideoFileUpload,
    handleVideoReplaceUrl,
    extractVideoId,

    // Methods - Drag & Drop
    handleVideoClick,
    handleVideoMouseDown,

    // Methods - Resize
    handleVideoResizeStart,

    // Methods - Cleanup
    cleanupVideoListeners
  }
}
