<template>
  <div class="chat-panel">
    <div class="chat-panel-header">
      <div class="header-left">
        <h3>{{ t('slide.agentDialog') }}</h3>
        <span v-if="chatMessages.length > 0" class="conversation-count">
          {{ conversationExchanges }}/20 轮
        </span>
      </div>
      <div class="header-actions">
        <a-button 
          v-if="chatMessages.length > 0" 
          size="mini" 
          type="outline"
          @click="handleNewSession"
        >
          <template #icon><icon-plus /></template>
          新建会话
        </a-button>
        <a-button size="mini" type="text" @click="closePanel">
          <icon-close />
        </a-button>
      </div>
    </div>
    
    <!-- Quick Prompts Section -->
    <div v-if="chatMessages.length === 0" class="quick-prompts-section">
      <div class="welcome-message">
        <div class="welcome-icon">
          <Icon name="spark" :size="32" :style="{ color: '#165DFF' }" />
        </div>
        <p class="welcome-text">{{ t('slide.agentPlaceholder') }}</p>
      </div>
      <div class="quick-prompts">
        <button 
          v-for="(prompt, key) in quickPrompts" 
          :key="key"
          class="quick-prompt-btn"
          @click="handleQuickPrompt(prompt)"
        >
          <Icon name="spark" :size="16" :style="{ color: '#165DFF' }" />
          {{ t(`slide.quickPrompts.${key}`) }}
        </button>
      </div>
    </div>
    
    <div class="chat-messages" ref="chatMessagesRef">
      <div 
        v-for="(msg, index) in chatMessages" 
        :key="index" 
        :class="`message ${msg.sender}`"
      >
        <!-- Thinking indicator -->
        <div v-if="msg.isThinking" class="thinking-indicator">
          <div class="thinking-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="thinking-text">{{ t('slide.aiThinking') || 'AI is thinking...' }}</span>
        </div>
        
        <!-- Message content -->
        <div v-else class="message-content">
          <!-- User messages: plain text -->
          <template v-if="msg.sender === 'user'">
            {{ msg.content }}
          </template>
          <!-- AI messages: formatted HTML -->
          <template v-else>
            <div v-html="formatMessageContent(msg.content, msg.sender)"></div>
            
            <!-- Action buttons for AI suggestions -->
            <div v-if="msg.action" class="message-actions">
              <!-- For text optimization: Always show apply button -->
              <template v-if="msg.action === 'replace-text'">
                <!-- Show layout button if there's a recommendation -->
                <a-button 
                  v-if="msg.actionPayload?.recommendedLayout"
                  size="mini" 
                  type="primary"
                  @click="applyToSlide(msg, true)"
                >
                  <template #icon><icon-layout /></template>
                  应用智能布局
                </a-button>
                
                <!-- Always show direct apply button for text optimization -->
                <a-button 
                  v-else
                  size="mini" 
                  type="primary"
                  @click="applyToSlide(msg, false)"
                >
                  <template #icon><icon-check /></template>
                  直接应用
                </a-button>
              </template>
              
              <!-- For other actions (images, charts): Show standard apply button -->
              <template v-else>
                <a-button 
                  size="mini" 
                  type="primary"
                  @click="applyToSlide(msg, false)"
                >
                  <template #icon><icon-check /></template>
                  应用到幻灯片
                </a-button>
              </template>
            </div>
          </template>
        </div>
        
        <div class="message-time">{{ formatDate(msg.timestamp) }}</div>
      </div>
    </div>
    <div class="chat-input-area">
      <a-textarea
        v-model="chatInput"
        :placeholder="t('slide.agentPlaceholder')"
        :auto-size="{ minRows: 1, maxRows: 4 }"
        @keydown.enter.exact="handleSendChatMessage"
        @keydown.enter.meta.prevent="handleSendChatMessage"
        @keydown.enter.ctrl.prevent="handleSendChatMessage"
      />
      <a-button 
        type="primary"
        shape="circle"
        @click="handleSendChatMessage"
        :disabled="!chatInput.trim() || isProcessingChat"
        :loading="isProcessingChat"
        class="send-button"
      >
        <template #icon>
          <icon-send v-if="!isProcessingChat" />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { IconSend, IconClose, IconCheck, IconEye, IconLayout, IconPlus } from '@arco-design/web-vue/es/icon'
import IIcon from '@/utils/slide/icon.js'
import { agentOrchestrator, skillRegistry, contextManager } from '../../agents/index'  // Use public API
import * as echarts from 'echarts'

const { t } = useI18n()
const Icon = IIcon

// Use the singleton agent instance from public API
const agent = agentOrchestrator

// Props for slide context
const props = defineProps({
  currentSlideIndex: {
    type: Number,
    required: true
  },
  parsedSlides: {
    type: Array,
    required: true
  },
  currentVisualData: {
    type: Object,
    required: true
  },
  currentThemeStyle: {
    type: Object,
    required: true
  }
})

