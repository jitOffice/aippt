<template>
  <div class="ai-create-container">
    <!-- Template Selector Modal -->
    <TemplateSelector
      v-model="showTemplateSelector"
      @confirm="handleTemplateSelected"
      @cancel="handleTemplateCanceled"
    />

    <!-- Show Outline Editor when outline is generated -->
    <OutlineEditor
      v-if="showOutlineEditor"
      ref="outlineEditorRef"
      :initial-outline="generatedOutline"
      :initial-title="generatedTitle"
      :is-generating="isGeneratingPPT"
      @confirm="handleOutlineConfirm"
      @cancel="handleOutlineCancel"
      @regenerate="handleOutlineRegenerate"
      @optimize="handleOutlineOptimize"
    />

    <template v-else>
    <!-- Header -->
    <header class="create-header">
      <div class="header-content">
        <button @click="goBack" class="back-button">
          <Icon name="arrow-left" :size="20" />
        </button>
        <div class="header-info">
          <h1 class="header-title">{{ t('slide.create.title') }}</h1>
          <p class="header-subtitle">{{ t('slide.create.subtitle') }}</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="create-main">
      <div class="create-content">
        <!-- AI Generation Card -->
        <div class="generation-card">
          <!-- Title -->
          <div class="card-header">
            <div class="header-icon">
              <Icon name="layers" :size="20" />
            </div>
            <h2 class="card-title">{{ t('slide.create.smartGeneratePpt') }}</h2>
          </div>

          <!-- Input Area with Embedded Controls -->
          <div class="input-area">
            <textarea 
              v-model="pptTopic"
              :placeholder="t('slide.create.topicPlaceholder')"
              class="topic-input"
              @keydown.enter.ctrl="handleGenerate"
              @focus="inputFocused = true"
              @blur="inputFocused = false"
            />
            
            <!-- Quick Optimize Button (appears when input has content) -->
            <button 
              v-if="pptTopic.trim() && !isOptimizing"
              class="quick-optimize-button"
              @click="handleQuickOptimize"
              :title="'AI 智能优化输入内容'"
            >
              <Icon name="ai-wand" :size="14" />
              <span>一键优化</span>
            </button>
            
            <!-- Optimizing Indicator -->
            <div v-if="isOptimizing" class="optimizing-indicator">
              <span class="optimizing-spinner"></span>
              <span class="optimizing-text">AI 正在优化...</span>
            </div>
            
            <!-- Input Controls Overlay -->
            <div class="input-controls-overlay">
              <!-- Bottom Left: AI Reference & Upload -->
              <div class="input-bottom-left">
                <!-- AI Reference Badge -->
                <div 
                  class="ai-reference-badge" 
                  @click="handleReferenceClick"
                  :title="'查看已上传的参考文档'"
                >
                  <span class="ai-tag">AI</span>
                  <span class="reference-text">已参考 {{ uploadedDocuments.length }} 个文档</span>
                  <Icon name="chevron-down" :size="12" class="reference-dropdown-icon" />
                </div>
                
                <!-- Upload Document Button -->
                <button 
                  class="upload-button"
                  @click="handleUploadClick"
                  :title="'上传参考文档'"
                >
                  <Icon name="import-file" :size="16" />
                  <span class="upload-text">上传文档</span>
                </button>
              </div>
              
              <!-- Bottom Right: Voice & Generate -->
              <div class="input-bottom-right">
                <!-- Voice Input Button -->
                <button 
                  class="voice-input-button"
                  :class="{ 'recording': isRecording }"
                  @click="handleVoiceInput" 
                  :title="isRecording ? t('slide.create.stopRecording') : t('slide.create.voiceInput')"
                >
                  <Icon name="microphone" :size="18" />
                  <span v-if="isRecording" class="recording-pulse"></span>
                </button>
                
                <!-- Generate Button -->
                <button 
                  class="generate-button-inline"
                  :class="{ 'loading': isGenerating, 'disabled': !pptTopic.trim() }"
                  :disabled="!pptTopic.trim() || isGenerating"
                  @click="handleGenerate"
                >
                  <Icon v-if="!isGenerating" name="generate" :size="18" />
                  <span class="button-text">{{ isGenerating ? t('slide.create.generating') : t('slide.create.generate') }}</span>
                  <span v-if="isGenerating" class="loading-spinner"></span>
                </button>
              </div>
            </div>
            
            <!-- Voice Recognition Interim Text -->
            <div v-if="isRecording && interimTranscript" class="interim-transcript">
              <Icon name="microphone" :size="14" class="interim-icon" />
              <span>{{ interimTranscript }}</span>
            </div>
          </div>
          
          <!-- Uploaded Documents List -->
          <div v-if="uploadedDocuments.length > 0" class="uploaded-documents">
            <div class="documents-header">
              <span class="documents-title">
                <Icon name="import-file" :size="14" />
                参考文档 ({{ uploadedDocuments.length }}/3)
              </span>
            </div>
            <div class="documents-list">
              <div 
                v-for="(doc, index) in uploadedDocuments" 
                :key="doc.id"
                class="document-card"
              >
                <!-- Delete Button (top right) -->
                <button 
                  class="document-remove"
                  @click="handleRemoveDocument(index)"
                  :title="'删除文档'"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                
                <!-- Document Icon -->
                <div class="document-icon">
                  <Icon :name="getDocumentIcon(doc.type)" :size="20" />
                </div>
                
                <!-- Document Info -->
                <div class="document-info">
                  <div class="document-name" :title="doc.name">{{ doc.name }}</div>
                  <div class="document-size">{{ formatFileSize(doc.size) }}</div>
                  <div class="document-status" v-if="doc.extracted">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {{ doc.keyPoints }}个
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Hidden File Input -->
          <input 
            ref="fileInputRef"
            type="file"
            class="hidden-file-input"
            accept=".docx,.doc,.pdf,.md,.txt"
            multiple
            @change="handleFileSelect"
          />

          <!-- Options Bar -->
          <div class="options-bar">
            <div class="options-list">
              <!-- Model Selection -->
              <a-dropdown trigger="click">
                <div class="option-item">
                  <Icon name="star-fill" :size="16" class="option-icon-blue" />
                  <span class="option-label">{{ selectedModel }}</span>
                  <Icon name="chevron-down" :size="14" class="dropdown-icon" />
                </div>
                <template #content>
                  <a-doption @click="selectedModel = 'DeepSeek V3'">DeepSeek V3</a-doption>
                  <a-doption @click="selectedModel = 'GPT-4'">GPT-4</a-doption>
                  <a-doption @click="selectedModel = 'Claude 3'">Claude 3</a-doption>
                </template>
              </a-dropdown>

              <!-- Page Count -->
              <a-dropdown trigger="click">
                <div class="option-item">
                  <span class="option-text">{{ t('slide.create.pageCount') }}</span>
                  <span class="option-value">{{ selectedPageCount }}</span>
                  <Icon name="chevron-down" :size="14" class="dropdown-icon" />
                </div>
                <template #content>
                  <a-doption @click="selectedPageCount = '5 - 10页'">5 - 10页</a-doption>
                  <a-doption @click="selectedPageCount = '15 - 20页'">15 - 20页</a-doption>
                  <a-doption @click="selectedPageCount = '20 - 30页'">20 - 30页</a-doption>
                </template>
              </a-dropdown>

              <!-- Text Amount -->
              <a-dropdown trigger="click">
                <div class="option-item">
                  <span class="option-text">{{ t('slide.create.textAmount') }}</span>
                  <span class="option-value">{{ selectedTextAmount }}</span>
                  <Icon name="chevron-down" :size="14" class="dropdown-icon" />
                </div>
                <template #content>
                  <a-doption @click="selectedTextAmount = '简洁'">简洁</a-doption>
                  <a-doption @click="selectedTextAmount = '详细'">详细</a-doption>
                  <a-doption @click="selectedTextAmount = '非常详细'">非常详细</a-doption>
                </template>
              </a-dropdown>

              <!-- Language -->
              <a-dropdown trigger="click">
                <div class="option-item">
                  <span class="option-text">{{ t('slide.create.language') }}</span>
                  <span class="option-value">{{ selectedLanguage }}</span>
                  <Icon name="chevron-down" :size="14" class="dropdown-icon" />
                </div>
                <template #content>
                  <a-doption @click="selectedLanguage = '简体中文'">简体中文</a-doption>
                  <a-doption @click="selectedLanguage = 'English'">English</a-doption>
                  <a-doption @click="selectedLanguage = '繁體中文'">繁體中文</a-doption>
                </template>
              </a-dropdown>

              <!-- Style -->
              <a-dropdown trigger="click">
                <div class="option-item">
                  <span class="option-text">{{ t('slide.create.style') }}</span>
                  <span class="option-value">{{ selectedStyle }}</span>
                  <Icon name="chevron-down" :size="14" class="dropdown-icon" />
                </div>
                <template #content>
                  <a-doption @click="selectedStyle = '商务专业'">商务专业</a-doption>
                  <a-doption @click="selectedStyle = '创意时尚'">创意时尚</a-doption>
                  <a-doption @click="selectedStyle = '大众'">大众</a-doption>
                </template>
              </a-dropdown>


            </div>
          </div>
        </div>

        <!-- Recommended Topics -->
        <div class="recommended-section">
          <div class="section-header">
            <Icon name="lightbulb" :size="16" class="lightbulb-icon" />
            <h3 class="section-title">{{ t('slide.create.recommendedTopics') }}</h3>
          </div>
          <div class="topic-tags">
            <button 
              v-for="topic in recommendedTopics" 
              :key="topic"
              class="topic-tag"
              @click="pptTopic = topic"
            >
              {{ topic }}
            </button>
          </div>
        </div>


      </div>
    </main>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { 
  Button as AButton,
  Dropdown as ADropdown,
  Doption as ADoption
} from '@arco-design/web-vue'
import IIcon from '@/utils/slide/icon.js'
import { generateOutlineOnly, generatePPTFromOutline, convertCozeToPPTData } from '@/api/coze'
import { generateOutlineStream } from '@/api/coze-stream'
import OutlineEditor from '@/components/OutlineEditor.vue'
import TemplateSelector from '@/components/TemplateSelector.vue'
import { convertMarkdownToPPT } from '@/utils/markdown-to-ppt'
import { templateApi } from '@/api/template'
import { presentationApi } from '@/api/presentation'
import { useSpeechRecognition } from '@/composables/useSpeechRecognition'


