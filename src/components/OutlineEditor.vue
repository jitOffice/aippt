<template>
  <div class="outline-editor-container">
    <!-- Header -->
    <div class="editor-header">
      <div class="header-left">
        <a-button type="text" size="small" @click="handleBack">
        
          <Icon name="back-edit" :size="20" />
        </a-button>
        <h3 class="header-title">{{ t('slide.outline.editTitle') }}</h3>
      </div>
      <div class="header-right">
        <!-- <a-button @click="handleCollectDoc">
          <template #icon>
            <Icon name="document" :size="16" />
          </template>
          {{ t('slide.outline.collectDoc') }}
        </a-button> -->
        <!-- <a-button @click="handleSkipEdit" :disabled="isGenerating">
          {{ t('slide.outline.skipEdit') }}
        </a-button> -->
        <a-button type="primary" :loading="isGenerating" @click="handleConfirm" class="generate-ppt-button">
        <svg v-if="!isGenerating" width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="play-icon">
          <path d="M1 1.5L11 7L1 12.5V1.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ isGenerating ? t('slide.outline.generating') : t('slide.outline.generatePPT') }}
      </a-button>
      </div>
    </div>

    <!-- Main Content: Split view (2/3 + 1/3) -->
    <div class="editor-main">
      <!-- Left: Tree Editor (2/3) -->
      <div class="editor-left">
        <div class="outline-tree-container">
          <!-- Cover Slide Card -->
          <div class="outline-card" :class="{ 'active-outline': activeSectionIndex === -1 }" @click="setActiveSection(-1)">
            <div class="card-header">
              <div class="slide-number">01</div>
              <div class="card-content">
                <div class="card-title-wrapper">
                  <span class="card-title-label">{{ t('slide.outline.coverPage') }}:</span>
                  <input 
                    v-model="editableTitle"
                    :placeholder="t('slide.outline.titlePlaceholder')"
                    class="card-title-input"
                    :disabled="isStreaming"
                    @click.stop
                    @blur="updateOutlineText"
                  />
                </div>
                <p class="card-subtitle">{{ t('slide.outline.presenter') }}: AI | {{ t('slide.outline.date') }}: {{ currentDate }}</p>
              </div>
            </div>
            <!-- Quick Actions on Hover -->
            <div class="quick-actions" v-if="!isStreaming">
              <a-button type="text" size="mini" class="quick-action-btn magic">
                <Icon name="magic-wand" :size="14" />
              </a-button>
              <a-button type="text" size="mini" class="quick-action-btn">
                <Icon name="plus" :size="14" />
              </a-button>
              <a-button type="text" size="mini" class="quick-action-btn">
                <Icon name="delete" :size="14" />
              </a-button>
            </div>
          </div>

          <!-- Outline Section Cards -->
          <div 
            v-for="(section, index) in outlineSections" 
            :key="index"
            class="outline-card"
            :class="{ 'active-outline': activeSectionIndex === index, 'dragging': draggedIndex === index }"
            draggable="true"
            @dragstart="handleDragStart(index, $event)"
            @dragover="handleDragOver(index, $event)"
            @dragend="handleDragEnd"
            @drop="handleDrop(index, $event)"
            @click="setActiveSection(index)"
          >
            <div class="card-header">
              <div class="drag-handle" @mousedown.stop>
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="3" cy="4" r="1.5" fill="currentColor" opacity="0.3"/>
                  <circle cx="9" cy="4" r="1.5" fill="currentColor" opacity="0.3"/>
                  <circle cx="3" cy="8" r="1.5" fill="currentColor" opacity="0.3"/>
                  <circle cx="9" cy="8" r="1.5" fill="currentColor" opacity="0.3"/>
                  <circle cx="3" cy="12" r="1.5" fill="currentColor" opacity="0.3"/>
                  <circle cx="9" cy="12" r="1.5" fill="currentColor" opacity="0.3"/>
                </svg>
              </div>
              <a-button 
                type="text" 
                size="mini" 
                class="collapse-icon"
                @click.stop="toggleSection(index)" 
                v-if="section.children && section.children.length > 0"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    :d="section.collapsed ? 'M6 4L10 8L6 12' : 'M4 6L8 10L12 6'" 
                    stroke="currentColor" 
                    stroke-width="1.5" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                  />
                </svg>
              </a-button>
              <div class="slide-number">{{ String(index + 2).padStart(2, '0') }}</div>
              <div class="card-content">
                <input 
                  v-model="section.title"
                  :placeholder="t('slide.outline.sectionPlaceholder')"
                  class="card-title-input"
                  :disabled="isStreaming"
                  @click.stop
                  @blur="updateOutlineText"
                />
                <!-- Children List -->
                <div v-if="!section.collapsed && section.children && section.children.length > 0" class="card-children">
                  <div 
                    v-for="(child, childIndex) in section.children" 
                    :key="childIndex"
                    class="card-child-item"
                  >
                    <div class="card-child-content">
                      <input 
                        v-if="child.subtitle"
                        v-model="child.subtitle"
                        :placeholder="t('slide.outline.sectionPlaceholder')"
                        class="card-child-title-input"
                        :disabled="isStreaming"
                        @click.stop
                        @blur="updateOutlineText"
                      />
                      <textarea 
                        v-model="child.text"
                        :placeholder="t('slide.outline.childPlaceholder')"
                        class="card-child-text-input"
                        :disabled="isStreaming"
                        @click.stop
                        @blur="updateOutlineText"
                        rows="2"
                      ></textarea>
                    </div>
                    <a-button 
                      v-if="!isStreaming"
                      type="text" 
                      size="mini" 
                      class="card-child-delete-btn"
                      @click.stop="deleteChild(index, childIndex)"
                    >
                      <Icon name="delete" :size="14" />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Quick Actions on Hover -->
            <div class="quick-actions" v-if="!isStreaming">
              <a-button type="text" size="mini" class="quick-action-btn magic" @click.stop="handleOptimizeSection(index)">
                <Icon name="magic-wand" :size="14" />
              </a-button>
              <a-button type="text" size="mini" class="quick-action-btn" @click.stop="addChild(index)">
                <Icon name="plus" :size="14" />
              </a-button>
              <a-button type="text" size="mini" class="quick-action-btn" @click.stop="deleteSection(index)">
                <Icon name="delete" :size="14" />
              </a-button>
            </div>
          </div>

          <!-- Add New Slide Button -->
          <div class="add-slide-area">
            <a-button type="text" class="add-slide-btn" :disabled="isStreaming" @click="addSection">
              <Icon name="plus-circle" :size="16" />
              <span>{{ isStreaming ? t('slide.outline.generatingContent') : t('slide.outline.addSlidePrompt') }}</span>
            </a-button>
          </div>
        </div>
      </div>

      <!-- Right: AI Assistant (1/3) -->
      <div class="editor-right">
        <!-- AI Header -->
        <div class="ai-header">
          <div class="ai-header-left">
            <Icon name="magic-wand" :size="24" class="ai-icon" />
            <span class="ai-title">{{ t('slide.outline.aiAssistant') }}</span>
          </div>
          <span class="ai-badge">{{ t('slide.outline.poweredBy') }}</span>
        </div>

        <!-- AI Conversation Area -->
        <div class="ai-conversation">
          <div class="ai-message ai-message-bot">
            <div class="ai-message-content">
              {{ t('slide.outline.aiWelcome', { count: outlineSections.length }) }}
            </div>
          </div>

          <!-- Suggested Actions -->
          <div class="ai-suggestions">
            <p class="ai-suggestions-title">{{ t('slide.outline.aiSuggestionsTitle') }}</p>
            <div class="ai-suggestion-buttons">
              <button class="ai-suggestion-btn" @click="handleAIAction('expand')">
                <span>{{ t('slide.outline.aiSuggestion1') }}</span>
              </button>
              <button class="ai-suggestion-btn" @click="handleAIAction('compare')">
                <span>{{ t('slide.outline.aiSuggestion2') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- AI Input Area -->
        <div class="ai-input-area">
          <!-- AI Options -->
          <div class="ai-options">
            <label class="ai-option">
              <input type="checkbox" v-model="aiDeepThink" />
              <span>{{ t('slide.outline.aiDeepThink') }}</span>
            </label>
            <label class="ai-option">
              <input type="checkbox" v-model="aiWebSearch" />
              <span>{{ t('slide.outline.aiWebSearch') }}</span>
            </label>
          </div>

          <!-- Input Box -->
          <div class="ai-input-box">
            <a-textarea 
              v-model="aiPrompt"
              :placeholder="t('slide.outline.aiInputPlaceholder')"
              :auto-size="{ minRows: 3, maxRows: 6 }"
              class="ai-textarea"
              :bordered="false"
            />
            <div class="ai-input-footer">
              <div class="ai-input-actions">
                <a-button type="text" size="small" class="ai-action-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 7.333L8.167 13.167a3.334 3.334 0 01-4.714-4.715L9.286 2.62a2 2 0 012.829 2.828L6.281 11.281a.667.667 0 11-.943-.942l5.334-5.334" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a-button>
                <a-button type="text" size="small" class="ai-action-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="2.667" width="4" height="6.666" rx="2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 7.333v1.334a4 4 0 11-8 0V7.333M8 12.667V14.667M5.333 14.667h5.334" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a-button>
              </div>
              <a-button type="primary" class="ai-send-btn" @click="handleAISend">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.667 1.333L7.333 8.667M14.667 1.333L10 14.667l-2.667-6L1.333 6l13.334-4.667z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a-button>
            </div>
          </div>

          <!-- Disclaimer -->
          <p class="ai-disclaimer">{{ t('slide.outline.aiDisclaimer', { date: currentDate }) }}</p>
        </div>
      </div>
    </div>

    <!-- Sync Status Indicator (like WPS) -->
    <div class="sync-status-indicator">
      <span class="sync-pulse"></span>
      <span class="sync-text">云端大纲已同步</span>
    </div>

    <!-- Streaming Progress Indicator (Below Outline) -->
    <div v-if="isStreaming" class="streaming-indicator">
      <div class="streaming-indicator-content">
        <div class="streaming-indicator-icon">
          <svg class="spinning-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="9.42 31.42" />
          </svg>
        </div>
        <div class="streaming-indicator-text">
          <span class="streaming-indicator-label">正在生成内容，请稍候...</span>
          <span class="streaming-indicator-progress">{{ streamingProgress }}%</span>
        </div>
        <div class="streaming-progress-bar-wrapper">
          <div class="streaming-progress-bar-track">
            <div class="streaming-progress-bar-fill" :style="{ width: streamingProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Input as AInput, Textarea as ATextarea, Button as AButton } from '@arco-design/web-vue'
import IIcon from '@/utils/slide/icon.js'

const Icon = IIcon
const { t } = useI18n()

const props = defineProps({
  initialOutline: {
    type: String,
    required: true
  },
  initialTitle: {
    type: String,
    required: true
  },
  isGenerating: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel', 'regenerate', 'optimize', 'back'])

// State
const editableTitle = ref(props.initialTitle)
const isRegenerating = ref(false)
const isOptimizing = ref(false)
const activeSectionIndex = ref(-1) // -1 = cover, 0+ = sections
const aiPrompt = ref('')
const aiDeepThink = ref(true)
const aiWebSearch = ref(true)

// Streaming state
const isStreaming = ref(false)
const streamingProgress = ref(0)

// Drag and drop state
const draggedIndex = ref(null)
const dragOverIndex = ref(null)

// Get current date
const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
})

// Parse markdown outline into tree structure with rich content
const parseOutlineToTree = (markdownText) => {
  const lines = markdownText.split('\n').filter(line => line.trim())
  const sections = []
  let currentSection = null

  lines.forEach(line => {
    // Match first-level heading (## Title)
    const h2Match = line.match(/^##\s+(.+)$/)
    if (h2Match) {
      currentSection = {
        title: h2Match[1].trim(),
        level: 2,
        children: [],
        collapsed: false
      }
      sections.push(currentSection)
      return
    }

    // Match third-level heading (### Subtitle) as child with subtitle
    const h3Match = line.match(/^###\s+(.+)$/)
    if (h3Match && currentSection) {
      currentSection.children.push({
        subtitle: h3Match[1].trim(),
        text: ''
      })
      return
    }

    // Match bullet points (- Text) as simple children
    const bulletMatch = line.match(/^[-*]\s+(.+)$/)
    if (bulletMatch && currentSection) {
      const lastChild = currentSection.children[currentSection.children.length - 1]
      // If last child has subtitle but no text, add to it
      if (lastChild && lastChild.subtitle && !lastChild.text) {
        lastChild.text = bulletMatch[1].trim()
      } else {
        // Otherwise create new simple child
        currentSection.children.push({
          text: bulletMatch[1].trim()
        })
      }
    }
  })

  return sections
}

// Convert tree back to markdown
const treeToMarkdown = () => {
  let markdown = `# ${editableTitle.value}\n\n`
  
  outlineSections.value.forEach(section => {
    markdown += `## ${section.title}\n`
    if (section.children && section.children.length > 0) {
      section.children.forEach(child => {
        markdown += `- ${child.text}\n`
      })
    }
    markdown += '\n'
  })
  
  return markdown.trim()
}

const outlineSections = ref(parseOutlineToTree(props.initialOutline))

// Watch for prop changes
watch(() => props.initialOutline, (newOutline) => {
  if (newOutline) {
    outlineSections.value = parseOutlineToTree(newOutline)
  }
})

watch(() => props.initialTitle, (newTitle) => {
  if (newTitle) {
    editableTitle.value = newTitle
  }
})

// Computed
const totalPages = computed(() => {
  return outlineSections.value.length + 1 // +1 for cover
})

const charCount = computed(() => {
  const markdown = treeToMarkdown()
  return markdown.length
})

// Methods
const toggleSection = (index) => {
  outlineSections.value[index].collapsed = !outlineSections.value[index].collapsed
}

const addSection = () => {
  outlineSections.value.push({
    title: t('slide.outline.newSection'),
    level: 2,
    children: [],
    collapsed: false
  })
}

const deleteSection = (index) => {
  outlineSections.value.splice(index, 1)
  updateOutlineText()
}

const addChild = (sectionIndex) => {
  if (!outlineSections.value[sectionIndex].children) {
    outlineSections.value[sectionIndex].children = []
  }
  outlineSections.value[sectionIndex].children.push({
    text: ''
  })
}

const deleteChild = (sectionIndex, childIndex) => {
  outlineSections.value[sectionIndex].children.splice(childIndex, 1)
  updateOutlineText()
}

const updateOutlineText = () => {
  // Auto-save: convert tree to markdown
  // This is called on blur to sync changes
}

const getSectionIcon = (level) => {
  if (level === 2) return 'menu'
  if (level === 3) return 'list'
  return 'file'
}

const getSectionLabel = (level) => {
  if (level === 2) return t('slide.outline.chapter')
  if (level === 3) return t('slide.outline.section')
  return ''
}

const handleConfirm = () => {
  const finalMarkdown = treeToMarkdown()
  emit('confirm', {
    outline: finalMarkdown,
    title: editableTitle.value,
    // 标记需要选择模板
    needsTemplate: true
  })
}

const handleBack = () => {
  emit('cancel')
}

const handleCancel = () => {
  emit('cancel')
}

const handleCollectDoc = () => {
  // TODO: Implement collect document feature
  console.log('Collect document clicked')
}

const handleRegenerate = async () => {
  isRegenerating.value = true
  try {
    emit('regenerate')
  } finally {
    setTimeout(() => {
      isRegenerating.value = false
    }, 1000)
  }
}

const handleOptimize = async () => {
  isOptimizing.value = true
  try {
    emit('optimize')
  } finally {
    setTimeout(() => {
      isOptimizing.value = false
    }, 1000)
  }
}

const handleExpand = () => {
  // TODO: AI expand content
  console.log('Expand content clicked')
}

const handleSkipEdit = () => {
  // Skip editing and generate PPT directly
  handleConfirm()
}

const setActiveSection = (index) => {
  activeSectionIndex.value = index
}

const handleOptimizeSection = (index) => {
  console.log('Optimize section:', index)
  // TODO: Implement section-specific optimization
}

const handleAIAction = (action) => {
  console.log('AI Action:', action)
  // TODO: Implement AI actions
}

const handleAISend = () => {
  if (!aiPrompt.value.trim()) return
  console.log('AI Prompt:', aiPrompt.value)
  // TODO: Send to AI
  aiPrompt.value = ''
}

// Drag and drop handlers
const handleDragStart = (index, event) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/html', event.target.innerHTML)
}

const handleDragOver = (index, event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  dragOverIndex.value = index
}

const handleDrop = (index, event) => {
  event.preventDefault()
  if (draggedIndex.value === null || draggedIndex.value === index) {
    return
  }
  
  // Reorder sections
  const sections = [...outlineSections.value]
  const draggedSection = sections[draggedIndex.value]
  sections.splice(draggedIndex.value, 1)
  sections.splice(index, 0, draggedSection)
  outlineSections.value = sections
  
  updateOutlineText()
}

const handleDragEnd = () => {
  draggedIndex.value = null
  dragOverIndex.value = null
}

// Streaming control methods
const startStreaming = () => {
  isStreaming.value = true
  streamingProgress.value = 0
}

const updateStreamingProgress = (progress) => {
  streamingProgress.value = Math.min(Math.max(progress, 0), 100)
}

const stopStreaming = () => {
  isStreaming.value = false
  streamingProgress.value = 0
}

// Expose methods for parent component
defineExpose({
  startStreaming,
  updateStreamingProgress,
  stopStreaming
})
</script>

<style scoped>
/* Generate PPT Button - Capsule Style */
.generate-ppt-button {
  border-radius: 100px !important;
  padding: 10px 28px !important;
  height: 44px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3) !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.generate-ppt-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #0958d9 0%, #003eb3 100%) !important;
  box-shadow: 0 6px 16px rgba(22, 119, 255, 0.4) !important;
  transform: translateY(-2px) !important;
}

.generate-ppt-button:active:not(:disabled) {
  transform: translateY(0) !important;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3) !important;
}

.play-icon {
  width: 12px;
  height: 14px;
  flex-shrink: 0;
}

/* Container */
.outline-editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

/* Header */
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  height: 56px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Main Content: Split Layout (2/3 + 1/3) */
.editor-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Editor (2/3) */
.editor-left {
  flex: 2;
  background: #F9FAFB;
  overflow-y: auto;
  padding: 48px;
}

.outline-tree-container {
  max-width: 960px;
  margin: 0 auto;
}

/* Outline Card */
.outline-card {
  position: relative;
  background: white;
  border: 1px solid #E8E8E8;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  transition: all 0.2s;
  cursor: move;
}

.outline-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.outline-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.outline-card:hover .quick-actions {
  opacity: 1;
}

.outline-card.active-outline {
  border: 1px solid oklch(62.029% 0.20399 266.39) !important;
  box-shadow: 0 0 0 2px rgba(3, 3, 99, 0.1);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  min-width: 16px;
  padding-top: 4px;
  color: #BFBFBF;
  cursor: grab;
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.outline-card:hover .drag-handle {
  opacity: 1;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle:hover {
  color: #8C8C8C;
}

.collapse-icon {
  padding: 0;
  width: 24px;
  height: 24px;
  min-width: 24px;
  color: #8C8C8C;
  flex-shrink: 0;
}

.slide-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 24px;
  font-size: 12px;
  font-weight: 700;
  color: #8C8C8C;
  flex-shrink: 0;
}

.active-outline .slide-number {
  color: #0f13e9;
}

.card-content {
  flex: 1;
}

/* Card Title - Editable */
.card-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.card-title-label {
  font-size: 16px;
  font-weight: 700;
  color: #262626;
  white-space: nowrap;
}

.card-title-input {
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  color: #262626;
  line-height: 1.5;
  border: none;
  background: transparent;
  outline: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  cursor: text;
}

.card-title-input:hover {
  background: #F5F5F5;
}

.card-title-input:focus {
  background: white;
  box-shadow: 0 0 0 2px #E0E7FF;
}

.card-title-input::placeholder {
  color: #BFBFBF;
  font-weight: 400;
}

.card-title-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: #FAFAFA !important;
}

.card-subtitle {
  font-size: 13px;
  color: #8C8C8C;
  margin: 0;
}

/* Card Children - Editable */
.card-children {
  margin-top: 16px;
  padding-left: 8px;
  border-left: 2px solid #F0F0F0;
}

.card-child-item {
  background: #F9FAFB;
  border: 1px solid #E8E8E8;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.card-child-item:hover {
  background: #F5F5F5;
  border-color: #D9D9D9;
}

.card-child-item:last-child {
  margin-bottom: 0;
}

.card-child-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-child-delete-btn {
  padding: 4px;
  min-width: 24px;
  height: 24px;
  color: #8C8C8C;
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
  margin-top: 4px;
}

.card-child-item:hover .card-child-delete-btn {
  opacity: 1;
}

.card-child-delete-btn:hover {
  background: #FFF1F0;
  color: #FF4D4F;
}

.card-child-title-input {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
  border: none;
  background: transparent;
  outline: none;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.2s;
  cursor: text;
}

.card-child-title-input:hover {
  background: rgba(255, 255, 255, 0.6);
}

.card-child-title-input:focus {
  background: white;
  box-shadow: 0 0 0 2px #E0E7FF;
}

.card-child-text-input {
  font-size: 13px;
  color: #595959;
  line-height: 1.7;
  border: none;
  background: transparent;
  outline: none;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.2s;
  resize: vertical;
  min-height: 40px;
  font-family: inherit;
  cursor: text;
}

.card-child-text-input:hover {
  background: rgba(255, 255, 255, 0.6);
}

.card-child-text-input:focus {
  background: white;
  box-shadow: 0 0 0 2px #E0E7FF;
}

.card-child-text-input::placeholder,
.card-child-title-input::placeholder {
  color: #BFBFBF;
}

.card-child-title-input:disabled,
.card-child-text-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: #F5F5F5 !important;
}

