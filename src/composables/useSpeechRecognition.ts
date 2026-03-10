/**
 * Speech Recognition Composable
 * 
 * 语音识别功能，支持：
 * 1. 优先使用浏览器原生 Web Speech API
 * 2. 降级到科大讯飞 WebSocket API
 */

import { ref, onUnmounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { XunfeiSpeechService } from '@/services/xunfei-speech.service'

interface SpeechRecognitionOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  forceXunfei?: boolean // 强制使用科大讯飞
  onResult?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onEnd?: () => void
}

// 扩展 Window 接口以支持 TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  const isRecording = ref(false)
  const isSupported = ref(false)
  const transcript = ref('')
  const interimTranscript = ref('')
  
  let recognition: any = null
  let recognitionType: 'native' | 'xunfei' | null = null
  let xunfeiService: XunfeiSpeechService | null = null
  let currentOptions = options // 保存当前配置

  // 检测浏览器支持
  const checkSupport = () => {
    if (typeof window !== 'undefined') {
      const hasNativeSupport = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
      isSupported.value = hasNativeSupport
      recognitionType = hasNativeSupport ? 'native' : null
      
      // 调试信息
      console.log('[Speech Recognition] Browser support check:', {
        hasNativeSupport,
        SpeechRecognition: !!window.SpeechRecognition,
        webkitSpeechRecognition: !!window.webkitSpeechRecognition,
        isHTTPS: window.location.protocol === 'https:',
        isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      })
    }
    return isSupported.value
  }

  // 初始化原生 Web Speech API
  const initNativeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()
    
    // 配置
    recognition.lang = options.lang || 'zh-CN'
    recognition.continuous = options.continuous ?? true
    recognition.interimResults = options.interimResults ?? true
    recognition.maxAlternatives = 1

    // 结果处理
    recognition.onresult = (event: any) => {
      let interimText = ''
      let finalText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript

        if (result.isFinal) {
          finalText += text
        } else {
          interimText += text
        }
      }

      // 更新临时结果
      if (interimText) {
        interimTranscript.value = interimText
      }

      // 更新最终结果
      if (finalText) {
        transcript.value += finalText
        interimTranscript.value = ''
        
        // 回调
        if (options.onResult) {
          options.onResult(finalText, true)
        }
      } else if (interimText && options.onResult) {
        options.onResult(interimText, false)
      }
    }

    // 错误处理
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      
      let errorMessage = '语音识别出错'
      switch (event.error) {
        case 'no-speech':
          errorMessage = '未检测到语音输入'
          break
        case 'audio-capture':
          errorMessage = '无法访问麦克风'
          break
        case 'not-allowed':
          errorMessage = '麦克风权限被拒绝'
          break
        case 'network':
          errorMessage = '网络错误'
          break
        case 'aborted':
          errorMessage = '语音识别已中止'
          break
      }
      
      Message.error(errorMessage)
      
      if (options.onError) {
        options.onError(errorMessage)
      }
      
      isRecording.value = false
    }

    // 结束处理
    recognition.onend = () => {
      isRecording.value = false
      
      if (options.onEnd) {
        options.onEnd()
      }
    }

    // 开始处理
    recognition.onstart = () => {
      console.log('Speech recognition started')
    }
  }

  // 初始化科大讯飞 WebSocket API（降级方案）
  const initXunfeiSpeechRecognition = () => {
    try {
      // 通过后端代理，不需要前端配置密钥
      xunfeiService = new XunfeiSpeechService({
        apiUrl: '/api/speech/recognize'
      })
      recognitionType = 'xunfei'
      isSupported.value = true
      console.log('[Speech Recognition] 使用科大讯飞语音识别服务（后端代理）')
    } catch (error) {
      console.error('[Speech Recognition] 科大讯飞服务初始化失败:', error)
      Message.error('语音识别服务初始化失败')
      recognitionType = null
    }
  }

  // 开始识别
  const start = () => {
    if (isRecording.value) {
      console.warn('Speech recognition is already running')
      return
    }

    // 重置状态
    transcript.value = ''
    interimTranscript.value = ''

    // 如果强制使用科大讯飞，需要清理原有实例并重新初始化
    if (currentOptions.forceXunfei && recognitionType !== 'xunfei') {
      console.log('[Speech Recognition] 切换到科大讯飞')
      if (recognition) {
        recognition = null
      }
      recognitionType = null
    }
    // 如果不强制使用科大讯飞，但当前是科大讯飞，需要切换回原生
    else if (!currentOptions.forceXunfei && recognitionType === 'xunfei') {
      console.log('[Speech Recognition] 切换回原生API')
      if (xunfeiService) {
        xunfeiService = null
      }
      recognitionType = null
    }

    // 检测支持并初始化
    if (!recognition && !xunfeiService) {
      // 如果强制使用科大讯飞，直接初始化
      if (currentOptions.forceXunfei) {
        console.log('[Speech Recognition] 强制使用科大讯飞')
        initXunfeiSpeechRecognition()
      } else if (checkSupport()) {
        initNativeSpeechRecognition()
      } else {
        initXunfeiSpeechRecognition()
      }
    }

    // 开始识别
    if (recognition && recognitionType === 'native') {
      try {
        recognition.start()
        isRecording.value = true
      } catch (error) {
        console.error('Failed to start recognition:', error)
        Message.error('启动语音识别失败')
      }
    } else if (xunfeiService && recognitionType === 'xunfei') {
      // 使用科大讯飞识别
      xunfeiService.start({
        onResult: (text, isFinal) => {
          if (isFinal) {
            transcript.value += text
            interimTranscript.value = ''
            if (options.onResult) {
              options.onResult(text, true)
            }
          } else {
            interimTranscript.value = text
            if (options.onResult) {
              options.onResult(text, false)
            }
          }
        },
        onError: (error) => {
          console.error('Xunfei recognition error:', error)
          Message.error(error)
          if (options.onError) {
            options.onError(error)
          }
          isRecording.value = false
        },
        onStart: () => {
          isRecording.value = true
        },
        onEnd: () => {
          isRecording.value = false
          if (options.onEnd) {
            options.onEnd()
          }
        }
      })
    }
  }

  // 停止识别
  const stop = () => {
    if (!isRecording.value) {
      return
    }

    if (recognition && recognitionType === 'native') {
      try {
        recognition.stop()
      } catch (error) {
        console.error('Failed to stop recognition:', error)
      }
    } else if (xunfeiService && recognitionType === 'xunfei') {
      xunfeiService.stop()
    }

    isRecording.value = false
  }

  // 切换识别状态
  const toggle = () => {
    if (isRecording.value) {
      stop()
    } else {
      start()
    }
  }

  // 清理资源
  const cleanup = () => {
    if (recognition) {
      stop()
      recognition = null
    }
    if (xunfeiService) {
      xunfeiService.stop()
      xunfeiService = null
    }
    recognitionType = null
  }

  // 组件卸载时清理
  onUnmounted(() => {
    cleanup()
  })

  // 更新配置
  const updateOptions = (newOptions: Partial<SpeechRecognitionOptions>) => {
    currentOptions = { ...currentOptions, ...newOptions }
    console.log('[Speech Recognition] 配置已更新:', currentOptions)
  }

  // 立即检测支持性
  checkSupport()

  return {
    isRecording,
    isSupported,
    transcript,
    interimTranscript,
    recognitionType,
    start,
    stop,
    toggle,
    cleanup,
    updateOptions // 暴露更新配置的方法
  }
}