const Icon = IIcon
const router = useRouter()
const { t } = useI18n()

// State

const pptTopic = ref('')
const isGenerating = ref(false)
const isOptimizing = ref(false)
const inputFocused = ref(false)

// File upload state
const fileInputRef = ref(null)
const uploadedDocuments = ref([])
const uploadingFiles = ref([])

// Template selector state
const showTemplateSelector = ref(false)
const pendingOutlineData = ref(null)

// 语音识别 - 默认使用科大讯飞
const useXunfei = ref(true)

const speechOptions = computed(() => ({
  lang: 'zh-CN',
  continuous: true,
  interimResults: true,
  forceXunfei: useXunfei.value,
  onResult: (text, isFinal) => {
    console.log('[AI Create] ========== 语音识别结果 ==========')
    console.log('[AI Create] text:', text)
    console.log('[AI Create] isFinal:', isFinal)
    console.log('[AI Create] 当前 pptTopic:', pptTopic.value)
    
    // 后端已经通过 seg_id 去重，直接追加
    if (text) {
      pptTopic.value += text
      console.log('[AI Create] 更新后 pptTopic:', pptTopic.value)
    } else {
      console.warn('[AI Create] 收到空文本！')
    }
  },
  onError: (error) => {
    console.error('[AI Create] Speech recognition error:', error)
  },
  onEnd: () => {
    console.log('[AI Create] 语音识别结束')
    if (transcript.value) {
      Message.success(t('slide.create.voiceInputComplete'))
    }
  }
}))

