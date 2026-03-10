import { Message } from '@arco-design/web-vue'
import { getLayoutById } from '../utils/slide/smartLayoutTemplates.js'
import type { ComputedRef } from 'vue'
import type { VisualData } from './useVisualDataManager.js'

export function useLayoutApplication(
  currentVisualData: ComputedRef<VisualData>,
  currentThemeStyle: ComputedRef<any>,
  handleVisualDataUpdate: (data: VisualData) => void,
  t: (key: string, params?: any) => string
) {
  
  /**
   * Apply smart layout with content preservation
   */
  const handleApplyLayout = (layout: any) => {
    // Get current slide visual data
    const currentData = currentVisualData.value
    const themeColor = currentThemeStyle.value?.color || '#333'
    
    console.log('[handleApplyLayout] Current data before layout:', {
      texts: currentData.texts?.length || 0,
      images: currentData.images?.length || 0,
      charts: currentData.charts?.length || 0
    })
    
    // Apply layout template WITH CONTENT PRESERVATION
    const newData = applyLayoutToSlideWithContent(layout, currentData, themeColor)
    
    console.log('[handleApplyLayout] New data after layout:', {
      texts: newData.texts?.length || 0,
      images: newData.images?.length || 0,
      charts: newData.charts?.length || 0
    })
    
    // Update visual editor with new data
    handleVisualDataUpdate(newData)
    
    // Show success message with translated layout name
    const layoutName = t(layout.name)
    Message.success(t('slide.layouts.layoutApplied', { name: layoutName }))
  }

  /**
   * Strip markdown formatting from text
   */
  const stripMarkdown = (text: string): string => {
    if (!text) return ''
    
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/(?<!^|\s)\*([^*]+)\*(?!\s|$)/g, '$1')
      .replace(/(?<!^|\s)_([^_]+)_(?!\s|$)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^#{1,6}\s+(.+)$/gm, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  /**
   * Parse text into structured sections
   */
  const parseTextIntoSections = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim())
    const sections: Array<{ title: string; bullets: string[] }> = []
    let currentSection: { title: string; bullets: string[] } | null = null
    
    lines.forEach(line => {
      const trimmed = line.trim()
      
      const cleanText = (str: string) => {
        return str
          .replace(/^#{1,6}\s*/, '')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/__([^_]+)__/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
          .trim()
      }
      
      if (trimmed.match(/^#{1,6}\s/)) {
        if (currentSection) sections.push(currentSection)
        currentSection = {
          title: cleanText(trimmed),
          bullets: []
        }
      }
      else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        if (currentSection) sections.push(currentSection)
        currentSection = {
          title: cleanText(trimmed),
          bullets: []
        }
      }
      else if (trimmed.match(/^[\u2022\-\*]\s/)) {
        if (!currentSection) {
          currentSection = { title: '', bullets: [] }
        }
        const bulletText = trimmed.replace(/^[\u2022\-\*]\s*/, '')
        currentSection.bullets.push(cleanText(bulletText))
      }
      else if (trimmed.match(/^-{3,}$/)) {
        return
      }
      else if (trimmed.length > 0) {
        const isLongText = trimmed.length > 50
        
        if (!currentSection) {
          currentSection = { title: cleanText(trimmed), bullets: [] }
        }
        else if (currentSection.bullets.length > 0) {
          currentSection.bullets.push(cleanText(trimmed))
        }
        else if (currentSection.title && isLongText) {
          currentSection.bullets.push(cleanText(trimmed))
        }
        else if (currentSection.title && !isLongText) {
          sections.push(currentSection)
          currentSection = { title: cleanText(trimmed), bullets: [] }
        }
        else {
          currentSection.title = cleanText(trimmed)
        }
      }
    })
    
    if (currentSection) sections.push(currentSection)
    return sections
  }

  /**
   * Apply text with smart line breaking
   */
  const applyTextWithSmartLineBreaking = (text: string, visualData: VisualData) => {
    console.log('[applyTextWithSmartLineBreaking] Processing text:', text.substring(0, 100))
    
    const sections = parseTextIntoSections(text)
    console.log('[applyTextWithSmartLineBreaking] Detected sections:', sections)
    
    visualData.texts = []
    
    const sectionsWithBullets = sections.filter(s => s.bullets && s.bullets.length > 0)
    const hasBullets = sectionsWithBullets.length > 0
    const hasMultipleSections = sections.length > 1
    
    if (hasMultipleSections && hasBullets) {
      console.log('[applyTextWithSmartLineBreaking] Applying boxes layout (multiple sections with structure)')
      const layoutId = sections.length <= 2 ? 'boxes-2' : (sections.length === 3 ? 'boxes-3' : 'boxes-4')
      applyBoxesLayout(sections, visualData, layoutId)
    } else if (hasBullets) {
      console.log('[applyTextWithSmartLineBreaking] Applying bullet list layout (single section with structure)')
      applyBulletListLayout(sections, visualData)
    } else {
      console.log('[applyTextWithSmartLineBreaking] Applying simple line breaking (no structure)')
      applySimpleLineBreaking(text, visualData)
    }
    
    console.log('[applyTextWithSmartLineBreaking] Created', visualData.texts.length, 'text elements')
  }

  /**
   * Apply simple line breaking fallback
   */
  const applySimpleLineBreaking = (text: string, visualData: VisualData) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim())
    const lines = paragraphs.length === 1 
      ? text.split('\n').filter(l => l.trim())
      : paragraphs
    
    const canvasWidth = 960
    const canvasHeight = 540
    const maxY = canvasHeight - 80
    let yOffset = 100
    
    lines.forEach((line, idx) => {
      if (yOffset > maxY) return
      
      const trimmedLine = line.trim()
      if (!trimmedLine) return
      
      const isTitle = idx === 0
      const fontSize = isTitle ? 32 : 18
      const fontWeight = isTitle ? 'bold' : 'normal'
      const lineHeight = isTitle ? 50 : 32
      
      visualData.texts.push({
        id: `text-${Date.now()}-${idx}`,
        text: trimmedLine,
        x: 80,
        y: yOffset,
        fontSize: fontSize,
        fontWeight: fontWeight,
        fill: '#1f2937',
        __zIndex: idx * 10
      })
      
      yOffset += lineHeight
    })
  }

  /**
   * Apply bullet list layout
   */
  const applyBulletListLayout = (sections: any[], visualData: VisualData) => {
    const template = getLayoutById('bullet-standard')
    
    if (!template || !template.structure || !template.structure.items) {
      console.error('[applyBulletListLayout] Invalid template')
      return applyBulletListLayoutFallback(sections, visualData)
    }
    
    const canvasWidth = 960
    const canvasHeight = 540
    const maxY = canvasHeight - 50
    const maxTextWidth = canvasWidth - 180
    let yOffset = 80
    
    sections.forEach((section, sectionIdx) => {
      if (yOffset > maxY) return
      
      if (section.title) {
        const titleFontSize = sectionIdx === 0 ? 32 : 22
        
        visualData.texts.push({
          id: `text-title-${Date.now()}-${sectionIdx}`,
          text: section.title,
          x: 80,
          y: yOffset,
          width: maxTextWidth,
          fontSize: titleFontSize,
          fontWeight: 'bold',
          fill: '#1f2937',
          wrap: 'word',
          __zIndex: sectionIdx * 10
        })
        yOffset += (sectionIdx === 0 ? 48 : 36)
      }
      
      section.bullets.forEach((bullet: string, bulletIdx: number) => {
        if (yOffset > maxY) return
        
        visualData.texts.push({
          id: `text-bullet-${Date.now()}-${sectionIdx}-${bulletIdx}`,
          text: `• ${bullet}`,
          x: 100,
          y: yOffset,
          width: maxTextWidth - 20,
          fontSize: 16,
          fontWeight: 'normal',
          fill: '#4b5563',
          lineHeight: 1.6,
          wrap: 'word',
          __zIndex: sectionIdx * 10 + bulletIdx + 1
        })
        yOffset += 32
      })
      
      yOffset += 20
    })
  }

  const applyBulletListLayoutFallback = (sections: any[], visualData: VisualData) => {
    const canvasWidth = 960
    const canvasHeight = 540
    const maxY = canvasHeight - 50
    const maxTextWidth = canvasWidth - 180
    let yOffset = 100
    
    sections.forEach((section, sectionIdx) => {
      if (yOffset > maxY) return
      
      if (section.title) {
        const titleFontSize = sectionIdx === 0 ? 28 : 20
        
        visualData.texts.push({
          id: `text-title-${Date.now()}-${sectionIdx}`,
          text: section.title,
          x: 80,
          y: yOffset,
          width: maxTextWidth,
          fontSize: titleFontSize,
          fontWeight: 'bold',
          fill: '#1f2937',
          wrap: 'word',
          __zIndex: sectionIdx * 10
        })
        yOffset += (sectionIdx === 0 ? 40 : 32)
      }
      
      section.bullets.forEach((bullet: string, bulletIdx: number) => {
        if (yOffset > maxY) return
        
        visualData.texts.push({
          id: `text-bullet-${Date.now()}-${sectionIdx}-${bulletIdx}`,
          text: `• ${bullet}`,
          x: 100,
          y: yOffset,
          width: maxTextWidth - 20,
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#4b5563',
          wrap: 'word',
          __zIndex: sectionIdx * 10 + bulletIdx + 1
        })
        yOffset += 28
      })
      
      yOffset += 16
    })
  }

  /**
   * Apply boxes layout
   */
  const applyBoxesLayout = (sections: any[], visualData: VisualData, layoutId: string) => {
    const templateMap: Record<string, string> = {
      'boxes-2': 'box-solid-2',
      'boxes-3': 'box-solid-3', 
      'boxes-4': 'box-outline-4'
    }
    
    const templateId = templateMap[layoutId] || 'box-solid-3'
    const template = getLayoutById(templateId)
    
    if (!template || !template.structure || !template.structure.boxes) {
      console.error('[applyBoxesLayout] Invalid template:', templateId)
      return applyBoxesLayoutFallback(sections, visualData, layoutId)
    }
    
    const boxes = template.structure.boxes
    const limitedSections = sections.slice(0, boxes.length)
    
    if (!visualData.shapes) visualData.shapes = []
    
    limitedSections.forEach((section, idx) => {
      const box = boxes[idx]
      if (!box) return
      
      visualData.shapes!.push({
        id: `box-${Date.now()}-${idx}`,
        type: 'rect',
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        fill: box.fill || 'transparent',
        stroke: box.stroke || '#e5e7eb',
        strokeWidth: box.strokeWidth || 1,
        cornerRadius: 8,
        __zIndex: idx * 10
      })
      
      if (section.title) {
        visualData.texts.push({
          id: `text-box-title-${Date.now()}-${idx}`,
          text: section.title,
          x: box.x + 16,
          y: box.y + 16,
          width: box.width - 32,
          fontSize: 18,
          fontWeight: 'bold',
          fill: '#1f2937',
          wrap: 'word',
          __zIndex: idx * 10 + 1
        })
      }
      
      let bulletY = box.y + 48
      const maxBulletY = box.y + box.height - 16
      const lineHeight = 24
      
      section.bullets.forEach((bullet: string, bulletIdx: number) => {
        if (bulletY + lineHeight > maxBulletY) return
        
        visualData.texts.push({
          id: `text-box-bullet-${Date.now()}-${idx}-${bulletIdx}`,
          text: `• ${bullet}`,
          x: box.x + 20,
          y: bulletY,
          width: box.width - 40,
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#4b5563',
          wrap: 'word',
          __zIndex: idx * 10 + bulletIdx + 2
        })
        bulletY += lineHeight
      })
    })
  }

  const applyBoxesLayoutFallback = (sections: any[], visualData: VisualData, layoutId: string) => {
    const cols = layoutId === 'boxes-4' ? 4 : (layoutId === 'boxes-3' ? 3 : 2)
    const canvasWidth = 960
    const canvasHeight = 540
    const boxWidth = (canvasWidth - 160 - (cols - 1) * 20) / cols
    const boxHeight = 140
    const startX = 80
    const startY = 100
    
    const maxRows = Math.floor((canvasHeight - startY - 20) / (boxHeight + 20))
    const maxSections = cols * maxRows
    const limitedSections = sections.slice(0, maxSections)
    
    limitedSections.forEach((section, idx) => {
      const col = idx % cols
      const row = Math.floor(idx / cols)
      const x = startX + col * (boxWidth + 20)
      const y = startY + row * (boxHeight + 20)
      
      if (!visualData.shapes) visualData.shapes = []
      visualData.shapes.push({
        id: `box-fallback-${Date.now()}-${idx}`,
        type: 'rect',
        x: x,
        y: y,
        width: boxWidth,
        height: boxHeight,
        fill: '#f8f9fa',
        stroke: '#e5e7eb',
        strokeWidth: 1,
        cornerRadius: 8,
        __zIndex: idx * 10
      })
      
      if (section.title) {
        visualData.texts.push({
          id: `text-box-title-${Date.now()}-${idx}`,
          text: section.title,
          x: x + 12,
          y: y + 12,
          width: boxWidth - 24,
          fontSize: 16,
          fontWeight: 'bold',
          fill: '#1f2937',
          wrap: 'word',
          __zIndex: idx * 10 + 1
        })
      }
      
      let bulletY = y + 40
      const maxBulletY = y + boxHeight - 10
      
      section.bullets.forEach((bullet: string, bulletIdx: number) => {
        if (bulletY + 22 > maxBulletY) return
        
        visualData.texts.push({
          id: `text-box-bullet-${Date.now()}-${idx}-${bulletIdx}`,
          text: `• ${bullet}`,
          x: x + 16,
          y: bulletY,
          width: boxWidth - 32,
          fontSize: 12,
          fontWeight: 'normal',
          fill: '#4b5563',
          wrap: 'word',
          __zIndex: idx * 10 + bulletIdx + 2
        })
        bulletY += 22
      })
    })
  }

  /**
   * Apply layout WITH content preservation
   */
  const applyLayoutToSlideWithContent = (layout: any, currentData: VisualData, themeColor: string): VisualData => {
    console.log('[applyLayoutToSlideWithContent] Applying layout:', layout.id)
    console.log('[applyLayoutToSlideWithContent] Current content:', {
      texts: currentData.texts?.length || 0,
      images: currentData.images?.length || 0,
      charts: currentData.charts?.length || 0
    })
    
    const structure = layout.structure
    const existingTexts = currentData.texts || []
    const existingImages = currentData.images || []
    const existingCharts = currentData.charts || []
    
    const textContents = existingTexts
      .map((t: any) => (t.text || t.content || '').trim())
      .filter((t: string) => t.length > 0)
    
    console.log('[applyLayoutToSlideWithContent] Extracted text contents:', textContents)
    
    const newData: VisualData = {
      texts: [],
      images: existingImages,
      rectangles: [],
      circles: [],
      charts: existingCharts
    }
    
    switch (structure.type) {
      case 'boxes':
        applyBoxesLayoutWithContent(structure, textContents, newData, themeColor, layout.id)
        break
      case 'bullets':
        applyBulletsLayoutWithContent(structure, textContents, newData, themeColor, layout.id)
        break
      case 'columns':
        applyColumnsLayoutWithContent(structure, textContents, newData, themeColor)
        break
      default:
        console.warn('[applyLayoutToSlideWithContent] Unknown layout type:', structure.type)
        return currentData
    }
    
    console.log('[applyLayoutToSlideWithContent] Layout applied, new data:', {
      texts: newData.texts.length,
      rectangles: newData.rectangles.length,
      circles: newData.circles.length,
      images: newData.images.length,
      charts: newData.charts.length
    })
    
    return newData
  }

  const applyBoxesLayoutWithContent = (structure: any, textContents: string[], newData: VisualData, themeColor: string, layoutId: string) => {
    const boxes = structure.boxes
    const baseZIndex = Date.now()
    let shapeZIndex = baseZIndex
    let textZIndex = baseZIndex + 10000
    
    console.log('[applyBoxesLayoutWithContent] Boxes:', boxes.length, 'Text contents:', textContents.length)
    
    boxes.forEach((box: any, boxIndex: number) => {
      newData.rectangles.push({
        id: `rect-box-${Date.now()}-${boxIndex}`,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        fill: box.fill || '#ffffff',
        stroke: box.stroke || '#e5e7eb',
        strokeWidth: box.strokeWidth || 2,
        cornerRadius: 8,
        draggable: true,
        __zIndex: shapeZIndex++
      })
      
      if (box.leftBorder) {
        newData.rectangles.push({
          id: `rect-border-left-${Date.now()}-${boxIndex}`,
          x: box.x,
          y: box.y,
          width: box.leftBorder.width,
          height: box.height,
          fill: box.leftBorder.color,
          cornerRadius: 8,
          draggable: true,
          __zIndex: shapeZIndex++
        })
      }
      
      if (box.topBorder) {
        newData.rectangles.push({
          id: `rect-border-top-${Date.now()}-${boxIndex}`,
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.topBorder.width,
          fill: box.topBorder.color,
          cornerRadius: 8,
          draggable: true,
          __zIndex: shapeZIndex++
        })
      }
      
      if (box.circle) {
        newData.circles.push({
          id: `circle-${Date.now()}-${boxIndex}`,
          x: box.circle.x,
          y: box.circle.y,
          radius: box.circle.radius,
          fill: box.circle.fill,
          draggable: true,
          __zIndex: shapeZIndex++
        })
      }
    })
    
    boxes.forEach((box: any, boxIndex: number) => {
      const contentStartY = box.circle ? box.y + 60 : box.y + 20
      const textContent = textContents[boxIndex] || `Box ${boxIndex + 1}`
      
      const maxTitleLength = 30
      let title, subtitle
      
      if (textContent.length > maxTitleLength) {
        const splitIndex = textContent.lastIndexOf(' ', maxTitleLength)
        title = textContent.substring(0, splitIndex > 0 ? splitIndex : maxTitleLength)
        subtitle = textContent.substring(splitIndex > 0 ? splitIndex + 1 : maxTitleLength)
      } else {
        title = textContent
        subtitle = ''
      }
      
      console.log(`[applyBoxesLayoutWithContent] Box ${boxIndex}: title="${title}", subtitle="${subtitle}"`)
      
      newData.texts.push({
        id: `text-box-title-${Date.now()}-${boxIndex}`,
        text: title,
        x: box.x + 20,
        y: contentStartY,
        width: box.width - 40,
        fontSize: 18,
        fontWeight: 'bold',
        fill: themeColor,
        align: 'center',
        draggable: true,
        __zIndex: textZIndex++
      })
      
      if (subtitle) {
        newData.texts.push({
          id: `text-box-subtitle-${Date.now()}-${boxIndex}`,
          text: subtitle,
          x: box.x + 20,
          y: contentStartY + 28,
          width: box.width - 40,
          fontSize: 13,
          fontWeight: 'normal',
          fill: '#6b7280',
          align: 'center',
          draggable: true,
          __zIndex: textZIndex++
        })
      }
    })
  }

  const applyBulletsLayoutWithContent = (structure: any, textContents: string[], newData: VisualData, themeColor: string, layoutId: string) => {
    const items = structure.items
    const baseZIndex = Date.now()
    let shapeZIndex = baseZIndex
    let textZIndex = baseZIndex + 10000
    
    console.log('[applyBulletsLayoutWithContent] Items:', items.length, 'Text contents:', textContents.length)
    
    const itemCount = Math.min(items.length, textContents.length || items.length)
    
    items.slice(0, itemCount).forEach((item: any, idx: number) => {
      if (item.iconStyle === 'circle') {
        const circleRadius = 12
        const circleX = item.x + 15
        const circleY = item.y
        
        newData.circles.push({
          id: `circle-bullet-${Date.now()}-${idx}`,
          x: circleX,
          y: circleY,
          radius: circleRadius,
          fill: 'transparent',
          stroke: item.iconColor,
          strokeWidth: 2,
          draggable: true,
          __zIndex: shapeZIndex++
        })
        
        newData.texts.push({
          id: `text-bullet-icon-${Date.now()}-${idx}`,
          text: item.icon,
          x: circleX,
          y: circleY,
          offsetX: 5,
          offsetY: 7,
          width: 14,
          fontSize: 14,
          fontWeight: '600',
          fill: item.iconColor,
          align: 'center',
          verticalAlign: 'middle',
          draggable: true,
          __zIndex: textZIndex++
        })
      } else {
        newData.texts.push({
          id: `text-bullet-icon-${Date.now()}-${idx}`,
          text: item.icon,
          x: item.x,
          y: item.y,
          width: 30,
          fontSize: item.icon.length > 1 ? 18 : 16,
          fontWeight: '600',
          fill: item.iconColor || themeColor,
          draggable: true,
          __zIndex: textZIndex++
        })
      }
      
      const textContent = textContents[idx] || `Item ${idx + 1}`
      
      console.log(`[applyBulletsLayoutWithContent] Bullet ${idx}: "${textContent}"`)
      
      newData.texts.push({
        id: `text-bullet-content-${Date.now()}-${idx}`,
        text: textContent,
        x: item.textX,
        y: item.y - 8,
        width: 350,
        fontSize: 16,
        fontWeight: 'normal',
        fill: themeColor,
        draggable: true,
        __zIndex: textZIndex++
      })
    })
  }

  const applyColumnsLayoutWithContent = (structure: any, textContents: string[], newData: VisualData, themeColor: string) => {
    const columns = structure.columns
    const baseZIndex = Date.now()
    let textZIndex = baseZIndex + 10000
    
    console.log('[applyColumnsLayoutWithContent] Columns:', columns.length, 'Text contents:', textContents.length)
    
    const textsPerColumn = Math.ceil(textContents.length / columns.length)
    
    columns.forEach((col: any, colIndex: number) => {
      const startIdx = colIndex * textsPerColumn
      const endIdx = Math.min(startIdx + textsPerColumn, textContents.length)
      const columnTexts = textContents.slice(startIdx, endIdx)
      
      console.log(`[applyColumnsLayoutWithContent] Column ${colIndex}: ${columnTexts.length} texts`)
      
      let yOffset = col.y + 20
      
      columnTexts.forEach((textContent, textIdx) => {
        newData.texts.push({
          id: `text-col-${Date.now()}-${colIndex}-${textIdx}`,
          text: textContent,
          x: col.x + 20,
          y: yOffset,
          width: parseInt(col.width) - 40,
          fontSize: 16,
          fontWeight: 'normal',
          fill: themeColor,
          draggable: true,
          __zIndex: textZIndex++
        })
        
        yOffset += 36
      })
      
      if (columnTexts.length === 0) {
        newData.texts.push({
          id: `text-col-placeholder-${Date.now()}-${colIndex}`,
          text: `Column ${colIndex + 1}`,
          x: col.x + 20,
          y: col.y + col.height / 2 - 10,
          width: parseInt(col.width) - 40,
          fontSize: 18,
          fontWeight: '500',
          fill: '#9ca3af',
          align: 'center',
          draggable: true,
          __zIndex: textZIndex++
        })
      }
    })
  }

  return {
    handleApplyLayout,
    stripMarkdown,
    parseTextIntoSections,
    applyTextWithSmartLineBreaking,
    applySimpleLineBreaking,
    applyBulletListLayout,
    applyBoxesLayout,
    applyLayoutToSlideWithContent
  }
}