/* Quick Actions */
.quick-actions {
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.quick-action-btn {
  padding: 6px;
  min-width: 28px;
  height: 28px;
  border-radius: 4px;
  color: #8C8C8C;
  background: transparent;
}

.quick-action-btn:hover {
  background: #F5F5F5;
  color: #262626;
}

.quick-action-btn.magic {
  color: #1677ff;
}

.quick-action-btn.magic:hover {
  background: #e6f4ff;
}

/* Add Slide Area */
.add-slide-area {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

.add-slide-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 64px;
  border: 1px dashed #E8E8E8;
  border-radius: 8px;
  color: #8C8C8C;
  font-size: 13px;
  transition: all 0.2s;
}

.add-slide-btn:hover {
  border-color: #1207e8;
  color: #2236e5;
}

.add-slide-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  border-color: #E8E8E8 !important;
  color: #BFBFBF !important;
}

/* Right Panel (1/3) */
.editor-right {
  flex: 1;
  background: white;
  border-left: 1px solid #E8E8E8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* AI Header */
.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #E8E8E8;
}

.ai-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-icon {
  color: #1677ff;
}

.ai-title {
  font-size: 15px;
  font-weight: 700;
  color: #262626;
}

.ai-badge {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #e6f4ff;
  color: #1677ff;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #91caff;
}