// Emit events for parent component
const emit = defineEmits(['send-message', 'close', 'preview-changes'])

// State variables
const chatMessages = ref([])
const chatInput = ref('')
const isProcessingChat = ref(false)
const chatMessagesRef = ref(null)
const conversationExchanges = ref(0)  // Track conversation exchanges

// Load conversation history from storage on mount
contextManager.loadFromStorage()

// Initialize chat messages from loaded history
if (contextManager.getFormattedHistory().length > 0) {
  chatMessages.value = contextManager.getFormattedHistory().map(msg => ({
    sender: msg.role === 'user' ? 'user' : 'ai',
    content: msg.content,
    timestamp: Date.now()
  }))
  conversationExchanges.value = Math.floor(chatMessages.value.length / 2)
}

// Quick prompts data - aligned with Skills
const quickPrompts = {
  optimizeLayout: '优化当前幻灯片的布局，让它看起来更专业',
  addChart: '根据当前内容添加一个适合的专业图表',
  improveContent: '改进当前幻灯片的内容表达，使其更清晰有力',
  addImage: '生成一张科技感的背景图'
}

// Handle quick prompt click
const handleQuickPrompt = (promptText) => {
  chatInput.value = promptText
  handleSendChatMessage()
}

// Handle new session
const handleNewSession = () => {
  Message.info({
    content: '确定要新建会话吗？当前对话将被清空。',
    duration: 3000,
    closable: true,
    onClose: () => {
      // User confirmed, start new session
      contextManager.startNewSession()
      chatMessages.value = []
      conversationExchanges.value = 0
      Message.success('已开始新会话')
    }
  })
}

// Format date for message timestamps
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Format message content with basic markdown rendering
const formatMessageContent = (content, sender) => {
  if (sender === 'user') {
    // User messages: plain text, no formatting
    return content || ''
  }
  
  // AI messages: apply simple markdown formatting
  let formatted = content
  
  // Detect code blocks (XML, JSON, etc.) and add visual indicator
  if (formatted.includes('xml') || formatted.includes('<?xml') || formatted.includes('<chart')) {
    formatted = '<div class="code-block-header">📊 图表代码（点击"应用到幻灯片"查看效果）</div>' + formatted
  }
  
  // Bold: **text** or __text__
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  formatted = formatted.replace(/__([^_]+)__/g, '<strong>$1</strong>')
  
  // Code: `code`
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // Headings: ## Heading
  formatted = formatted.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  
  // Lists: - item or 1. item
  // Convert bullet lists
  formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>')
  // Wrap consecutive <li> in <ul>
  formatted = formatted.replace(/(<li>.*<\/li>\n?)+/gs, '<ul>$&</ul>')
  
  // Convert numbered lists  
  formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
  
  // Line breaks
  formatted = formatted.replace(/\n/g, '<br>')
  
  return formatted
}

// Send chat message
const handleSendChatMessage = async () => {
  if (!chatInput.value.trim() || isProcessingChat.value) return
  
  // Check if limit reached
  if (contextManager.isConversationLimitReached()) {
    Message.error('对话轮数已达上限（20轮），请点击“新建会话”开始全新对话。')
    return
  }
  
  const userInput = chatInput.value
  
  // Add user message to UI
  const userMessage = {
    sender: 'user',
    content: userInput,
    timestamp: Date.now()
  }
  chatMessages.value.push(userMessage)
  
  // Track message in context manager
  const addResult = contextManager.addMessage({
    role: 'user',
    content: userInput,
    timestamp: Date.now(),
    slideIndex: props.currentSlideIndex
  })
  
  // Update conversation exchanges count
  conversationExchanges.value = Math.floor(chatMessages.value.filter(m => m.sender === 'user').length)
  
  // Show warning if approaching limit
  if (addResult.warning) {
    Message.warning(addResult.warning)
  }
  
  // Add "thinking" placeholder message
  const thinkingMessage = {
    sender: 'ai',
    content: '',
    timestamp: Date.now(),
    isThinking: true
  }
  chatMessages.value.push(thinkingMessage)
  
  chatInput.value = ''
  isProcessingChat.value = true
  
  try {
    // Process the chat command
    await processChatCommand(userInput)
  } catch (error) {
    console.error('Chat error:', error)
    // Remove thinking message and add error message
    chatMessages.value.pop()
    chatMessages.value.push({
      sender: 'ai',
      content: 'Sorry, I encountered an error processing your request.',
      timestamp: Date.now()
    })
  } finally {
    isProcessingChat.value = false
  }
}