// Two-stage workflow state
const showOutlineEditor = ref(false)
const generatedOutline = ref('')
const generatedTitle = ref('')
const isGeneratingPPT = ref(false)
const outlineEditorRef = ref(null)

const {
  isRecording,
  isSupported: isSpeechSupported,
  transcript,
  interimTranscript,
  toggle: toggleSpeechRecognition,
  cleanup: cleanupSpeech,
  updateOptions: updateSpeechOptions
} = useSpeechRecognition(speechOptions.value)

// Options
const selectedModel = ref('DeepSeek V3')
const selectedPageCount = ref('15 - 20页')
const selectedTextAmount = ref('详细')
const selectedLanguage = ref('简体中文')
const selectedStyle = ref('大众')

// Recommended topics
const recommendedTopics = ref([
  '数字化转型的下半场布局',
  '2025年工作总结与目标规划',
  'ESG与绿色可持续发展战略'
])

// Methods
const goBack = () => {
  router.push('/')
}

const handleReferenceClick = () => {
  if (uploadedDocuments.value.length === 0) {
    Message.info('还没有上传参考文档，点击“上传文档”按钮添加')
    return
  }
  // TODO: 显示文档列表弹窗，可查看详情、删除等
  Message.info(`当前已上传 ${uploadedDocuments.value.length} 个文档`)
}

