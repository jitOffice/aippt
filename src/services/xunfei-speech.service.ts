/**
 * 科大讯飞实时语音转写服务
 * 
 * 文档: https://www.xfyun.cn/doc/asr/rtasr/API.html
 * 
 * 安全改进:
 * - API 密钥配置在后端，不暴露给前端
 * - 前端通过后端 API 获取鉴权 URL
 */

interface XunfeiSpeechConfig {
  apiUrl?: string // 后端 API 地址
  appId?: string // APPID（从后端获取）
}

interface XunfeiSpeechOptions {
  onResult?: (text: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
}

export class XunfeiSpeechService {
  private config: XunfeiSpeechConfig
  private ws: WebSocket | null = null
  private audioContext: AudioContext | null = null
  private processor: ScriptProcessorNode | null = null
  private stream: MediaStream | null = null
  private isRecording = false
  private firstFrameSent = false
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Float32Array[] = []
  private frameCount = 0
  private lastSegId = -1  // 跟踪 seg_id
  private lastSegText = ''  // 最后一个 seg 的文本
  private options: XunfeiSpeechOptions | null = null  // 保存 options 以便在 onclose 中使用

  constructor(config: XunfeiSpeechConfig) {
    this.config = config
  }

  /**
   * 从后端获取鉴权 URL（安全）
   */
  private async generateAuthUrl(): Promise<string> {
    const apiUrl = this.config.apiUrl || '/api/speech/recognize'
    
    console.log('[Xunfei] Requesting auth URL from:', apiUrl)
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      
      console.log('[Xunfei] API response status:', response.status)
      
      const result = await response.json()
      console.log('[Xunfei] API response:', result)
      
      if (result.code === 200 && result.data?.authUrl) {
        console.log('[Xunfei] Got auth URL, length:', result.data.authUrl.length)
        console.log('[Xunfei] Auth URL:', result.data.authUrl)
        // 保存 appId
        if (result.data.appId) {
          this.config.appId = result.data.appId
          console.log('[Xunfei] Got appId:', result.data.appId)
        }
        return result.data.authUrl
      } else {
        throw new Error(result.message || '获取鉴权 URL 失败')
      }
    } catch (error: any) {
      console.error('[Xunfei] Get auth URL error:', error)
      throw new Error('语音识别服务不可用: ' + error.message)
    }
  }

  /**
   * 开始录音识别
   */
  async start(options: XunfeiSpeechOptions = {}) {
    if (this.isRecording) {
      console.warn('[Xunfei] Already recording')
      return
    }
    
    // 保存 options
    this.options = options
    
    // 重置状态
    this.firstFrameSent = false
    this.frameCount = 0
    this.lastSegId = -1
    this.lastSegText = ''

    try {
      // 1. 获取麦克风权限
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })

      // 2. 创建 WebSocket 连接
      const authUrl = await this.generateAuthUrl()
      this.ws = new WebSocket(authUrl)

      this.ws.onopen = () => {
        console.log('[Xunfei] WebSocket connected, waiting for started message...')
        // 注意：不需要发送 JSON 参数，直接等待服务器返回 started 消息
        // 然后开始发送音频数据
      }

