/**
 * AI Suggestion Applier Composable
 * Handles parsing and applying AI suggestions to slides
 */

import type {
  SlideVisualData,
  AISuggestion,
  ComponentAdditionSuggestion,
  TextChangeSuggestion,
  TitleChangeSuggestion,
  FontSizeChangeSuggestion,
  PositionChangeSuggestion,
  LayoutAdjustSuggestion,
  ColorChangeSuggestion,
  SeparatorSuggestion,
  ComponentDefinitions,
  ShapeComponentProps,
  VisualTextElement,
  VisualRectangleElement
} from './types'

/**
 * Parse AI suggestions from text content
 * @param content - AI response content
 * @returns Array of suggestion objects
 */
export function parseAISuggestions(content: string): AISuggestion[] {
  const suggestions: AISuggestion[] = []
  
  console.log('[parseAISuggestions] Parsing content:', content)
  
  // First, check if there's a structured "执行命令" block
  const commandBlockRegex = /\*\*执行命令[：:]\*\*([\s\S]*?)(?=\n\n|$)/i
  const commandBlockMatch = content.match(commandBlockRegex)
  
  if (commandBlockMatch) {
    const commandBlock = commandBlockMatch[1]
    console.log('[parseAISuggestions] Found command block:', commandBlock)
    
    // Parse structured commands
    const commands = commandBlock.split('\n').filter(line => line.trim().startsWith('-'))
    
    commands.forEach(cmd => {
      const cmdText = cmd.replace(/^-\s*/, '').trim()
      
      // 修改标题："新标题"
      const titleMatch = cmdText.match(/修改标题[：:]\s*[""](.+?)[""]/i)
      if (titleMatch) {
        suggestions.push({
          type: 'text-change',
          target: 'title',
          text: titleMatch[1]
        })
        console.log('[parseAISuggestions] Added text-change (title):', titleMatch[1])
      }
      
      // 修改副标题:"新副标题"
      const subtitleMatch = cmdText.match(/修改副标题[：:]\s*[""](.+?)[""]/i)
      if (subtitleMatch) {
        suggestions.push({
          type: 'text-change',
          target: 'subtitle',
          text: subtitleMatch[1]
        })
        console.log('[parseAISuggestions] Added text-change (subtitle):', subtitleMatch[1])
      }
      
      // 添加组件：thick-line
      const componentMatch = cmdText.match(/添加组件[：:]\s*(simple-line|thick-line|gradient-line|dotted-line|dashed-line)/i)
      if (componentMatch) {
        suggestions.push({
          type: 'add-component',
          componentId: componentMatch[1].toLowerCase(),
          componentType: 'shape'
        })
        console.log('[parseAISuggestions] Added add-component:', componentMatch[1])
      }
      
      // 调整间距：30px
      const spacingMatch = cmdText.match(/调整间距[：:]\s*(\d+)px/i)
      if (spacingMatch) {
        suggestions.push({
          type: 'layout-adjust',
          spacing: parseInt(spacingMatch[1])
        })
        console.log('[parseAISuggestions] Added layout-adjust (spacing):', spacingMatch[1])
      }
      
      // 设置字号：标题=48px, 副标题=24px
      const fontSizeMatch = cmdText.match(/设置字号[：:](.+)/i)
      if (fontSizeMatch) {
        const sizeText = fontSizeMatch[1]
        const titleSize = sizeText.match(/标题\s*=\s*(\d+)px/i)
        const subtitleSize = sizeText.match(/副标题\s*=\s*(\d+)px/i)
        
        if (titleSize) {
          suggestions.push({
            type: 'font-size-change',
            target: 'title',
            size: parseInt(titleSize[1])
          })
          console.log('[parseAISuggestions] Added font-size-change (title):', titleSize[1])
        }
        if (subtitleSize) {
          suggestions.push({
            type: 'font-size-change',
            target: 'subtitle',
            size: parseInt(subtitleSize[1])
          })
          console.log('[parseAISuggestions] Added font-size-change (subtitle):', subtitleSize[1])
        }
      }
      
      // 设置颜色：标题=#1f2937, 副标题=#6b7280
      const colorMatch = cmdText.match(/设置颜色[：:](.+)/i)
      if (colorMatch) {
        const colorText = colorMatch[1]
        const titleColor = colorText.match(/标题\s*=\s*#([0-9a-fA-F]{6})/i)
        const subtitleColor = colorText.match(/副标题\s*=\s*#([0-9a-fA-F]{6})/i)
        
        if (titleColor) {
          suggestions.push({
            type: 'color-change',
            target: 'title',
            colorHex: '#' + titleColor[1]
          })
          console.log('[parseAISuggestions] Added color-change (title):', '#' + titleColor[1])
        }
        if (subtitleColor) {
          suggestions.push({
            type: 'color-change',
            target: 'subtitle',
            colorHex: '#' + subtitleColor[1]
          })
          console.log('[parseAISuggestions] Added color-change (subtitle):', '#' + subtitleColor[1])
        }
      }
    })
    
    console.log('[parseAISuggestions] Total suggestions parsed from command block:', suggestions.length, suggestions)
    return suggestions
  }
  
  // If no command block, fall back to loose pattern matching
  console.log('[parseAISuggestions] No command block found, using loose patterns')
  
  // Patterns to detect in AI response
  interface PatternDefinition {
    regex: RegExp
    type: AISuggestion['type']
    extract: (match: RegExpMatchArray) => Partial<AISuggestion>
  }
  
  const patterns: PatternDefinition[] = [
    // Component recommendations (PRIMARY - Highest priority)
    {
      regex: /(?:添加|使用|插入)\s*(simple-line|thick-line|gradient-line|dotted-line|dashed-line)(?:\s*组件)?/gi,
      type: 'add-component',
      extract: (match) => {
        const componentId = match[1].toLowerCase()
        return { componentId, componentType: 'shape' as const }
      }
    },
    // Component with "one" quantifier
    {
      regex: /添加\s*一条\s*(simple-line|thick-line|gradient-line|dotted-line|dashed-line)(?:\s*组件)?/gi,
      type: 'add-component',
      extract: (match) => {
        const componentId = match[1].toLowerCase()
        return { componentId, componentType: 'shape' as const }
      }
    },
    // Component with markdown bold
    {
      regex: /\*\*(gradient-line|thick-line|simple-line|dotted-line|dashed-line)\*\*[^\n]*/gi,
      type: 'add-component',
      extract: (match) => {
        const componentId = match[1].toLowerCase()
        return { componentId, componentType: 'shape' as const }
      }
    },
    // Component with markdown code
    {
      regex: /`(gradient-line|thick-line|simple-line|dotted-line|dashed-line)`/gi,
      type: 'add-component',
      extract: (match) => {
        const componentId = match[1].toLowerCase()
        return { componentId, componentType: 'shape' as const }
      }
    },
    // Position with percentage
    {
      regex: /"x":\s*"(\d+)%"/gi,
      type: 'position-change',
      extract: (match) => {
        const percent = parseInt(match[1])
        return { x: Math.floor(960 * percent / 100), target: 'title' as const, isPercentage: true }
      }
    },
    {
      regex: /"y":\s*"(\d+)%"/gi,
      type: 'position-change',
      extract: (match) => {
        const percent = parseInt(match[1])
        return { y: Math.floor(540 * percent / 100), target: 'title' as const, isPercentage: true }
      }
    },
    // Position changes: "(x:400, y:250)"
    {
      regex: /\(x:(\d+),\s*y:(\d+)\)/gi,
      type: 'position-change',
      extract: (match) => ({ x: parseInt(match[1]), y: parseInt(match[2]), target: 'title' as const })
    }
  ]
  
  // Try to match each pattern
  patterns.forEach(pattern => {
    const matches = [...content.matchAll(pattern.regex)]
    
    matches.forEach(match => {
      try {
        const data = pattern.extract(match)
        const suggestion = {
          type: pattern.type,
          ...data
        } as AISuggestion
        suggestions.push(suggestion)
        console.log('[parseAISuggestions] Added suggestion:', suggestion)
      } catch (e) {
        console.warn('[parseAISuggestions] Failed to extract data from match:', match, e)
      }
    })
  })
  
  console.log('[parseAISuggestions] Total suggestions parsed:', suggestions.length, suggestions)
  
  return suggestions
}

/**
 * Split combined text into title and subtitle if needed
 * @param visualData - Current slide visual data
 * @returns Modified visual data with separated texts
 */
export function ensureSeparatedTexts(visualData: SlideVisualData): SlideVisualData {
  if (!visualData.texts || visualData.texts.length === 0) return visualData
  
  // Check if we have a combined title+subtitle text
  const firstText = visualData.texts[0]
  const textContent = (firstText as any).text || firstText.content
  
  if (!textContent) return visualData
  
  // Check if text contains newline (likely title + subtitle)
  const lines = textContent.split('\n').filter((l: string) => l.trim())
  
  if (lines.length >= 2 && visualData.texts.length === 1) {
    console.log('[ensureSeparatedTexts] Splitting combined text into title and subtitle')
    
    // Create separate title
    const title: VisualTextElement = {
      ...firstText,
      id: `text-title-${Date.now()}`,
      type: 'text',
      content: lines[0],
      fontSize: firstText.fontSize || 48,
      fontWeight: 'bold',
      y: firstText.y
    }
    
    // Create separate subtitle
    const subtitle: VisualTextElement = {
      ...firstText,
      id: `text-subtitle-${Date.now()}`,
      type: 'text',
      content: lines.slice(1).join('\n'),
      fontSize: Math.floor((firstText.fontSize || 48) * 0.6), // 60% of title size
      fontWeight: 'normal',
      y: firstText.y + (firstText.fontSize || 48) + 20 // Below title with spacing
    }
    
    // Replace the combined text with two separate texts
    visualData.texts = [title, subtitle]
    console.log('[ensureSeparatedTexts] Created title:', title)
    console.log('[ensureSeparatedTexts] Created subtitle:', subtitle)
  }
  
  return visualData
}

/**
 * Apply component addition from AI recommendation
 * @param visualData - Current slide visual data
 * @param suggestion - Component suggestion
 */
export function applyComponentAddition(
  visualData: SlideVisualData,
  suggestion: ComponentAdditionSuggestion
): void {
  console.log('[applyComponentAddition] Adding component:', suggestion)
  
  // Import component definitions
  const { shapeComponents } = getComponentDefinitions()
  
  // Find the component definition
  const componentDef = shapeComponents.find(c => c.id === suggestion.componentId)
  
  if (!componentDef) {
    console.warn('[applyComponentAddition] Component not found:', suggestion.componentId)
    return
  }
  
  console.log('[applyComponentAddition] Found component definition:', componentDef)
  
  // Apply component properties based on type
  if (componentDef.props.shapeType === 'decorative-line') {
    addDecorativeLineFromComponent(visualData, componentDef.props)
  }
}

/**
 * Add decorative line from component definition
 * @param visualData - Current slide visual data
 * @param props - Component properties
 */
function addDecorativeLineFromComponent(
  visualData: SlideVisualData,
  props: ShapeComponentProps
): void {
  console.log('[addDecorativeLineFromComponent] Adding line with props:', props)
  
  if (!visualData.rectangles) {
    visualData.rectangles = []
  }
  
  // Calculate position (centered below existing content)
  let lineY = 320
  if (visualData.texts && visualData.texts.length > 0) {
    const sorted = [...visualData.texts].sort((a, b) => a.y - b.y)
    const lastText = sorted[sorted.length - 1]
    lineY = lastText.y + (lastText.fontSize || 28) + 40
  }
  
  const line: VisualRectangleElement = {
    id: `line-${Date.now()}`,
    type: 'rectangle',
    x: (960 - (props.width || 300)) / 2,  // Center horizontally
    y: lineY,
    width: props.width || 300,
    height: props.height || 3,
    fill: props.fill,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth || 0
  }
  
  // Add optional properties
  const lineWithOptional: any = { ...line }
  if (props.cornerRadius !== undefined) lineWithOptional.cornerRadius = props.cornerRadius
  if (props.dash) lineWithOptional.dash = props.dash
  lineWithOptional.draggable = true
  lineWithOptional.name = `line-${Date.now()}`
  lineWithOptional.__zIndex = visualData.texts ? visualData.texts.length + visualData.rectangles.length + 1 : 1
  
  // Handle gradient
  if (props.fillLinearGradientColorStops) {
    lineWithOptional.fillLinearGradientStartPoint = props.fillLinearGradientStartPoint
    lineWithOptional.fillLinearGradientEndPoint = props.fillLinearGradientEndPoint
    lineWithOptional.fillLinearGradientColorStops = props.fillLinearGradientColorStops
    delete lineWithOptional.fill
  }
  
  visualData.rectangles.push(lineWithOptional)
  console.log('[addDecorativeLineFromComponent] Added line:', lineWithOptional)
}

/**
 * Get component definitions (to avoid circular imports)
 */
function getComponentDefinitions(): ComponentDefinitions {
  // Define inline to avoid import issues in composable
  return {
    shapeComponents: [
      { 
        id: 'simple-line', 
        props: { 
          shapeType: 'decorative-line',
          lineStyle: 'simple',
          width: 300, 
          height: 3, 
          fill: '#3b82f6',
          cornerRadius: 1.5
        } 
      },
      { 
        id: 'thick-line', 
        props: { 
          shapeType: 'decorative-line',
          lineStyle: 'thick',
          width: 300, 
          height: 8, 
          fill: '#8b5cf6',
          cornerRadius: 4
        } 
      },
      { 
        id: 'gradient-line', 
        props: { 
          shapeType: 'decorative-line',
          lineStyle: 'gradient',
          width: 300, 
          height: 4, 
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: 300, y: 0 },
          fillLinearGradientColorStops: [0, '#3b82f6', 1, '#8b5cf6']
        } 
      },
      { 
        id: 'dotted-line', 
        props: { 
          shapeType: 'decorative-line',
          lineStyle: 'dotted',
          width: 300, 
          height: 2, 
          stroke: '#64748b',
          strokeWidth: 2,
          dash: [2, 8],
          fill: 'transparent'
        } 
      },
      { 
        id: 'dashed-line', 
        props: { 
          shapeType: 'decorative-line',
          lineStyle: 'dashed',
          width: 300, 
          height: 2, 
          stroke: '#64748b',
          strokeWidth: 2,
          dash: [10, 5],
          fill: 'transparent'
        } 
      }
    ]
  }
}

/**
 * Apply title change suggestion
 */
export function applyTitleChange(
  visualData: SlideVisualData,
  suggestion: TitleChangeSuggestion
): void {
  if (!visualData.texts) return
  
  const textToChange = visualData.texts.find(t => {
    const content = (t as any).text || t.content
    return content && content.includes(suggestion.from)
  })
  
  if (textToChange) {
    const oldContent = (textToChange as any).text || textToChange.content
    const newContent = oldContent.replace(suggestion.from, suggestion.to)
    if ((textToChange as any).text) {
      (textToChange as any).text = newContent
    } else {
      textToChange.content = newContent
    }
    console.log('[applyTitleChange] Changed text from', suggestion.from, 'to', suggestion.to)
  }
}

/**
 * Apply text change suggestion (direct replacement)
 */
export function applyTextChange(
  visualData: SlideVisualData,
  suggestion: TextChangeSuggestion
): void {
  if (!visualData.texts || !suggestion.text) return
  
  const targetIndex = suggestion.target === 'title' ? 0 : 1
  
  if (visualData.texts[targetIndex]) {
    const oldContent = (visualData.texts[targetIndex] as any).text || visualData.texts[targetIndex].content
    
    if ((visualData.texts[targetIndex] as any).text) {
      (visualData.texts[targetIndex] as any).text = suggestion.text
    } else {
      visualData.texts[targetIndex].content = suggestion.text
    }
    
    console.log(`[applyTextChange] Changed ${suggestion.target}: "${oldContent}" -> "${suggestion.text}"`)
  } else {
    console.warn(`[applyTextChange] Target text not found: ${suggestion.target}`)
  }
}

/**
 * Apply font size change suggestion
 */
export function applyFontSizeChange(
  visualData: SlideVisualData,
  suggestion: FontSizeChangeSuggestion
): void {
  if (!visualData.texts) return
  
  if (suggestion.target === 'title') {
    // Find largest text (title)
    const title = visualData.texts.reduce<VisualTextElement | null>((largest, text) => 
      !largest || text.fontSize > largest.fontSize ? text : largest
    , null)
    
    if (title) {
      title.fontSize = suggestion.size
      console.log('[applyFontSizeChange] Changed title font size to', suggestion.size)
    }
  } else if (suggestion.target === 'subtitle') {
    // Ensure texts are separated first
    ensureSeparatedTexts(visualData)
    
    // Find second largest text (subtitle) or second text
    if (visualData.texts.length > 1) {
      const subtitle = visualData.texts[1]
      subtitle.fontSize = suggestion.size
      console.log('[applyFontSizeChange] Changed subtitle font size to', suggestion.size)
    } else {
      console.warn('[applyFontSizeChange] No subtitle found to change font size')
    }
  }
}

/**
 * Apply position change suggestion
 */
export function applyPositionChange(
  visualData: SlideVisualData,
  suggestion: PositionChangeSuggestion
): void {
  if (!visualData.texts) return
  
  console.log('[applyPositionChange] Changing position to:', { x: suggestion.x, y: suggestion.y })
  
  if (suggestion.target === 'title') {
    const title = visualData.texts.reduce<VisualTextElement | null>((largest, text) => 
      !largest || text.fontSize > largest.fontSize ? text : largest
    , null)
    
    if (title) {
      if (suggestion.x !== undefined) title.x = suggestion.x
      if (suggestion.y !== undefined) title.y = suggestion.y
      console.log('[applyPositionChange] Changed title position to', title.x, title.y)
    }
  }
}

/**
 * Apply layout adjustment suggestion
 */
export function applyLayoutAdjust(
  visualData: SlideVisualData,
  suggestion: LayoutAdjustSuggestion
): void {
  if (!visualData.texts) return
  
  if (suggestion.alignment === 'center') {
    const slideWidth = 960
    
    visualData.texts.forEach((text, index) => {
      // Estimate text width
      const content = (text as any).text || text.content
      const textWidth = text.width || (content.length * text.fontSize * 0.6)
      text.x = (slideWidth - textWidth) / 2
      console.log(`[applyLayoutAdjust] Centered text ${index}:`, text.x)
    })
  }
  
  if (suggestion.spacing) {
    // Adjust spacing between elements
    const sorted = [...visualData.texts].sort((a, b) => a.y - b.y)
    if (sorted.length > 1) {
      sorted[1].y = sorted[0].y + sorted[0].fontSize + suggestion.spacing
      console.log('[applyLayoutAdjust] Adjusted spacing to', suggestion.spacing)
    }
  }
}

/**
 * Apply color change suggestion
 */
export function applyColorChange(
  visualData: SlideVisualData,
  suggestion: ColorChangeSuggestion
): void {
  if (!visualData.texts) return
  
  // Use direct hex color if provided
  let color = suggestion.colorHex
  
  // Otherwise, use color mapping
  if (!color && suggestion.color) {
    const colorMap: Record<string, string> = {
      '淡灰': '#9ca3af',
      '灰': '#6b7280',
      '深灰': '#374151',
      '黑': '#000000',
      '白': '#ffffff',
      '蓝': '#3b82f6',
      '红': '#ef4444',
      '深色': '#1f2937'
    }
    
    color = colorMap[suggestion.color] || '#6b7280'
  }
  
  if (!color) return
  
  console.log('[applyColorChange] Applying color:', color, 'to target:', suggestion.target)
  
  if (suggestion.target === 'title') {
    const title = visualData.texts.reduce<VisualTextElement | null>((largest, text) => 
      !largest || text.fontSize > largest.fontSize ? text : largest
    , null)
    
    if (title) {
      title.fill = color
      console.log('[applyColorChange] Changed title color to', color)
    }
  } else if (suggestion.target === 'subtitle') {
    // Ensure texts are separated
    ensureSeparatedTexts(visualData)
    
    if (visualData.texts.length > 1) {
      const subtitle = visualData.texts[1]
      subtitle.fill = color
      console.log('[applyColorChange] Changed subtitle color to', color)
    } else {
      console.warn('[applyColorChange] No subtitle found to change color')
    }
  }
}

/**
 * Add separator line
 */
export function addSeparatorLine(
  visualData: SlideVisualData,
  suggestion: SeparatorSuggestion
): void {
  console.log('[addSeparatorLine] Adding separator line')
  
  if (!visualData.rectangles) {
    visualData.rectangles = []
  }
  
  // Determine line position based on existing content
  let lineY = 320 // Default middle position
  
  if (visualData.texts && visualData.texts.length > 0) {
    // Find the lowest title/subtitle
    const sorted = [...visualData.texts].sort((a, b) => a.y - b.y)
    const lastText = sorted[sorted.length - 1]
    // Place line below the last text
    lineY = lastText.y + (lastText.fontSize || 28) + 30
  }
  
  const separatorLine: any = {
    id: `separator-${Date.now()}`,
    type: 'rectangle',
    x: 330,  // Centered (960px slide width / 2 - 150px)
    y: lineY,
    width: 300,  // Wider line
    height: 3,   // 3px height
    fill: '#3b82f6',  // Blue color
    stroke: undefined,  // No stroke
    strokeWidth: 0,
    cornerRadius: 1.5,  // Slightly rounded ends
    draggable: true,
    name: `separator-${Date.now()}`,
    __zIndex: visualData.texts ? visualData.texts.length + 1 : 1  // Above texts
  }
  
  visualData.rectangles.push(separatorLine)
  console.log('[addSeparatorLine] Added separator:', separatorLine)
}

/**
 * Main function to apply all suggestions
 * @param visualData - Current slide visual data
 * @param suggestionContent - AI response content
 * @returns Modified visual data
 */
export function applySuggestions(
  visualData: SlideVisualData,
  suggestionContent: string
): SlideVisualData {
  console.log('[applySuggestions] Applying suggestions to visual data')
  
  // First, ensure texts are separated if needed
  ensureSeparatedTexts(visualData)
  
  // Parse suggestions
  const suggestions = parseAISuggestions(suggestionContent)
  
  if (suggestions.length === 0) {
    console.warn('[applySuggestions] No suggestions parsed from content')
    return visualData
  }
  
  // Apply each suggestion
  suggestions.forEach(suggestion => {
    switch (suggestion.type) {
      case 'text-change':
        applyTextChange(visualData, suggestion)
        break
      case 'add-component':
        applyComponentAddition(visualData, suggestion)
        break
      case 'title-change':
        applyTitleChange(visualData, suggestion)
        break
      case 'font-size-change':
        applyFontSizeChange(visualData, suggestion)
        break
      case 'position-change':
        applyPositionChange(visualData, suggestion)
        break
      case 'layout-adjust':
        applyLayoutAdjust(visualData, suggestion)
        break
      case 'color-change':
        applyColorChange(visualData, suggestion)
        break
      case 'add-separator':
        addSeparatorLine(visualData, suggestion)
        break
      default:
        console.log('[applySuggestions] Unknown suggestion type:', (suggestion as any).type)
    }
  })
  
  console.log('[applySuggestions] All suggestions applied')
  
  return visualData
}