const handleUploadClick = () => {
  if (uploadedDocuments.value.length >= 3) {
    Message.warning('最多只能上传 3 个文档，请先删除部分文档')
    return
  }
  // 触发文件选择器
  fileInputRef.value?.click()
}

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files || [])
  if (files.length === 0) return
  
  // 检查文件数量
  const remainingSlots = 3 - uploadedDocuments.value.length
  if (files.length > remainingSlots) {
    Message.warning(`最多只能再上传 ${remainingSlots} 个文档`)
    event.target.value = '' // 重置 input
    return
  }
  
  // 逐个验证和上传
  for (const file of files) {
    await uploadDocument(file)
  }
  
  // 重置 input
  event.target.value = ''
}

const uploadDocument = async (file) => {
  // 1. 验证文件类型
  const allowedTypes = ['.docx', '.doc', '.pdf', '.md', '.txt']
  const fileExt = '.' + file.name.split('.').pop().toLowerCase()
  
  if (!allowedTypes.includes(fileExt)) {
    Message.error(`不支持的文件格式：${fileExt}，请上传 Word、PDF、Markdown 或纯文本文件`)
    return
  }
  
  // 2. 验证文件大小 (10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    Message.error(`文件大小超限：${file.name}，最大支持 10MB`)
    return
  }
  
  // 3. 创建文档对象
  const docId = Date.now() + Math.random()
  const document = {
    id: docId,
    name: file.name,
    size: file.size,
    type: fileExt,
    file: file,
    uploading: true,
    progress: 0,
    extracted: false,
    keyPoints: 0
  }
  
  uploadedDocuments.value.push(document)
  
  try {
    // 4. 模拟上传进度（实际需要调用上传 API）
    Message.loading({
      content: `正在上传 ${file.name}...`,
      duration: 0,
      id: `upload-${docId}`
    })
    
    // 模拟上传进度
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 200))
      document.progress = i
    }
    
    // 5. 上传成功，模拟 AI 提取
    document.uploading = false
    Message.clear()
    Message.loading({
      content: `AI 正在解析 ${file.name}...`,
      duration: 0,
      id: `extract-${docId}`
    })
    
    // 模拟 AI 提取关键点
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    document.extracted = true
    document.keyPoints = Math.floor(Math.random() * 10) + 5 // 5-15个关键点
    
    Message.clear()
    Message.success(`${file.name} 上传成功，已提取 ${document.keyPoints} 个关键点`)
    
    // TODO: 实际实现时需要：
    // 1. 调用文件上传 API
    // 2. 调用 AI 文档解析 API
    // 3. 获取提取的关键信息（标题、大纲、关键点等）
    // 4. 将提取信息存储到 document 对象中
    
  } catch (error) {
    Message.clear()
    console.error('文档上传失败:', error)
    Message.error(`${file.name} 上传失败，请重试`)
    
    // 移除失败的文档
    const index = uploadedDocuments.value.findIndex(d => d.id === docId)
    if (index > -1) {
      uploadedDocuments.value.splice(index, 1)
    }
  }
}

const handleRemoveDocument = (index) => {
  const doc = uploadedDocuments.value[index]
  uploadedDocuments.value.splice(index, 1)
  Message.success(`已移除 ${doc.name}`)
}