      this.ws.onmessage = (event) => {
        console.log('[Xunfei] Received message:', event.data)
        const result = JSON.parse(event.data)
        console.log('[Xunfei] Parsed result:', result)
        console.log('[Xunfei] Result action:', result.action, 'code:', result.code)
        
        // 处理握手成功
        if (result.action === 'started') {
          console.log('[Xunfei] Handshake success, starting audio processing...')
          this.isRecording = true
          this.startAudioProcessing()
          if (options.onStart) {
            options.onStart()
          }
          return
        }
        
        // 处理错误
        if (result.action === 'error' || result.code !== '0') {
          console.error('[Xunfei] Error:', result.desc || result.message)
          if (options.onError) {
            options.onError(result.desc || result.message || `错误码: ${result.code}`)
          }
          return
        }

        // 解析识别结果
        if (result.action === 'result') {
          console.log('[Xunfei] Got result action, data:', result.data)
          if (result.data) {
            const { text, isFinal, segId } = this.parseResult(result.data)
            console.log(`[Xunfei] Parsed - segId: ${segId}, lastSegId: ${this.lastSegId}, text: "${text}"`)
            
            // 策略：seg_id 变化时，发送增量文本（新增部分）
            if (segId > this.lastSegId) {
              // 新 segment，计算增量
              let incrementalText = text
              if (this.lastSegId >= 0 && this.lastSegText && text.startsWith(this.lastSegText)) {
                // 如果新文本以旧文本开头，只取新增部分
                incrementalText = text.substring(this.lastSegText.length)
                console.log(`[Xunfei] Incremental text: "${incrementalText}" (new: "${text}", old: "${this.lastSegText}")`)
              } else if (this.lastSegId === -1) {
                // 第一次，发送全部文本
                console.log(`[Xunfei] First segment: "${text}"`)
              }
              
              // 发送增量文本
              if (incrementalText && options.onResult) {
                console.log(`[Xunfei] Sending incremental text: "${incrementalText}"`)
                options.onResult(incrementalText, false)
              }
              
              // 更新状态
              this.lastSegId = segId
              this.lastSegText = text
            } else if (segId === this.lastSegId) {
              // 同一 segment，更新文本（但不发送）
              console.log(`[Xunfei] Updating segment ${segId} text: "${text}"`)
              this.lastSegText = text
            }
          }
        }
      }

      this.ws.onerror = (error) => {
        console.error('[Xunfei] WebSocket error:', error)
        if (options.onError) {
          options.onError('WebSocket 连接失败')
        }
        this.stop()
      }

