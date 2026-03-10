/**
 * Coze Streaming API Client
 * SSE (Server-Sent Events) for real-time outline generation
 */

const COZE_PROXY_URL = '/api/coze'

/**
 * Generate outline with streaming
 * @param {Object} params - Generation parameters  
 * @param {Function} onMessage - Message callback (type, data) => void
 * @returns {Promise<void>}
 */
export async function generateOutlineStream(params, onMessage) {
  const {
    keyword,
    model = 'DeepSeek V3',
    pageCount = '15 - 20页',
    textAmount = '详细',
    language = '简体中文',
    style = '大众'
  } = params

  try {
    console.log('[Coze Stream] Starting outline generation:', params)

    // Build query parameters
    const queryParams = new URLSearchParams({
      keyword,
      model,
      pageCount,
      textAmount,
      language,
      style
    })

    // Create EventSource for SSE
    const url = `${COZE_PROXY_URL}/generate-outline-stream?${queryParams}`
    const eventSource = new EventSource(url)

    // Handle messages
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('[Coze Stream] Message:', data.type, data)
        
        if (onMessage) {
          onMessage(data.type, data)
        }

        // Close connection on complete or error
        if (data.type === 'complete' || data.type === 'error') {
          eventSource.close()
        }
      } catch (error) {
        console.error('[Coze Stream] Parse error:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('[Coze Stream] Connection error:', error)
      eventSource.close()
      if (onMessage) {
        onMessage('error', { message: '连接中断' })
      }
    }

  } catch (error) {
    console.error('[Coze Stream] Failed:', error)
    if (onMessage) {
      onMessage('error', { message: error.message })
    }
  }
}