const getDocumentIcon = (type) => {
  const iconMap = {
    '.docx': 'import-file',
    '.doc': 'import-file',
    '.pdf': 'import-file',
    '.md': 'import-file',
    '.txt': 'import-file'
  }
  return iconMap[type] || 'import-file'
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleQuickOptimize = async () => {
  if (!pptTopic.value.trim()) {
    Message.warning('请先输入一些内容')
    return
  }
  
  isOptimizing.value = true
  const originalText = pptTopic.value
  
  try {
    Message.loading({
      content: 'AI 正在优化你的输入...',
      duration: 0,
      id: 'optimizing'
    })
    
    // 模拟 AI 优化过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟优化结果
    const optimizedText = await mockOptimizeText(originalText)
    
    pptTopic.value = optimizedText
    
    Message.clear()
    Message.success({
      content: '优化完成！已为你扩充和优化表达',
      duration: 3000
    })
    
    // TODO: 实际实现时需要：
    // 1. 调用 AI API 进行文本优化
    // 2. 优化策略：
    //    - 扩充简短输入，添加更多细节
    //    - 优化语句结构，让表达更清晰
    //    - 添加关键词，提高 PPT 生成质量
    //    - 结合已上传的文档内容进行优化
    
  } catch (error) {
    Message.clear()
    console.error('AI 优化失败:', error)
    Message.error('优化失败，请重试')
    pptTopic.value = originalText // 恢复原文本
  } finally {
    isOptimizing.value = false
  }
}

// 模拟 AI 优化文本
 const mockOptimizeText = async (text) => {
  // 简单的优化逻辑示例
  const optimizations = [
    {
      pattern: /^(.{1,20})$/,
      replace: (match, p1) => `${p1}。本次演示将从背景、现状、解决方案和未来展望四个方面进行深入阐述。`
    },
    {
      pattern: /产品/g,
      replace: '产品介绍与价值分析'
    },
    {
      pattern: /总结/g,
      replace: '工作总结与成果展示'
    }
  ]
  
  let optimized = text
  for (const opt of optimizations) {
    if (opt.pattern.test(optimized)) {
      optimized = optimized.replace(opt.pattern, opt.replace)
      break
    }
  }
  
  return optimized
}

const handleVoiceInput = () => {
  console.log('[handleVoiceInput] 开始语音输入 (科大讯飞)')
  
  if (isRecording.value) {
    // 停止录音
    toggleSpeechRecognition()
    Message.info(t('slide.create.voiceInputStopped'))
  } else {
    // 开始录音
    toggleSpeechRecognition()
    Message.info(t('slide.create.voiceInputStarted') + ' (科大讯飞)')
  }
}

const handleGenerate = async () => {
  if (!pptTopic.value.trim()) {
    Message.warning(t('slide.create.pleaseEnterTopic'))
    return
  }

  isGenerating.value = true

  try {
    console.log('[AI Create] 开始生成 PPT 大纲，主题:', pptTopic.value)
    
    // Stage 1: 调用 Coze 工作流流式生成 PPT 大纲
    
    // 初始化流式数据
    let streamedOutline = ''
    let streamedTitle = pptTopic.value
    
    // 设置为编辑模式，显示空的编辑器
    generatedOutline.value = ''
    generatedTitle.value = streamedTitle
    showOutlineEditor.value = true
    
    // 等待 OutlineEditor 渲染完成，然后启动流式进度条
    await nextTick()
    if (outlineEditorRef.value) {
      outlineEditorRef.value.startStreaming()
    }
    
    // 开始流式生成
    await generateOutlineStream({
      keyword: pptTopic.value,
      model: selectedModel.value,
      pageCount: selectedPageCount.value,
      textAmount: selectedTextAmount.value,
      language: selectedLanguage.value,
      style: selectedStyle.value
    }, (type, data) => {
      console.log('[AI Create Stream]', type, data)
      
      switch (type) {
        case 'start':
          console.log('[AI Create] 开始生成大纲')
          if (outlineEditorRef.value) {
            outlineEditorRef.value.updateStreamingProgress(5)
          }
          break
          
        case 'title':
          streamedTitle = data.content
          generatedTitle.value = streamedTitle
          console.log('[AI Create] 收到标题:', streamedTitle)
          if (outlineEditorRef.value) {
            outlineEditorRef.value.updateStreamingProgress(10)
          }
          break
          
        case 'outline':
          // 逐步追加大纲内容
          streamedOutline += data.content
          generatedOutline.value = streamedOutline
          console.log('[AI Create] 大纲进度:', data.progress + '%')
          if (outlineEditorRef.value) {
            // 将进度映射到 10-95% 范围
            const mappedProgress = 10 + (parseInt(data.progress) * 0.85)
            outlineEditorRef.value.updateStreamingProgress(mappedProgress)
          }
          break
          
        case 'complete':
          streamedOutline = data.outline
          streamedTitle = data.title
          generatedOutline.value = streamedOutline
          generatedTitle.value = streamedTitle
          console.log('[AI Create] 大纲生成完成')
          if (outlineEditorRef.value) {
            outlineEditorRef.value.updateStreamingProgress(100)
            // 稍微延迟关闭进度条，让用户看到 100%
            setTimeout(() => {
              if (outlineEditorRef.value) {
                outlineEditorRef.value.stopStreaming()
              }
              Message.success('大纲生成成功！')
            }, 500)
          }
          break
          
        case 'error':
          throw new Error(data.message || '生成失败')
      }
    })
    

    
  } catch (error) {
    Message.clear()
    console.error('[AI Create] 生成失败:', error)
    Message.error({
      content: error.message || t('slide.create.generateError'),
      duration: 3000
    })
  } finally {
    isGenerating.value = false
  }
}
// 大纲编辑器事件处理
const handleOutlineConfirm = async ({ outline, title, needsTemplate }) => {
  // 如果需要选择模板，显示模板选择器
  if (needsTemplate) {
    showTemplateSelector.value = true
    pendingOutlineData.value = { outline, title }
    return
  }
  
  // 否则直接生成（兼容旧流程）
  await generatePPTWithOutline(outline, title)
}

// 生成 PPT（提取为独立函数）
const generatePPTWithOutline = async (outline, title, template = null) => {
  isGeneratingPPT.value = true
  
  try {
    console.log('[AI Create] Stage 2: 根据大纲生成 PPT')
    
    Message.loading({
      content: '正在生成完整 PPT...',
      duration: 0,
      id: 'ppt-generating'
    })
    
    // Stage 2: 根据编辑后的大纲生成 PPT
    const pptResult = await generatePPTFromOutline({
      outline,
      title,
      keyword: pptTopic.value,
      style: selectedStyle.value
    })
    
    if (!pptResult.success) {
      throw new Error(pptResult.error || '生成失败')
    }
    
    // 解析 Markdown 为 PPT 数据结构
    const pptData = convertCozeToPPTData(pptResult)
    
    console.log('[AI Create] PPT 数据结构:', pptData)
    
    // 创建新的 Slide 文档并保存数据
    Message.loading({
      content: '正在创建演示文档...',
      duration: 0,
      id: 'creating-doc'
    })
    
    // 调用文档 API 创建新文档（type='slide'）
    const { documentApi } = await import('@/api/document')
    const docResponse = await documentApi.createDocument(pptData.title, 'slide')
    
    if (docResponse.data?.code !== 200) {
      throw new Error('创建文档失败')
    }
    
    const docId = docResponse.data.data.id
    console.log('[AI Create] 文档创建成功, ID:', docId)
    
    // 保存 PPT 内容到后端
    await documentApi.saveSlide(docId, JSON.stringify(pptData))
    
    Message.clear()
    Message.success({
      content: `成功生成 ${pptData.slides.length} 页演示文稿！`,
      duration: 2000
    })
    
    // 跳转到 Slide 编辑器
    setTimeout(() => {
      router.push(`/slide/${docId}`)
    }, 500)
    
  } catch (error) {
    Message.clear()
    console.error('[AI Create] PPT 生成失败:', error)
    Message.error({
      content: error.message || '生成失败，请重试',
      duration: 3000
    })
  } finally {
    isGeneratingPPT.value = false
  }
}

const handleOutlineCancel = () => {
  showOutlineEditor.value = false
  generatedOutline.value = ''
  generatedTitle.value = ''
}

const handleOutlineRegenerate = async () => {
  // 重新生成大纲
  showOutlineEditor.value = false
  await handleGenerate()
}

const handleOutlineOptimize = async () => {
  // TODO: 实现 AI 优化大纲功能
  Message.info('优化功能开发中...')
}

// 模板选择器事件处理
const handleTemplateSelected = async (template) => {
  try {
    Message.loading({
      content: '正在应用模板...',
      duration: 0,
      id: 'applying-template'
    })

    // 1. 获取完整模板数据
    const result = await templateApi.getTemplate(template.id)
    
    if (result.code !== 200) {
      throw new Error(result.message || '获取模板失败')
    }

    const fullTemplate = result.data.template

    // 2. 获取 Markdown 大纲
    const { outline, title } = pendingOutlineData.value
    
    console.log('[AI Create] Saving with markdown outline and template reference')

    // 3. 创建新的 Slide 文档并保存（保存 markdown 内容）
    Message.loading({
      content: '正在保存文档...',
      duration: 0,
      id: 'saving-doc'
    })

    const docId = await createAndSavePresentation({
      title: title,
      content: outline,  // 保存 markdown 内容，而不是转换后的 PPT 数据
      templateId: template.id
    })

    Message.clear()
    Message.success('PPT 创建成功！')

    // 4. 跳转到编辑页面
    setTimeout(() => {
      router.push(`/slide/${docId}`)
    }, 500)

  } catch (error) {
    Message.clear()
    console.error('[AI Create] 应用模板失败:', error)
    Message.error(error.message || '应用模板失败，请重试')
  } finally {
    showTemplateSelector.value = false
    pendingOutlineData.value = null
  }
}

const handleTemplateCanceled = () => {
  showTemplateSelector.value = false
  pendingOutlineData.value = null
  Message.info('已取消模板选择')
}

// 创建并保存 Presentation
const createAndSavePresentation = async ({ title, content, templateId }) => {
  try {
    const result = await presentationApi.create({
      title: title || 'Untitled Presentation',
      description: `Created with template: ${templateId}`,
      content: content,
      thumbnail: null,
      isPublic: false,
    })
    
    if (result.code !== 201 && result.code !== 200) {
      throw new Error(result.message || '创建文档失败')
    }

    console.log('[createAndSavePresentation] Success:', result.data.presentation)
    return result.data.presentation.id
  } catch (error) {
    console.error('[createAndSavePresentation] Error:', error)
    throw error
  }
}
</script>

<style scoped>
/* Container */
.ai-create-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  overflow: hidden;
}