/* AI Conversation */
.ai-conversation {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.ai-message {
  margin-bottom: 24px;
}

.ai-message-content {
  background: #F9FAFB;
  border: 1px solid #E8E8E8;
  border-radius: 12px;
  border-top-left-radius: 0;
  padding: 16px;
  font-size: 13px;
  color: #262626;
  line-height: 1.6;
}

/* AI Suggestions */
.ai-suggestions {
  margin-top: 12px;
}

.ai-suggestions-title {
  font-size: 12px;
  font-weight: 600;
  color: #8C8C8C;
  margin: 0 0 12px 0;
}

.ai-suggestion-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-suggestion-btn {
  width: 100%;
  text-align: left;
  padding: 12px;
  border: 1px solid #E8E8E8;
  border-radius: 8px;
  background: white;
  color: #8C8C8C;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-suggestion-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}

/* AI Input Area */
.ai-input-area {
  padding: 24px;
  border-top: 1px solid #E8E8E8;
}

.ai-options {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
}

.ai-option {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8C8C8C;
  cursor: pointer;
  transition: color 0.2s;
}

.ai-option:hover {
  color: #1677ff;
}

.ai-option input[type="checkbox"] {
  accent-color: #1677ff;
  cursor: pointer;
}

.ai-input-box {
  background: #FAFAFA;
  border: 1.5px solid #E8E8E8;
  border-radius: 12px;
  padding: 12px;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.ai-input-box:focus-within {
  background: white;
  border-color: #1677ff;
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.08);
}

.ai-textarea :deep(.arco-textarea) {
  font-size: 13px;
  line-height: 1.6;
  min-height: 72px;
  resize: none;
}

.ai-input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.ai-input-actions {
  display: flex;
  gap: 8px;
}

.ai-action-btn {
  padding: 8px;
  min-width: 32px;
  height: 32px;
  color: #8C8C8C;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-action-btn:hover {
  background: #F5F7FA;
  color: #1677ff;
}

.ai-action-btn svg {
  display: block;
}

.ai-send-btn {
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
  padding: 8px 12px;
  min-width: 40px;
  height: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.25);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.ai-send-btn:hover {
  background: linear-gradient(135deg, #0958d9 0%, #003eb3 100%);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.35);
  transform: translateY(-1px);
}

.ai-send-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(22, 119, 255, 0.3);
}

.ai-send-btn svg {
  color: white;
  display: block;
}

.ai-disclaimer {
  font-size: 10px;
  color: #BFBFBF;
  text-align: center;
  margin: 12px 0 0 0;
  line-height: 1.5;
}

/* Footer */
.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: white;
  border-top: 1px solid #e5e7eb;
  height: 48px;
}

.stats-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.stats-right {
  display: flex;
  align-items: center;
}

.auto-save-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #10b981;
}

