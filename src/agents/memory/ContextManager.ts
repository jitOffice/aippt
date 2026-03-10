/**
 * Context Manager - Lightweight memory system for multi-turn conversations
 * Inspired by DeepSeek architecture but adapted for simplicity
 * 
 * Responsibilities:
 * 1. Manage conversation history (short-term memory)
 * 2. Track slide context (current slide content)
 * 3. Build optimized context for LLM calls
 * 4. Prevent context window overflow
 */

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  slideIndex?: number  // Track which slide this message relates to
}

export interface SlideContext {
  index: number
  content: string
  visualData: any
  lastModified: number
}

export interface WorkingContext {
  conversationHistory: ConversationMessage[]
  currentSlide: SlideContext
  relevantHistory: ConversationMessage[]  // Filtered for relevance
  contextSummary: string  // Human-readable summary
}

/**
 * Context Manager - Manages conversation memory and slide context
 */
export class ContextManager {
  private conversationHistory: ConversationMessage[] = []
  private currentSlideContext: SlideContext | null = null
  
  // Configuration
  private readonly MAX_HISTORY_LENGTH = 40  // 20 exchanges (40 messages)
  private readonly MAX_MESSAGE_LENGTH = 500  // Truncate long messages
  private readonly CONTEXT_RELEVANCE_THRESHOLD = 3  // How many recent messages to include
  private readonly WARNING_THRESHOLD = 36  // Warn at 18 exchanges (90% of limit)
  
  // Session management
  private sessionId: string = this.generateSessionId()
  private isLimitReached: boolean = false

  /**
   * Add a new message to conversation history
   * Returns true if successful, false if limit reached
   */
  addMessage(message: ConversationMessage): { success: boolean; warning?: string; error?: string } {
    // Check if limit reached
    if (this.conversationHistory.length >= this.MAX_HISTORY_LENGTH) {
      this.isLimitReached = true
      return {
        success: false,
        error: '对话轮数已达上限（20轮），请点击“新建会话”开始全新对话。'
      }
    }
    
    // Truncate long messages to prevent context overflow
    const truncatedMessage = {
      ...message,
      content: this.truncateContent(message.content)
    }
    
    this.conversationHistory.push(truncatedMessage)
    this.saveToStorage()  // Persist to localStorage
    
    // Check if approaching limit (warning at 90%)
    if (this.conversationHistory.length >= this.WARNING_THRESHOLD && 
        this.conversationHistory.length < this.MAX_HISTORY_LENGTH) {
      const remainingExchanges = Math.floor((this.MAX_HISTORY_LENGTH - this.conversationHistory.length) / 2)
      return {
        success: true,
        warning: `对话即将达到上限，还可进行 ${remainingExchanges} 轮对话。`
      }
    }
    
    return { success: true }
  }

  /**
   * Update current slide context
   */
  updateSlideContext(slideContext: SlideContext): void {
    // If slide changed, mark it in context
    const slideChanged = this.currentSlideContext?.index !== slideContext.index
    
    this.currentSlideContext = slideContext
    
    // If slide changed, add a system message to indicate context shift
    if (slideChanged && this.conversationHistory.length > 0) {
      console.log('[ContextManager] Slide changed:', slideContext.index)
      // Could add marker for conversation continuity analysis
    }
  }

  /**
   * Get working context optimized for current request
   */
  getWorkingContext(userInput: string): WorkingContext {
    const relevantHistory = this.getRelevantHistory(userInput)
    const contextSummary = this.buildContextSummary(relevantHistory)
    
    return {
      conversationHistory: this.conversationHistory,
      currentSlide: this.currentSlideContext || this.getEmptySlideContext(),
      relevantHistory,
      contextSummary
    }
  }

  /**
   * Clear conversation history (e.g., when starting new topic or switching slides)
   */
  clearHistory(): void {
    this.conversationHistory = []
    this.saveToStorage()
    console.log('[ContextManager] History cleared')
  }

  /**
   * Start a new session (clear history and generate new session ID)
   */
  startNewSession(): void {
    this.conversationHistory = []
    this.sessionId = this.generateSessionId()
    this.isLimitReached = false
    this.saveToStorage()
    console.log('[ContextManager] New session started:', this.sessionId)
  }

  /**
   * Check if conversation limit is reached
   */
  isConversationLimitReached(): boolean {
    return this.isLimitReached || this.conversationHistory.length >= this.MAX_HISTORY_LENGTH
  }

