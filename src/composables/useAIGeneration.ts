import { ref, type Ref, type ComputedRef } from 'vue'
import { Message } from '@arco-design/web-vue'
import { streamGenerate } from '../utils/ai'
import type { ParsedSlide } from './useSlideOperations'

const SYSTEM_PROMPT = `You are an AI presentation assistant. Generate a complete presentation in Markdown format using Slidev syntax.

Follow this structure:
1. Title slide with ---
2. 2-3 content slides with bullet points
3. One data slide with an ECharts visualization (mark it with <!-- CHART:xxx --> followed by JSON config)

For charts, use ECharts JSON format (v5.5.1). Common chart types:
- Timeline: line chart with labels
- Bar chart: compare data
- Pie chart: show proportions

Example output:
---
theme: default
---

# AI-Powered Business Growth
### Strategic Insights for 2024

---

## Market Overview

- Global market expanding at 15% CAGR
- Digital transformation driving innovation
- Key focus: AI and automation

---

## Growth Timeline

<!-- CHART:timeline -->
{"title":{"text":"Quarterly Progress","left":"center"},"tooltip":{},"xAxis":{"type":"category","data":["Q1 2024","Q2 2024","Q3 2024","Q4 2024"]},"yAxis":{"type":"value","show":false},"series":[{"type":"line","data":[{"value":1,"label":{"show":true,"formatter":"Revenue Growth\\n$2.5M achieved","position":"top"}},{"value":2,"label":{"show":true,"formatter":"Market Expansion\\n5 regions launched","position":"top"}},{"value":3,"label":{"show":true,"formatter":"Product Launch\\nAI features released","position":"top"}},{"value":4,"label":{"show":true,"formatter":"Optimization\\nROI improved 40%","position":"top"}}],"smooth":true,"lineStyle":{"width":3}}]}

---

## Key Takeaways

- Invest in AI capabilities
- Focus on customer experience
- Scale operations globally

IMPORTANT: 
1. Output ONLY the Markdown content. No explanations.
2. For charts, put JSON on ONE line after <!-- CHART:xxx -->
3. Use valid ECharts v5.5.1 JSON (no functions, only data)`

export function useAIGeneration(
  markdownContent: Ref<string>,
  parsedSlides: ComputedRef<ParsedSlide[]>,
  t: (key: string, params?: any) => string
) {
  const aiPrompt = ref('')
  const aiMode = ref<'all' | 'current'>('all')
  const isGenerating = ref(false)
  const showAIPanel = ref(false)
  let abortController: AbortController | null = null

  const handleAIPanelChange = (visible: boolean) => {
    showAIPanel.value = visible
  }

  const handleGenerateFromPrompt = () => {
    if (!aiPrompt.value.trim() || isGenerating.value) return
    
    generatePresentation(aiPrompt.value)
    showAIPanel.value = false
    aiPrompt.value = ''
  }

  const handleQuickAction = (action: string) => {
    const actionPrompts: Record<string, string> = {
      improve: 'Improve the writing and make it more professional',
      fix: 'Fix any spelling and grammar errors',
      translate: 'Translate to Chinese',
      longer: 'Make the content more detailed and comprehensive',
      shorter: 'Make the content more concise and brief',
      simplify: 'Simplify the language to be more accessible',
      specific: 'Add more specific details and examples'
    }
    
    if (aiMode.value === 'current') {
      // Apply action to current slide only
      if (parsedSlides.value.length > 0) {
        aiPrompt.value = actionPrompts[action]
        handleGenerateFromPrompt()
      } else {
        Message.warning(t('slide.aiPanel.createSlidesFirst'))
      }
    } else {
      // Apply action to all slides
      if (markdownContent.value) {
        aiPrompt.value = actionPrompts[action]
        handleGenerateFromPrompt()
      } else {
        Message.warning(t('slide.aiPanel.createSlidesFirst'))
      }
    }
  }

  const applyTemplate = (templateType: string) => {
    const templatePrompts: Record<string, string> = {
      business: 'Create a professional business presentation with: Executive Summary, Market Analysis, Strategy, Financial Projections, and Next Steps',
      education: 'Create an educational presentation with: Learning Objectives, Key Concepts, Examples & Activities, Practice Questions, and Summary',
      tech: 'Create a technical presentation with: Problem Statement, Technical Architecture, Implementation Details, Demo/Results, and Future Work'
    }
    
    aiPrompt.value = templatePrompts[templateType]
    aiMode.value = 'all'
    handleGenerateFromPrompt()
  }

  const generatePresentation = async (userPrompt: string) => {
    if (isGenerating.value) return
    
    const prompt = userPrompt || 'Generate a professional presentation with 4-5 slides'
    
    isGenerating.value = true
    
    if (abortController) abortController.abort()
    
    // Use hybrid model routing with task context
    abortController = streamGenerate(
      prompt,
      SYSTEM_PROMPT,
      {
        onDelta: (chunk: string) => {
          markdownContent.value += chunk
        },
        onDone: () => {
          isGenerating.value = false
          Message.success('Presentation generated successfully!')
        },
        onError: (err: any) => {
          if (err?.name === 'AbortError') return
          isGenerating.value = false
          console.error('Generation error:', err)
          Message.error('Generation failed: ' + (err.message || 'Unknown error'))
        }
      },
      undefined,
      {
        // Automatic model selection based on task
        taskContext: {
          slideCount: parsedSlides.value.length,
          hasDocument: false,
        }
      }
    )
  }

  return {
    aiPrompt,
    aiMode,
    isGenerating,
    showAIPanel,
    handleAIPanelChange,
    handleGenerateFromPrompt,
    handleQuickAction,
    applyTemplate,
    generatePresentation
  }
}