// Process chat command with Agent Skills
const processChatCommand = async (userInput) => {
  // Analyze the current slide context
  const currentSlideContext = getCurrentSlideContext()
  
  // Build conversation history for context (last 5 messages)
  const conversationHistory = chatMessages.value
    .slice(-6) // Last 3 exchanges (6 messages: user + AI)
    .filter(msg => !msg.isThinking)
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))
  
  // Get reference to the thinking message (last message)
  const thinkingMessageIndex = chatMessages.value.length - 1
  
  try {
    console.log('[ChatPanel] Processing with Agent:', userInput)
    console.log('[ChatPanel] Conversation history:', conversationHistory.length, 'messages')
    
    // Use Agent Orchestrator to handle request WITH CONVERSATION HISTORY
    const result = await agent.handleUserRequest(userInput, {
      slideContent: currentSlideContext.slideContent,
      visualData: currentSlideContext.visualComponents,
      slideSize: { width: 1920, height: 1080 },
      conversationHistory: conversationHistory // NEW: Pass conversation context
    })
    
    console.log('[ChatPanel] Agent result:', result)
    
    if (result.success) {
      // Update thinking message with success response
      let responseContent = '✅ '
      
      if (result.actions && result.actions.length > 0) {
        const action = result.actions[0]
        
        switch (action.type) {
          case 'replace-text':
            // 显示优化后的内容预览（限制长度）
            const previewText = action.payload.newText
            const maxPreviewLength = 300
            if (previewText.length > maxPreviewLength) {
              responseContent += `已优化文案！

${previewText.substring(0, maxPreviewLength)}...`
            } else {
              responseContent += `已优化文案！

${previewText}`
            }
            
            // 如果有布局推荐，显示提示
            if (action.payload.recommendedLayout) {
              const layoutNames = {
                'bullets-single': '单列项目列表',
                'boxes-grid': '网格分组布局',
                'boxes-with-bullets': '分组项目布局'
              }
              const layoutName = layoutNames[action.payload.recommendedLayout] || '智能布局'
              responseContent += `

💡 建议使用「${layoutName}」以获得更好的视觉效果。`
            }
            break
          case 'add-image':
            responseContent += `已生成图片！点击"应用到幻灯片"查看效果。\n\n`
            // Store image URL for display
            if (action.payload.src) {
              console.log('[ChatPanel] Adding image to message:', action.payload.src)
              responseContent += `<img src="${action.payload.src}" alt="AI Generated" style="max-width: 100%; border-radius: 8px; margin-top: 8px;" />`
            } else {
              console.warn('[ChatPanel] No src in image payload:', action.payload)
            }
            break
          case 'add-chart':
            responseContent += `已生成图表！点击"应用到幻灯片"添加到页面。\n\n`
            // Display chart preview
            if (action.payload.echartOption) {
              console.log('[ChatPanel] Adding chart preview to message')
              // Create a placeholder for chart preview
              const chartId = `chart-preview-${Date.now()}`
              responseContent += `<div class="chart-preview-container" data-chart-id="${chartId}" data-chart-option='${JSON.stringify(action.payload.echartOption).replace(/'/g, "&apos;")}'></div>`
            } else {
              console.warn('[ChatPanel] No echartOption in chart payload:', action.payload)
            }
            break
          case 'update-layout':
            responseContent += `已优化布局！共调整 ${action.payload.layout?.length || 0} 个元素。`
            if (result.data?.strategy) {
              responseContent += `\n\n策略：${result.data.strategy}`
            }
            break
          default:
            responseContent += '操作已完成！'
        }
      } else {
        responseContent += result.data?.message || '操作已完成！'
      }
      
      chatMessages.value[thinkingMessageIndex] = {
        sender: 'ai',
        content: responseContent,
        timestamp: Date.now(),
        isThinking: false,
        action: result.actions?.[0]?.type,
        actionPayload: result.actions?.[0]?.payload
      }
      
      // Track AI response in context manager
      contextManager.addMessage({
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
        slideIndex: props.currentSlideIndex
      })
      
      // Update conversation exchanges count
      conversationExchanges.value = Math.floor(chatMessages.value.filter(m => m.sender === 'user').length)
      
      // DEBUG: Log the actual message object
      console.log('[ChatPanel] Message object in array:', chatMessages.value[thinkingMessageIndex])
      console.log('[ChatPanel] Has action?', !!chatMessages.value[thinkingMessageIndex].action)
      console.log('[ChatPanel] Action type:', chatMessages.value[thinkingMessageIndex].action)
      console.log('[ChatPanel] Has actionPayload?', !!chatMessages.value[thinkingMessageIndex].actionPayload)
      
      console.log('[ChatPanel] Updated message:', {
        action: result.actions?.[0]?.type,
        hasPayload: !!result.actions?.[0]?.payload,
        recommendedLayout: result.actions?.[0]?.payload?.recommendedLayout,
        contentLength: responseContent.length,
        contentPreview: responseContent.substring(0, 100)
      })
    } else {
      // Handle error
      chatMessages.value[thinkingMessageIndex] = {
        sender: 'ai',
        content: `❌ ${result.error || '处理失败，请重试'}`,
        timestamp: Date.now(),
        isThinking: false
      }
    }
  } catch (error) {
    console.error('[ChatPanel] Agent error:', error)
    chatMessages.value[thinkingMessageIndex] = {
      sender: 'ai',
      content: `❌ 处理出错：${error.message}`,
      timestamp: Date.now(),
      isThinking: false
    }
  }
}