      this.ws.onclose = () => {
        console.log('[Xunfei] WebSocket closed')
        this.isRecording = false
        
        // WebSocket 关闭不再发送最后的文本
        // 因为 seg_id 变化时已经发送了增量
        
        if (this.options?.onEnd) {
          this.options.onEnd()
        }
      }

    } catch (error: any) {
      console.error('[Xunfei] Start error:', error)
      if (options.onError) {
        options.onError(error.message || '启动语音识别失败')
      }
    }
  }

  /**
   * 启动音频处理
   */
  private startAudioProcessing() {
    if (!this.stream) return

    // 使用浏览器原生采样率创建 AudioContext
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    console.log('[Xunfei] AudioContext sampleRate:', this.audioContext.sampleRate)
    console.log('[Xunfei] Stream audio track settings:', this.stream.getAudioTracks()[0]?.getSettings())
    
    const source = this.audioContext.createMediaStreamSource(this.stream)
    
    // 如果采样率不是 16000，需要重采样
    const targetSampleRate = 16000
    const sourceSampleRate = this.audioContext.sampleRate
    const bufferSize = 4096
    
    this.processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1)
    
    console.log('[Xunfei] Source sample rate:', sourceSampleRate, 'Target:', targetSampleRate)

    this.processor.onaudioprocess = (event) => {
      if (!this.isRecording || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return
      }

      // 获取音频数据
      const inputData = event.inputBuffer.getChannelData(0)
      
      // 计算音量（RMS）
      let sum = 0
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i]
      }
      const rms = Math.sqrt(sum / inputData.length)
      
      // 只有当有声音时才记录（防止日志过多）
      if (rms > 0.01) {
        console.log('[Xunfei] Audio detected, RMS:', rms.toFixed(4))
      }
      
      // 重采样到 16kHz（如果需要）
      let processedData = inputData
      if (sourceSampleRate !== targetSampleRate) {
        const ratio = targetSampleRate / sourceSampleRate
        const newLength = Math.round(inputData.length * ratio)
        const resampled = new Float32Array(newLength)
        
        for (let i = 0; i < newLength; i++) {
          const srcIndex = i / ratio
          const srcIndexFloor = Math.floor(srcIndex)
          const srcIndexCeil = Math.min(srcIndexFloor + 1, inputData.length - 1)
          const t = srcIndex - srcIndexFloor
          
          // 线性插值
          resampled[i] = inputData[srcIndexFloor] * (1 - t) + inputData[srcIndexCeil] * t
        }
        
        processedData = resampled
        
        // 只在第一次重采样时记录
        if (!this.firstFrameSent) {
          console.log('[Xunfei] Resampling:', sourceSampleRate, '->', targetSampleRate)
          console.log('[Xunfei] Original length:', inputData.length, 'Resampled:', processedData.length)
        }
      }
      
      // 转换为 Int16
      const audioData = new Int16Array(processedData.length)
      for (let i = 0; i < processedData.length; i++) {
        const s = Math.max(-1, Math.min(1, processedData[i]))
        audioData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
      }
            
      // 计数
      this.frameCount++
            
      // 前 3 帧记录详细信息
      if (this.frameCount <= 3) {
        console.log(`[Xunfei] Frame ${this.frameCount}, raw data length: ${audioData.length}`)
        console.log(`[Xunfei] Frame ${this.frameCount} first 10 samples:`, Array.from(audioData.slice(0, 10)))
      }
      
      // 发送音频数据（直接发送二进制，不用 Base64）
      // 根据官方 Demo，应该发送 Int8Array 而不是 Base64 字符串
      const int8Array = new Int8Array(audioData.buffer)
      this.ws?.send(int8Array)
    }

    source.connect(this.processor)
    this.processor.connect(this.audioContext.destination)
  }

  /**
   * 停止录音识别
   */
  stop() {
    console.log('[Xunfei] Stopping...')
    
    // 发送结束帧（根据官方 Demo）
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[Xunfei] Sending end frame...')
      this.ws.send('{"end": true}')
      
      // 延迟关闭，等待最后的结果
      console.log('[Xunfei] Waiting for final results...')
      setTimeout(() => {
        console.log('[Xunfei] Closing WebSocket...')
        this.ws?.close()
      }, 1000)
    }

    // 停止音频处理
    if (this.processor) {
      this.processor.disconnect()
      this.processor = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }

    this.isRecording = false
  }

  /**
   * 解析识别结果（根据官方 Demo）
   * 返回: { text: string, isFinal: boolean, segId: number }
   */
  private parseResult(data: string): { text: string; isFinal: boolean; segId: number } {
    try {
      // data 已经是 JSON 字符串，需要再次解析
      const parsed = JSON.parse(data)
      console.log('[Xunfei] Parsing result data:', parsed)
      
      const segId = parsed.seg_id ?? 0
      
      // 实时语音转写的格式：{"cn":{"st":{"rt":[{"ws":[...]}], "type":0}}}
      if (parsed.cn && parsed.cn.st && parsed.cn.st.rt) {
        // 根据官方 Demo，遍历所有 rt 数组元素
        let text = ''
        parsed.cn.st.rt.forEach((j: any) => {
          j.ws.forEach((k: any) => {
            k.cw.forEach((l: any) => {
              text += l.w
            })
          })
        })
        
        // type == 0 表示最终结果，否则是临时结果
        const isFinal = parsed.cn.st.type === 0 || parsed.cn.st.type === '0'
        console.log(`[Xunfei] Parsed text: "${text}", isFinal: ${isFinal}, segId: ${segId}`)
        
        return { text, isFinal, segId }
      }
    } catch (error) {
      console.error('[Xunfei] Parse result error:', error)
    }
    return { text: '', isFinal: false, segId: 0 }
  }

  /**
   * ArrayBuffer 转 Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  /**
   * 获取录音状态
   */
  getRecordingState(): boolean {
    return this.isRecording
  }
}