/* Scrollbar Styling */
.editor-left::-webkit-scrollbar,
.editor-right::-webkit-scrollbar,
.ai-conversation::-webkit-scrollbar {
  width: 4px;
}

.editor-left::-webkit-scrollbar-track,
.editor-right::-webkit-scrollbar-track,
.ai-conversation::-webkit-scrollbar-track {
  background: transparent;
}

.editor-left::-webkit-scrollbar-thumb,
.editor-right::-webkit-scrollbar-thumb,
.ai-conversation::-webkit-scrollbar-thumb {
  background: #E8E8E8;
  border-radius: 10px;
}

.editor-left::-webkit-scrollbar-thumb:hover,
.editor-right::-webkit-scrollbar-thumb:hover,
.ai-conversation::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}

/* Sync Status Indicator */
.sync-status-indicator {
  position: fixed;
  bottom: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #E8E8E8;
  font-size: 10px;
  z-index: 100;
}

.sync-pulse {
  position: relative;
  display: flex;
  width: 8px;
  height: 8px;
}

.sync-pulse::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #52C41A;
  animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

.sync-pulse::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #52C41A;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.sync-text {
  color: #8C8C8C;
}

/* Streaming Progress Indicator (Below Outline) */
.streaming-indicator {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.streaming-indicator-content {
  background: white;
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 400px;
}

.streaming-indicator-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #F5F7FA;
  border-radius: 50%;
  flex-shrink: 0;
}

.spinning-icon {
  color: #1677ff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.streaming-indicator-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.streaming-indicator-label {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  line-height: 1.4;
}

.streaming-indicator-progress {
  font-size: 12px;
  font-weight: 600;
  color: #1677ff;
  font-variant-numeric: tabular-nums;
}

.streaming-progress-bar-wrapper {
  width: 120px;
  flex-shrink: 0;
}

.streaming-progress-bar-track {
  height: 6px;
  background: #F0F0F0;
  border-radius: 3px;
  overflow: hidden;
}

.streaming-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1677ff 0%, #4096ff 100%);
  border-radius: 3px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.streaming-progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