// Get current slide context
const getCurrentSlideContext = () => {
  // Return information about the current slide for AI context
  return {
    slideIndex: props.currentSlideIndex,
    slideContent: props.parsedSlides[props.currentSlideIndex]?.raw || '',
    slideType: props.parsedSlides[props.currentSlideIndex]?.type || 'markdown',
    visualComponents: props.currentVisualData
  }
}

// Clean AI response content - remove think tags and excessive markdown
const cleanAIResponse = (content) => {
  if (!content) return ''
  
  let cleaned = content
  
  // 1. Remove <think>...</think> blocks completely
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '')
  
  // 2. Remove excessive markdown formatting
  // Remove multiple # symbols (keep single # for titles)
  cleaned = cleaned.replace(/#{3,}/g, '##')  // Replace ### or more with ##
  
  // 3. Clean up excessive asterisks for bold/italic
  // Replace *** with ** (remove triple asterisks)
  cleaned = cleaned.replace(/\*\*\*([^*]+)\*\*\*/g, '**$1**')
  
  // 4. Remove excessive backticks
  cleaned = cleaned.replace(/```([^`]+)```/g, '`$1`')
  
  // 5. Clean up excessive whitespace and newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
  cleaned = cleaned.trim()
  
  // 6. Remove leading/trailing markdown symbols if the entire response is wrapped
  if (cleaned.startsWith('**') && cleaned.endsWith('**')) {
    cleaned = cleaned.slice(2, -2).trim()
  }
  
  return cleaned
}

// Generate AI response with streaming effect (optimized for performance)
const generateAIResponseStreaming = async (userInput, context, messageIndex) => {
  const slideContent = context.slideContent || ''
  const visualComponents = context.visualComponents || {}
  
  // Build context-aware system prompt
  const systemPrompt = `You are an AI assistant helping with slide editing in JitSlide.
    
Current slide content:
${slideContent}

Available components: ${Object.keys(visualComponents).filter(key => visualComponents[key] && visualComponents[key].length > 0).join(', ') || 'none'}

Available decorative line components:
- simple-line: 简约蓝色线 (3px)
- thick-line: 粗紫色线 (8px)
- gradient-line: 渐变线 (蓝紫渐变)
- dotted-line: 灰色点线 (2px)
- dashed-line: 灰色虚线 (2px)

IMPORTANT OUTPUT FORMAT:
When making actionable suggestions, structure your response as:

**建议：**
(描述性建议...)

**执行命令：**
- 修改标题：“新标题文案”
- 修改副标题：“新副标题文案”
- 添加组件：thick-line
- 调整间距：30px
- 设置字号：标题=48px, 副标题=24px
- 设置颜色：标题=#1f2937, 副标题=#6b7280