/* Header */
.create-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  flex-shrink: 0;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 16px;
  color: #64748b;
}

.back-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.header-info {
  flex: 1;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.header-subtitle {
  font-size: 12px;
  color: #64748b;
  margin: 4px 0 0 0;
  line-height: 1.5;
}

/* Main Content */
.create-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.create-content {
  max-width: 1280px;
  margin: 0 auto;
}

/* Generation Card */
.generation-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  padding: 20px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.header-icon {
  width: 24px;
  height: 24px;
  background: #dbeafe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Input Area */
.input-area {
  position: relative;
  margin-bottom: 16px;
}

.topic-input {
  width: 100%;
  min-height: 180px;
  max-height: 400px;
  padding: 16px;
  padding-bottom: 64px; /* 为底部控件留出更多空间 */
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s;
  font-family: inherit;
  color: #0f172a;
  box-sizing: border-box; /* 确保 padding 不会导致超出 */
}

.topic-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}

.topic-input::placeholder {
  color: #94a3b8;
}

/* Quick Optimize Button */
.quick-optimize-button {
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(59, 130, 246, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 5;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.08);
  line-height: 1;
}

.quick-optimize-button > span {
  display: inline-flex;
  align-items: center;
}

.quick-optimize-button:hover {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.quick-optimize-button:active {
  transform: translateY(0);
  background: rgba(59, 130, 246, 0.15);
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.08);
}

/* Optimizing Indicator */
.optimizing-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fcd34d;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #d97706;
  z-index: 5;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.15);
}