  /**
   * Get remaining exchanges before limit
   */
  getRemainingExchanges(): number {
    const remaining = Math.floor((this.MAX_HISTORY_LENGTH - this.conversationHistory.length) / 2)
    return Math.max(0, remaining)
  }

  /**
   * Clear only messages from previous slide (keep current slide context)
   */
  clearPreviousSlideContext(): void {
    if (!this.currentSlideContext) return
    
    const currentIndex = this.currentSlideContext.index
    this.conversationHistory = this.conversationHistory.filter(
      msg => msg.slideIndex === undefined || msg.slideIndex === currentIndex
    )
    
    console.log('[ContextManager] Previous slide context cleared')
  }

  /**
   * Get conversation history formatted for LLM
   */
  getFormattedHistory(maxMessages: number = 6): Array<{ role: string; content: string }> {
    return this.conversationHistory
      .slice(-maxMessages)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))
  }

  /**
   * Get relevant history based on user input
   * Uses simple heuristics to determine which messages are relevant
   */
  private getRelevantHistory(userInput: string): ConversationMessage[] {
    // For now, just return last N messages
    // Could be enhanced with semantic similarity in the future
    const recentMessages = this.conversationHistory.slice(-this.CONTEXT_RELEVANCE_THRESHOLD * 2)
    
    // Filter out very old messages if slide changed
    if (this.currentSlideContext) {
      const currentIndex = this.currentSlideContext.index
      return recentMessages.filter(msg => 
        msg.slideIndex === undefined || 
        msg.slideIndex === currentIndex ||
        msg.timestamp > Date.now() - 60000  // Last minute
      )
    }
    
    return recentMessages
  }

  /**
   * Build human-readable context summary
   */
  private buildContextSummary(relevantHistory: ConversationMessage[]): string {
    if (relevantHistory.length === 0) {
      return '新对话'
    }
    
    const exchangeCount = Math.floor(relevantHistory.length / 2)
    const lastUserMessage = relevantHistory.filter(m => m.role === 'user').pop()
    
    return `已进行 ${exchangeCount} 轮对话，最近讨论：${lastUserMessage?.content.substring(0, 30)}...`
  }

  /**
   * Truncate content to prevent context overflow
   */
  private truncateContent(content: string): string {
    if (content.length <= this.MAX_MESSAGE_LENGTH) {
      return content
    }
    
    return content.substring(0, this.MAX_MESSAGE_LENGTH) + '...'
  }

  /**
   * Get empty slide context as fallback
   */
  private getEmptySlideContext(): SlideContext {
    return {
      index: 0,
      content: '',
      visualData: {},
      lastModified: Date.now()
    }
  }

  /**
   * Get statistics for debugging
   */
  getStats(): {
    historyLength: number
    currentSlide: number | null
    oldestMessageAge: number | null
    sessionId: string
    remainingExchanges: number
  } {
    const oldestMessage = this.conversationHistory[0]
    
    return {
      historyLength: this.conversationHistory.length,
      currentSlide: this.currentSlideContext?.index || null,
      oldestMessageAge: oldestMessage 
        ? Date.now() - oldestMessage.timestamp 
        : null,
      sessionId: this.sessionId,
      remainingExchanges: this.getRemainingExchanges()
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * Save conversation history to localStorage
   */
  private saveToStorage(): void {
    try {
      const storageKey = 'ai-chat-history'
      const data = {
        sessionId: this.sessionId,
        history: this.conversationHistory,
        timestamp: Date.now()
      }
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch (error) {
      console.warn('[ContextManager] Failed to save to localStorage:', error)
    }
  }

  /**
   * Load conversation history from localStorage
   */
  loadFromStorage(): void {
    try {
      const storageKey = 'ai-chat-history'
      const stored = localStorage.getItem(storageKey)
      
      if (stored) {
        const data = JSON.parse(stored)
        
        // Check if session is not too old (e.g., within 24 hours)
        const sessionAge = Date.now() - data.timestamp
        const MAX_SESSION_AGE = 24 * 60 * 60 * 1000  // 24 hours
        
        if (sessionAge < MAX_SESSION_AGE) {
          this.sessionId = data.sessionId
          this.conversationHistory = data.history || []
          this.isLimitReached = this.conversationHistory.length >= this.MAX_HISTORY_LENGTH
          console.log('[ContextManager] Loaded', this.conversationHistory.length, 'messages from storage')
        } else {
          console.log('[ContextManager] Session too old, starting fresh')
          this.startNewSession()
        }
      }
    } catch (error) {
      console.warn('[ContextManager] Failed to load from localStorage:', error)
    }
  }
}

// Singleton instance for global access
export const contextManager = new ContextManager()