OTHER RULES:
1. Provide concise, actionable responses ONLY
2. DO NOT include <think> tags or thinking process
3. DO NOT use excessive markdown formatting (###, ***, etc.)
4. Keep responses under 200 words
5. Use simple, clear language
6. If no changes needed, just provide suggestions without "执行命令" block

Respond directly with your recommendation.`

  let accumulatedContent = ''
  let action = null
  
  return new Promise((resolve, reject) => {
    streamGenerate(
      userInput,
      systemPrompt,
      {
        onDelta: (chunk) => {
          // Just accumulate content, don't update UI yet for better performance
          accumulatedContent += chunk
        },
        onDone: () => {
          // Final cleanup and single UI update
          const cleanedContent = cleanAIResponse(accumulatedContent)
          
          // Analyze response for actions
          if (cleanedContent.toLowerCase().includes('chart') || 
              cleanedContent.toLowerCase().includes('graph') ||
              cleanedContent.toLowerCase().includes('xml') ||
              cleanedContent.includes('<chart')) {
            action = 'add-chart'
          } else if (cleanedContent.toLowerCase().includes('layout') || cleanedContent.toLowerCase().includes('arrange')) {
            action = 'suggest-layout'
          } else if (cleanedContent.includes('执行命令') || 
                     cleanedContent.includes('修改标题') || 
                     cleanedContent.includes('修改副标题') ||
                     cleanedContent.includes('添加组件') ||
                     cleanedContent.includes('调整间距') ||
                     cleanedContent.includes('设置字号') ||
                     cleanedContent.includes('设置颜色') ||
                     cleanedContent.toLowerCase().includes('添加') || 
                     cleanedContent.toLowerCase().includes('优化')) {
            action = 'apply-suggestion'
          }
          
          // Update UI once with final result
          if (chatMessages.value[messageIndex]) {
            chatMessages.value[messageIndex] = {
              sender: 'ai',
              content: cleanedContent,
              timestamp: chatMessages.value[messageIndex].timestamp,
              isThinking: false,
              isStreaming: false,
              action: action  // Store action for button display
            }
          }
          
          // Execute action if needed
          if (action) {
            executeSlideModification(action, userInput)
          }
          
          resolve({ content: cleanedContent, action })
        },
        onError: (err) => {
          console.error('[ChatPanel] AI Error:', err)
          
          // Update message with error
          if (chatMessages.value[messageIndex]) {
            chatMessages.value[messageIndex] = {
              sender: 'ai',
              content: 'Sorry, I encountered an error processing your request.',
              timestamp: chatMessages.value[messageIndex].timestamp,
              isThinking: false,
              isStreaming: false
            }
          }
          
          reject(err)
        }
      },
      undefined, // controller
      {
        // Use MiniMax for chat - force override
        provider: 'minimax',
        model: 'minimax-m2.1-lightning',
      }
    )
  })
}

// Generate AI response (legacy, kept for reference)
const generateAIResponse = async (userInput, context) => {
  // Use MiniMax for real-time chat interactions
  return new Promise((resolve, reject) => {
    let aiContent = ''
    const slideContent = context.slideContent || ''
    const visualComponents = context.visualComponents || {}
    
    // Build context-aware system prompt
    const systemPrompt = `You are an AI assistant helping with slide editing in JitSlide.
    
Current slide content:
${slideContent}

Available components: ${Object.keys(visualComponents).filter(key => visualComponents[key] && visualComponents[key].length > 0).join(', ') || 'none'}

IMPORTANT RULES:
1. Provide concise, actionable responses ONLY
2. DO NOT include <think> tags or thinking process
3. DO NOT use excessive markdown formatting (###, ***, etc.)
4. Focus on practical slide improvements
5. Keep responses under 200 words
6. Use simple, clear language

Respond directly with your recommendation.`

    streamGenerate(
      userInput,
      systemPrompt,
      {
        onDelta: (chunk) => {
          aiContent += chunk
        },
        onDone: () => {
          // Clean the AI response before processing
          const cleanedContent = cleanAIResponse(aiContent)
          
          // Analyze response for actions
          let action = null
          if (cleanedContent.toLowerCase().includes('chart') || cleanedContent.toLowerCase().includes('graph')) {
            action = 'suggest-chart'
          } else if (cleanedContent.toLowerCase().includes('layout') || cleanedContent.toLowerCase().includes('arrange')) {
            action = 'suggest-layout'
          }
          
          resolve({
            content: cleanedContent,
            action
          })
        },
        onError: (err) => {
          console.error('[ChatPanel] AI Error:', err)
          reject(err)
        }
      },
      undefined, // controller
      {
        // Use MiniMax for chat - force override
        provider: 'minimax',
        model: 'minimax-m2.1-lightning',
      }
    )
  })
}

// Execute slide modification
const executeSlideModification = async (action, originalCommand) => {
  // Emit event to parent component to handle the action
  emit('send-message', {
    action,
    command: originalCommand,
    context: getCurrentSlideContext()
  })
}

// Natural language command processor
const processNaturalLanguageCommand = async (userInput, context) => {
  const lowerInput = userInput.toLowerCase().trim();
  
  // Command patterns with regex for more flexible matching
  const commands = [
    // Style/theme commands
    { pattern: /make (this|the) slide (more )?(professional|corporate|clean|minimalist|tech|modern)/, action: 'apply-professional-theme', handler: applyProfessionalTheme },
    { pattern: /make (this|the) slide (more )?(fun|colorful|playful|creative)/, action: 'apply-colorful-theme', handler: applyColorfulTheme },
    { pattern: /change (the )?background (to|color|to color) (.+)/, action: 'change-background', handler: (cmd) => changeBackground(cmd) },
    
    // Layout commands
    { pattern: /center (everything|all content|the content)/, action: 'center-content', handler: centerSlideContent },
    { pattern: /add (a |)(title|heading) (at|to) (the )?top/, action: 'add-title-top', handler: addTitleAtTop },
    { pattern: /move (the |)title (to|up|higher)/, action: 'move-title', handler: moveTitleUp },
    
    // Content commands
    { pattern: /make (the |)text (larger|bigger|increase size)/, action: 'increase-text-size', handler: increaseTextSize },
    { pattern: /make (the |)text (smaller|reduce size)/, action: 'decrease-text-size', handler: decreaseTextSize },
    { pattern: /highlight (the |)important (words|text|parts)/, action: 'highlight-important', handler: highlightImportantText },
    
    // Visualization commands
    { pattern: /turn (this|the) (data|numbers|metrics|information) into (a |)chart/, action: 'create-chart', handler: createChartFromData },
    { pattern: /show (this|the) (info|information|data) as (a |)graph/, action: 'create-graph', handler: createGraphFromData },
    { pattern: /add (an? |)image (of|showing|depicting) (.+)/, action: 'add-image', handler: (cmd) => addImageBasedOnDescription(cmd) },
    
    // Navigation commands
    { pattern: /go to (the |)next slide/, action: 'next-slide', handler: goToNextSlide },
    { pattern: /go to (the |)previous slide/, action: 'prev-slide', handler: goToPrevSlide },
    { pattern: /show me slide (\d+)/, action: 'goto-slide', handler: (cmd) => goToSpecificSlide(cmd) },
  ];
  
  // Check each command pattern
  for (const cmd of commands) {
    const match = lowerInput.match(cmd.pattern);
    if (match) {
      // Execute the command handler
      const result = await cmd.handler(userInput);
      return {
        processed: true,
        response: result || `I've processed your request: ${userInput}`,
        action: cmd.action
      };
    }
  }
  
  // If no specific command matched, return unprocessed
  return { processed: false };
};