.optimizing-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(217, 119, 6, 0.2);
  border-top-color: #d97706;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.optimizing-text {
  white-space: nowrap;
}

/* Input Controls Overlay */
.input-controls-overlay {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  pointer-events: none;
  flex-wrap: wrap; /* 支持换行 */
}

.input-bottom-left,
.input-bottom-right {
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
  flex-shrink: 0; /* 防止被压缩 */
}

.input-bottom-left {
  flex-wrap: wrap; /* 左侧控件支持换行 */
}

/* AI Reference Badge */
.ai-reference-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.ai-reference-badge:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #93c5fd;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.ai-reference-badge:active {
  transform: translateY(0);
}

.ai-tag {
  padding: 3px 6px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reference-text {
  font-size: 12px;
  font-weight: 600;
  color: #1e40af;
}

.reference-dropdown-icon {
  color: #3b82f6;
  transition: transform 0.2s;
}

.ai-reference-badge:hover .reference-dropdown-icon {
  transform: translateY(1px);
}

/* Upload Document Button */
.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.upload-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.upload-button:active {
  transform: translateY(0);
}

.upload-text {
  white-space: nowrap;
}

/* Hidden File Input */
.hidden-file-input {
  display: none;
}

/* Uploaded Documents */
.uploaded-documents {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  margin-bottom: 16px;
}

.documents-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.documents-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.documents-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.document-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
  min-width: 0; /* 允许收缩 */
}

.document-card:hover {
  background: #fafbfc;
  border-color: #bfdbfe;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.document-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  flex-shrink: 0;
}

.document-card:hover .document-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.document-info {
  flex: 1;
  min-width: 0; /* 允许收缩 */
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.document-name {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.document-size {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
}

.document-status {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #10b981;
  font-weight: 600;
  font-size: 10px;
}

.document-status svg {
  flex-shrink: 0;
}

.document-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s;
  opacity: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.document-card:hover .document-remove {
  opacity: 1;
}

.document-remove:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
  transform: scale(1.15);
}

.document-remove svg {
  width: 12px;
  height: 12px;
}

/* Voice Input Button */
.voice-input-button {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
  overflow: hidden;
}

.voice-input-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
  transform: translateY(-1px);
}