// Helper functions for various commands
const applyProfessionalTheme = async (command) => {
  // Emit event to parent component to handle the action
  emit('send-message', {
    action: 'apply-theme',
    theme: 'default',
    message: 'I have applied a professional theme to your slide.'
  });
  return 'I have applied a professional theme to your slide.';
};

const applyColorfulTheme = async (command) => {
  // Emit event to parent component to handle the action
  emit('send-message', {
    action: 'apply-theme',
    theme: 'bee-happy',
    message: 'I have applied a colorful, playful theme to your slide.'
  });
  return 'I have applied a colorful, playful theme to your slide.';
};

const changeBackground = async (command) => {
  // Extract color from command
  const colorMatch = command.match(/to (?:a |)(.+)/i);
  const color = colorMatch ? colorMatch[1] : 'blue';
  
  // Emit event to parent component to handle the action
  emit('send-message', {
    action: 'change-background',
    color: color,
    message: `I would change the background to ${color}.`
  });
  return `I would change the background to ${color}.`; 
};

const centerSlideContent = async (command) => {
  // Emit event to parent component to handle the action
  emit('send-message', {
    action: 'center-content',
    message: 'I have centered all content on your slide.'
  });
  return 'I have centered all content on your slide.';
};

const addTitleAtTop = async (command) => {
  // Emit event to parent component to handle the action
  emit('send-message', {
    action: 'add-title',
    position: 'top',
    content: 'New Title',
    message: 'I have added a title at the top of your slide.'
  });
  return 'I have added a title at the top of your slide.';
};

const moveTitleUp = async (command) => {
  // Emit event to parent component to handle the action
  emit('send-message', {
    action: 'move-title',
    direction: 'up',
    message: 'I have moved the title higher on your slide.'
  });
  return 'I have moved the title higher on your slide.';
};

const increaseTextSize = async (command) => {
  // Emit event to parent component to handle the action
  emit('send-message', {
    action: 'adjust-text-size',
    adjustment: 'increase',
    message: 'I have increased the text size on your slide.'
  });
  return 'I have increased the text size on your slide.';
};

const decreaseTextSize = async (command) => {
  // Emit event to parent component to handle the action
  emit('send-message', {
    action: 'adjust-text-size',
    adjustment: 'decrease',
    message: 'I have decreased the text size on your slide.'
  });
  return 'I have decreased the text size on your slide.';
};

const highlightImportantText = async (command) => {
  // Emit event to parent component to handle the action
  emit('send-message', {
    action: 'highlight-text',
    message: 'I have highlighted important text on your slide.'
  });
  return 'I have highlighted important text on your slide.';
};

const createChartFromData = async (command) => {
  // Check if there's numeric data in the slide to create a chart from
  const slideContent = props.parsedSlides[props.currentSlideIndex]?.raw || '';
  const numbers = slideContent.match(/\d+(\.\d+)?/g) || [];
  
  if (numbers.length >= 2) {
    // Emit event to parent component to handle the action
    emit('send-message', {
      action: 'create-chart',
      numbers: numbers,
      message: `I created a chart from the ${numbers.length} numbers I found in your slide: ${numbers.slice(0, 5).join(', ')}${numbers.length > 5 ? '...' : ''}`
    });
    
    return `I created a chart from the ${numbers.length} numbers I found in your slide: ${numbers.slice(0, 5).join(', ')}${numbers.length > 5 ? '...' : ''}`;
  }
  
  return 'I couldn\'t find enough numeric data to create a chart. Please provide specific data.';
};

const createGraphFromData = async (command) => {
  // Similar to createChartFromData but maybe as a different chart type
  return await createChartFromData(command);
};

const addImageBasedOnDescription = async (command) => {
  // Extract image description from command
  const descMatch = command.match(/(?:of|showing|depicting) (.+)/i);
  const description = descMatch ? descMatch[1] : 'relevant image';
  
  // Emit event to parent component to handle the action
  emit('send-message', {
    action: 'add-image',
    description: description,
    message: `I've added an image showing "${description}" to your slide.`
  });
  
  return `I've added an image showing "${description}" to your slide.`;
};

const goToNextSlide = async (command) => {
  if (props.currentSlideIndex < props.parsedSlides.length - 1) {
    // Emit event to parent component to handle the action
    emit('send-message', {
      action: 'navigate-slide',
      direction: 'next',
      message: 'Moving to the next slide.'
    });
    return 'Moving to the next slide.';
  }
  return 'You are already on the last slide.';
};

const goToPrevSlide = async (command) => {
  if (props.currentSlideIndex > 0) {
    // Emit event to parent component to handle the action
    emit('send-message', {
      action: 'navigate-slide',
      direction: 'previous',
      message: 'Moving to the previous slide.'
    });
    return 'Moving to the previous slide.';
  }
  return 'You are already on the first slide.';
};

const goToSpecificSlide = async (command) => {
  const numMatch = command.match(/slide (\d+)/i);
  if (numMatch) {
    const slideNum = parseInt(numMatch[1]) - 1; // Convert to 0-indexed
    if (slideNum >= 0 && slideNum < props.parsedSlides.length) {
      // Emit event to parent component to handle the action
      emit('send-message', {
        action: 'navigate-slide',
        targetIndex: slideNum,
        message: `Jumping to slide ${parseInt(numMatch[1])}.`
      });
      return `Jumping to slide ${parseInt(numMatch[1])}.`;
    }
    return `Slide ${numMatch[1]} doesn't exist. There are ${props.parsedSlides.length} slides.`;
  }
  return 'Could not determine which slide to go to.';
};

// Close panel handler
const closePanel = () => {
  emit('close')
}

// Preview AI suggestion changes
const previewChanges = (message) => {
  console.log('[ChatPanel] Preview changes:', message)
  
  // Emit event to parent component to enter preview mode
  emit('preview-changes', {
    action: message.action || 'apply-suggestion',
    content: message.content,
    slideIndex: props.currentSlideIndex
  })
}

// Apply AI suggestion to current slide
const applyToSlide = (message, applyLayout = false) => {
  console.log('[ChatPanel] Applying to slide:', { message, applyLayout })
  
  if (!message.actionPayload) {
    console.warn('[ChatPanel] No action payload found')
    return
  }
  
  // Emit event to parent component based on action type
  emit('send-message', {
    action: message.action,
    payload: message.actionPayload,
    applyLayout: applyLayout,  // 传递是否应用布局
    slideIndex: props.currentSlideIndex
  })
  
  // Show success feedback
  const feedbackMessage = applyLayout ? '✅ 已应用到幻灯片（含布局）！' : '✅ 已应用到幻灯片！'
  chatMessages.value.push({
    sender: 'ai',
    content: feedbackMessage,
    timestamp: Date.now()
  })
}

// Auto-scroll to bottom when new messages arrive
watch(chatMessages, () => {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
    
    // Render any chart previews
    renderChartPreviews()
  })
}, { deep: true })

// Function to render chart previews in chat messages
const renderChartPreviews = (retryCount = 0) => {
  const chartContainers = document.querySelectorAll('.chart-preview-container:not(.rendered)')
  
  if (chartContainers.length === 0) return
  
  let needsRetry = false
  
  chartContainers.forEach(container => {
    try {
      // Check if container has size
      const width = container.clientWidth
      const height = container.clientHeight
      
      if (width === 0 || height === 0) {
        if (retryCount < 5) {  // Max 5 retries (500ms total)
          console.warn('[ChatPanel] Chart container not ready, will retry...', { width, height, retryCount })
          needsRetry = true
        } else {
          console.error('[ChatPanel] Chart container failed to get dimensions after retries')
          container.classList.add('rendered')  // Mark as rendered to prevent infinite loop
        }
        return
      }
      
      const chartOption = JSON.parse(container.getAttribute('data-chart-option'))
      
      console.log('[ChatPanel] Initializing chart with dimensions:', { width, height })
      
      // Create ECharts instance
      const chartInstance = echarts.init(container)
      chartInstance.setOption(chartOption)
      
      // Mark as rendered
      container.classList.add('rendered')
      
      console.log('[ChatPanel] Rendered chart preview successfully')
    } catch (error) {
      console.error('[ChatPanel] Failed to render chart preview:', error)
      container.classList.add('rendered')  // Mark as rendered to prevent retry on error
    }
  })
  
  // Retry if any container needs it
  if (needsRetry) {
    setTimeout(() => renderChartPreviews(retryCount + 1), 100)
  }
}
</script>

<style scoped>
.chat-panel {
  position: fixed;
  top: 56px;
  right: 12px;
  bottom: 12px;
  width: 360px;  /* Reduced from 380px */
  max-height: calc(100vh - 80px);  /* Add max height */
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.08);
  z-index: 100;
  animation: slideInFromRight 0.3s ease;
  overflow: hidden;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.chat-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;  /* Reduced from 16px 20px */
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-gray);
}