.voice-input-button.recording {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #fca5a5;
  color: #dc2626;
  animation: recording-pulse 1.5s ease-in-out infinite;
}

.recording-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: rgba(220, 38, 38, 0.3);
  animation: pulse-ring 1.5s ease-out infinite;
}

@keyframes recording-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(220, 38, 38, 0);
  }
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

/* Generate Button Inline */
.generate-button-inline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.generate-button-inline:hover:not(.disabled):not(.loading) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.generate-button-inline:active:not(.disabled):not(.loading) {
  transform: translateY(0);
}

.generate-button-inline.disabled {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  cursor: not-allowed;
  box-shadow: none;
}

.generate-button-inline.loading {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  cursor: wait;
}

.generate-button-inline .button-text {
  font-weight: 600;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Voice Recognition Interim Text */
.interim-transcript {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: calc(100% - 32px);
  padding: 10px 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #bfdbfe;
  border-radius: 12px;
  font-size: 13px;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  animation: fade-in 0.3s ease-out;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(8px);
  z-index: 10;
}

.interim-icon {
  flex-shrink: 0;
  color: #2563eb;
  animation: pulse-icon 1s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.interim-transcript span {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Options Bar */
.options-bar {
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.options-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover {
  background: #f1f5f9;
}

.option-icon-blue {
  color: #2563eb;
}

.option-text {
  color: #64748b;
}

.option-value {
  font-weight: 700;
  color: #0f172a;
}

.dropdown-icon {
  color: #94a3b8;
}

/* Recommended Topics */
.recommended-section {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.lightbulb-icon {
  color: #94a3b8;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  margin: 0;
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-tag {
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.topic-tag:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
}

/* Responsive */
@media (max-width: 1024px) {
  .creation-methods {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .generate-button-inline .button-text {
    display: none; /* 小屏幕隐藏文字 */
  }
  
  .generate-button-inline {
    padding: 10px 14px; /* 减小内边距 */
  }
}

@media (max-width: 768px) {
  .input-controls-overlay {
    gap: 8px;
  }
  
  .input-bottom-left,
  .input-bottom-right {
    gap: 6px;
  }
  
  .ai-reference-badge .reference-text {
    display: none;
  }
  
  .upload-button .upload-text {
    display: none;
  }
  
  .ai-reference-badge,
  .upload-button {
    padding: 8px;
  }
  
  .topic-input {
    min-height: 160px;
    padding-bottom: 56px;
  }
  
  .quick-optimize-button {
    padding: 6px 8px;
    font-size: 11px;
    gap: 4px;
  }
  
  .quick-optimize-button span {
    display: none;
  }
  
  .documents-list {
    grid-template-columns: repeat(2, 1fr); /* 平板2列 */
  }
  
  .document-icon {
    width: 32px;
    height: 32px;
  }
  
  .document-name {
    font-size: 11px;
  }
}

@media (max-width: 640px) {
  .creation-methods {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .documents-list {
    grid-template-columns: 1fr; /* 手机1列 */
  }
}

/* Creation Methods */
.creation-methods {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.method-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.method-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.method-card.active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.method-card.primary-method.active {
  border-color: #2563eb;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.method-icon {
  width: 48px;
  height: 48px;
  background: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #3b82f6;
  transition: all 0.2s;
}

.method-card:hover .method-icon {
  transform: scale(1.05);
}

.method-card.active .method-icon,
.method-icon.primary-icon {
  background: #2563eb;
  color: white !important;
}

/* 确保选中状态下的图标可见 - 覆盖 SVG 的 currentColor */
.method-card.active .method-icon svg,
.method-icon.primary-icon svg {
  color: white !important;
  fill: white !important;
}

.method-card.active .method-icon svg path,
.method-icon.primary-icon svg path {
  fill: white !important;
}

.method-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Recent Section */
.recent-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
}

.recent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.recent-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.view-all-link:hover {
  color: #1d4ed8;
}

.recent-list {
  display: flex;
  gap: 12px;
}

.recent-item {
  flex: 1;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.recent-item:hover {
  background: #f1f5f9;
}

.recent-name {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.recent-time {
  font-size: 12px;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 1024px) {
  .creation-methods {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .creation-methods {
    grid-template-columns: 1fr;
  }
}

</style>