.chat-panel-header .header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-panel-header .header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-panel-header h3 {
  margin: 0;
  font-size: 15px;  /* Reduced from 16px */
  font-weight: 600;
  color: var(--text-primary);
}

.conversation-count {
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(22, 93, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

/* Quick Prompts Section */
.quick-prompts-section {
  padding: 16px;  /* Reduced from 24px 20px */
  background: linear-gradient(135deg, #f5f8ff 0%, #f0f5ff 100%);
  border-bottom: 1px solid var(--border-color);
}

.welcome-message {
  text-align: center;
  margin-bottom: 16px;  /* Reduced from 20px */
}

.welcome-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;  /* Reduced from 56px */
  height: 48px;
  margin: 0 auto 10px;  /* Reduced margin */
  background: linear-gradient(135deg, #e8f3ff 0%, #e6f7ff 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
}

.welcome-text {
  margin: 0;
  font-size: 13px;  /* Reduced from 14px */
  color: #4e5969;
  line-height: 1.5;
}

.quick-prompts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-prompt-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;  /* Reduced from 12px 16px */
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;  /* Reduced from 13px */
  color: #1d2129;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.quick-prompt-btn:hover {
  background: #f7f9fc;
  border-color: #165DFF;
  color: #165DFF;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(22, 93, 255, 0.1);
}

.quick-prompt-btn:active {
  transform: translateY(0);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;  /* Reduced from 16px */
  display: flex;
  flex-direction: column;
  gap: 10px;  /* Reduced from 12px */
  background: #f9fafb;
}

.message {
  max-width: 85%;
  padding: 8px 12px;  /* Reduced from 10px 14px */
  border-radius: 16px;  /* Reduced from 18px */
  font-size: 13px;  /* Reduced from 14px */
  line-height: 1.5;
  position: relative;
  animation: fadeIn 0.3s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  align-self: flex-end;
  background: #165DFF !important;  /* Force blue background */
  color: white !important;         /* Force white text */
  border-bottom-right-radius: 4px;
}

.message.user .message-content {
  /* Ensure user message content is visible */
  display: block;
  min-height: 20px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

/* Common message content styles */
.message-content {
  line-height: 1.6;
  word-break: break-word;
}

/* Message action buttons */
.message-actions {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 8px;
}

.message-actions .arco-btn {
  font-size: 12px;
  height: 28px;
  padding: 0 12px;
  transition: all 0.2s ease;
}

.message-actions .arco-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.2);
}

.message.ai {
  align-self: flex-start;
  background: white;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-bottom-left-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Markdown-like formatting in AI messages */
.message.ai :deep(strong),
.message.ai :deep(b) {
  font-weight: 600;
  color: #1a73e8;
}

.message.ai :deep(code) {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
}

.message.ai :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}

.message.ai :deep(li) {
  margin: 4px 0;
}

.message.ai :deep(h2) {
  font-size: 15px;
  font-weight: 600;
  margin: 8px 0 4px;
  color: #1a73e8;
}

/* Code block header for charts */
.message.ai :deep(.code-block-header) {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* AI-generated images in messages */
.message.ai :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.message.ai :deep(img:hover) {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Thinking indicator */
.thinking-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.thinking-dots {
  display: flex;
  gap: 4px;
}

.thinking-dots span {
  width: 6px;  /* Reduced from 8px */
  height: 6px;
  background: #165DFF;
  border-radius: 50%;
  animation: thinkingBounce 1.4s infinite ease-in-out both;
}

.thinking-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.thinking-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes thinkingBounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.thinking-text {
  font-size: 12px;  /* Reduced from 13px */
  color: #86909c;
  font-style: italic;
}

.message-time {
  font-size: 10px;  /* Reduced from 11px */
  color: var(--text-secondary);
  margin-top: 3px;  /* Reduced from 4px */
  text-align: right;
}

.chat-input-area {
  padding: 12px;  /* Reduced from 16px */
  background: white;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 8px;
}

.chat-input-area .arco-textarea-wrapper {
  flex: 1;
  border: 1px solid var(--border-color) !important;
  border-radius: 8px;
}

.chat-input-area .arco-textarea {
  padding: 8px 12px !important;
  font-size: 14px;
}

.chat-input-area .arco-btn {
  min-width: 36px;
  height: 36px;
  flex-shrink: 0;
}

/* Send button styling */
.send-button {
  transition: all 0.3s ease;
}

.send-button:not(:disabled):hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

.send-button:not(:disabled):active {
  transform: scale(0.95);
}

/* Chart preview in chat messages */
.message.ai :deep(.chart-preview-container) {
  width: 100%;
  height: 200px;
  margin-top: 8px;
  border-radius: 8px;
  background: #f7f8fa;
  border: 1px solid #e5e6eb;
}

/* Image preview in chat messages */
.message.ai :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.message.ai :deep(img:hover) {
  transform: scale(1.02);
}
</style>