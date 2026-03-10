/**
 * Layout Application Logic
 * Apply smart layout templates to visual editor data
 */

/**
 * Get default content for layout boxes based on layout type
 * @param {string} layoutId - Layout template ID
 * @param {number} index - Box index (0-based)
 * @returns {string} Default text content
 */
function getDefaultBoxContent(layoutId, index) {
  // Define meaningful default content for different layout types
  const boxDefaults = {
    'box-solid-2': [
      'Feature\nCore benefit',
      'Advantage\nKey value'
    ],
    'box-solid-3': [
      'Point 1\nDetails', 
      'Point 2\nDetails', 
      'Point 3\nDetails'
    ],
    'box-outline-2': [
      'Option A\nDescription',
      'Option B\nDescription'
    ],
    'box-outline-4': [
      'Step 1\nStart',
      'Step 2\nWork',
      'Step 3\nCheck',
      'Step 4\nDone'
    ],
    'box-side-line-left': [
      'Key Point\nImportant info',
      'Takeaway\nMain idea',
      'Action\nNext step'
    ],
    'box-top-line': [
      'Feature\nWhat',
      'Benefit\nWhy',
      'Result\nOutcome'
    ],
    'box-circle-top': [
      'Idea 1\nConcept',
      'Idea 2\nConcept',
      'Idea 3\nConcept'
    ],
    'box-joined-2': [
      'Title\nOverview', 
      'Details\nContent'
    ],
    'box-alternating': [
      'Option A\nChoice 1',
      'Option B\nChoice 2'
    ]
  }
  
  return boxDefaults[layoutId]?.[index] || `Box ${index + 1}\nEdit me`
}

/**
 * Get default content for bullet items
 * @param {string} layoutId - Layout template ID
 * @param {number} index - Item index (0-based)
 * @returns {string} Default text content
 */
function getDefaultBulletContent(layoutId, index) {
  const bulletDefaults = {
    'bullet-standard': [
      'Key insight or main point to emphasize',
      'Supporting detail with relevant context', 
      'Additional evidence or clear example',
      'Summary takeaway or conclusion'
    ],
    'bullet-numbered': [
      'First: Understand the objective clearly',
      'Second: Plan your approach carefully', 
      'Third: Execute the steps precisely',
      'Fourth: Review results thoroughly'
    ],
    'bullet-checkmark': [
      'Project milestone completed on time',
      'Team goal successfully achieved',
      'Quality standards met and verified',
      'Delivery on schedule as planned'
    ],
    'bullet-arrow': [
      'Advance toward strategic goals',
      'Execute plans with precision', 
      'Achieve measurable outcomes',
      'Maintain forward momentum'
    ],
    'bullet-two-column': [
      'Primary benefit',
      'Secondary benefit', 
      'Core feature',
      'Added feature',
      'Expected result',
      'Bonus outcome'
    ],
    'bullet-emoji': [
      'Standout feature worth highlighting',
      'Significant advantage for end users',
      'Innovative approach to challenges', 
      'Delightful and smooth experience'
    ]
  }
  
  return bulletDefaults[layoutId]?.[index] || `Item ${index + 1}`
}

/**
 * Apply a layout template to current slide data
 * @param {Object} layout - Layout template from smartLayoutTemplates.js
 * @param {Object} currentData - Current slide visual data (texts, images, rectangles, circles)
 * @param {string} themeColor - Current theme color
 * @returns {Object} New visual data with layout applied
 */
export function applyLayoutToSlide(layout, currentData, themeColor = '#333') {
  const structure = layout.structure
  
  switch (structure.type) {
    case 'columns':
      return applyColumnsLayout(structure, currentData, themeColor, layout.id)
    case 'boxes':
      return applyBoxesLayout(structure, currentData, themeColor, layout.id)
    case 'bullets':
      return applyBulletsLayout(structure, currentData, themeColor, layout.id)
    default:
      return currentData
  }
}

/**
 * Apply columns layout
 */
function applyColumnsLayout(structure, currentData, themeColor, layoutId) {
  const newData = {
    texts: [],
    images: currentData.images || [],
    rectangles: [],
    circles: []
  }
  
  const columns = structure.columns
  const existingTexts = currentData.texts || []
  
  // Distribute existing texts across columns
  const textsPerColumn = Math.ceil(existingTexts.length / columns.length)
  
  // Use separate z-index ranges to GUARANTEE texts are on top
  const baseZIndex = Date.now()
  let shapeZIndex = baseZIndex
  let textZIndex = baseZIndex + 10000
  
  // PHASE 1: Create all column rectangles
  columns.forEach((col, colIndex) => {
    // Add column container rectangle (semi-transparent)
    const colRectId = `rect-column-${Date.now()}-${colIndex}`
    newData.rectangles.push({
      id: colRectId,
      x: col.x,
      y: col.y,
      width: parseInt(col.width),
      height: col.height,
      fill: 'rgba(66, 133, 244, 0.05)',
      stroke: '#e5e7eb',
      strokeWidth: 1,
      cornerRadius: 8,
      draggable: true,
      name: colRectId,
      __zIndex: shapeZIndex++
    })
  })
  
  // PHASE 2: Create all column texts (on top)
  columns.forEach((col, colIndex) => {
    // Place texts in this column
    const startIdx = colIndex * textsPerColumn
    const endIdx = Math.min(startIdx + textsPerColumn, existingTexts.length)
    const columnTexts = existingTexts.slice(startIdx, endIdx)
    
    columnTexts.forEach((text, idx) => {
      const textId = `text-column-${Date.now()}-${colIndex}-${idx}`
      newData.texts.push({
        ...text,
        id: textId,
        x: col.x + 20,
        y: col.y + 20 + (idx * 60),
        width: parseInt(col.width) - 40,
        fontSize: text.fontSize || 16,
        fontWeight: text.fontWeight || '400',
        fontFamily: text.fontFamily || 'Arial, sans-serif',
        fill: text.fill || themeColor,
        draggable: true,
        name: textId,
        __zIndex: textZIndex++
      })
    })
    
    // Add placeholder if no texts in this column
    if (columnTexts.length === 0) {
      const textId = `text-column-${Date.now()}-${colIndex}-placeholder`
      newData.texts.push({
        id: textId,
        x: col.x + 20,
        y: col.y + col.height / 2 - 10,
        width: parseInt(col.width) - 40,
        text: `Column ${colIndex + 1}`,
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Arial, sans-serif',
        fill: '#9ca3af',
        align: 'center',
        draggable: true,
        name: textId,
        __zIndex: textZIndex++
      })
    }
  })
  
  return newData
}

/**
 * Apply boxes layout
 */
function applyBoxesLayout(structure, currentData, themeColor, layoutId) {
  const newData = {
    texts: [],
    images: currentData.images || [],
    rectangles: [],
    circles: []
  }
  
  const boxes = structure.boxes
  const existingTexts = currentData.texts || []
  
  // For box layouts, always use placeholder text for cleaner results
  // Users can edit the text after applying the layout
  const useExistingContent = false  // Set to true to preserve old content
  
  // Use separate z-index ranges to GUARANTEE texts are on top
  const baseZIndex = Date.now()
  let shapeZIndex = baseZIndex  // Shapes: baseZIndex + 0 to N
  let textZIndex = baseZIndex + 10000  // Texts: baseZIndex + 10000 onwards
  
  console.log(`[Layout] Starting z-index - shapes: ${shapeZIndex}, texts: ${textZIndex}`)
  
  // PHASE 1: Create all rectangles and circles (shapes)
  boxes.forEach((box, boxIndex) => {
    // Create the main box rectangle
    const boxRectId = `rect-${Date.now()}-${boxIndex}`
    const boxRect = {
      id: boxRectId,
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      fill: box.fill || '#ffffff',
      stroke: box.stroke || 'none',
      strokeWidth: box.strokeWidth || 0,
      cornerRadius: 8,
      draggable: true,
      name: boxRectId,
      __zIndex: shapeZIndex++
    }
    newData.rectangles.push(boxRect)
    
    // Add border decorations
    if (box.leftBorder) {
      const borderRectId = `rect-border-${Date.now()}-${boxIndex}-left`
      newData.rectangles.push({
        id: borderRectId,
        x: box.x,
        y: box.y,
        width: box.leftBorder.width,
        height: box.height,
        fill: box.leftBorder.color,
        stroke: 'none',
        cornerRadius: 8,
        draggable: true,
        name: borderRectId,
        __zIndex: shapeZIndex++
      })
    }
    
    if (box.topBorder) {
      const borderRectId = `rect-border-${Date.now()}-${boxIndex}-top`
      newData.rectangles.push({
        id: borderRectId,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.topBorder.width,
        fill: box.topBorder.color,
        stroke: 'none',
        cornerRadius: 8,
        draggable: true,
        name: borderRectId,
        __zIndex: shapeZIndex++
      })
    }
    
    if (box.circle) {
      const circleId = `circle-${Date.now()}-${boxIndex}`
      newData.circles.push({
        id: circleId,
        x: box.circle.x,
        y: box.circle.y,
        radius: box.circle.radius,
        fill: box.circle.fill,
        stroke: 'none',
        draggable: true,
        name: circleId,
        __zIndex: shapeZIndex++
      })
    }
  })
  
  // PHASE 2: Create all texts (on top of all shapes)
  boxes.forEach((box, boxIndex) => {
    const contentStartY = box.circle ? box.y + 60 : box.y + 20
    
    // Get default placeholder content
    const defaultText = getDefaultBoxContent(layoutId, boxIndex)
    
    // Split by newline to create separate title and subtitle
    const lines = defaultText.split('\n')
    const title = lines[0] || 'Title'
    const subtitle = lines[1] || ''
    
    // Add title text (larger, bold)
    const titleId = `text-${Date.now()}-${boxIndex}-title`
    const titleZIndex = textZIndex++
    
    console.log(`[Layout] Box ${boxIndex}: Creating title "${title}" at (${box.x + 20}, ${contentStartY}), z-index=${titleZIndex}`)
    
    newData.texts.push({
      id: titleId,
      x: box.x + 20,
      y: contentStartY,
      width: box.width - 40,
      text: title,
      fontSize: 20,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      fill: themeColor,
      align: 'center',
      draggable: true,
      name: titleId,
      __zIndex: titleZIndex
    })
    
    // Add subtitle text if exists (smaller, normal weight)
    if (subtitle) {
      const subtitleId = `text-${Date.now()}-${boxIndex}-subtitle`
      const subtitleZIndex = textZIndex++
      
      console.log(`[Layout] Box ${boxIndex}: Creating subtitle "${subtitle}" at (${box.x + 20}, ${contentStartY + 30}), z-index=${subtitleZIndex}`)
      
      newData.texts.push({
        id: subtitleId,
        x: box.x + 20,
        y: contentStartY + 30,
        width: box.width - 40,
        text: subtitle,
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'Arial, sans-serif',
        fill: '#6b7280',
        align: 'center',
        draggable: true,
        name: subtitleId,
        __zIndex: subtitleZIndex
      })
    }
  })
  
  console.log(`[Layout] Created layout:`, {
    rectangles: newData.rectangles.length,
    texts: newData.texts.length,
    circles: newData.circles.length,
    textZIndexRange: newData.texts.map(t => t.__zIndex),
    rectZIndexRange: newData.rectangles.map(r => r.__zIndex)
  })
  
  return newData
}

/**
 * Apply bullets layout
 */
function applyBulletsLayout(structure, currentData, themeColor, layoutId) {
  const newData = {
    texts: [],
    images: currentData.images || [],
    rectangles: [],
    circles: []
  }
  
  const items = structure.items
  const existingTexts = currentData.texts || []
  
  // Use separate z-index ranges (though bullets don't have rectangles, keep consistent)
  const baseZIndex = Date.now()
  let shapeZIndex = baseZIndex  // For circles
  let textZIndex = baseZIndex + 10000  // For all text elements
  
  // Use existing text content or create placeholders
  items.forEach((item, idx) => {
    // Add bullet icon/number
    if (item.iconStyle === 'circle') {
      // Numbered circle bullet
      const circleId = `circle-bullet-${Date.now()}-${idx}`
      const circleRadius = 12
      const circleX = item.x + 15
      const circleY = item.y
      
      newData.circles.push({
        id: circleId,
        x: circleX,
        y: circleY,
        radius: circleRadius,
        fill: 'transparent',
        stroke: item.iconColor,
        strokeWidth: 2,
        draggable: true,
        name: circleId,
        __zIndex: shapeZIndex++
      })
      
      // Position text to be perfectly centered in circle
      // In Konva, text (x,y) is top-left corner of text box
      // To center text in circle, we use offsetX/offsetY to shift the anchor point
      const iconTextId = `text-bullet-icon-${Date.now()}-${idx}`
      const fontSize = 14
      
      newData.texts.push({
        id: iconTextId,
        x: circleX,
        y: circleY,
        offsetX: 5,
        offsetY: 7,
        width: fontSize,
        text: item.icon,
        fontSize: fontSize,
        fontWeight: '600',
        fontFamily: 'Arial, sans-serif',
        fill: item.iconColor,
        align: 'center',
        verticalAlign: 'middle',
        draggable: true,
        name: iconTextId,
        __zIndex: textZIndex++
      })
    } else {
      // Regular bullet/icon
      const iconTextId = `text-bullet-icon-${Date.now()}-${idx}`
      newData.texts.push({
        id: iconTextId,
        x: item.x,
        y: item.y,
        width: 30,
        text: item.icon,
        fontSize: item.icon.length > 1 ? 18 : 16, // Larger for emoji
        fontWeight: '600',
        fontFamily: 'Arial, sans-serif',
        fill: item.iconColor || themeColor,
        align: 'left',
        draggable: true,
        name: iconTextId,
        __zIndex: textZIndex++
      })
    }
    
    // Add text content - use default if existing text looks like a placeholder
    const existingText = existingTexts[idx]?.text || ''
    const isPlaceholder = !existingText || existingText.trim() === '' || 
      /^(Item|Text|Point|\d+)\s*\d*$/.test(existingText.trim())
    const textContent = isPlaceholder ? getDefaultBulletContent(layoutId, idx) : existingText
    
    const contentTextId = `text-bullet-content-${Date.now()}-${idx}`
    newData.texts.push({
      id: contentTextId,
      x: item.textX,
      y: item.y - 8,
      width: 350,
      text: textContent,
      fontSize: 16,
      fontWeight: '400',
      fontFamily: 'Arial, sans-serif',
      fill: themeColor,
      align: 'left',
      draggable: true,
      name: contentTextId,
      __zIndex: textZIndex++
    })
  })
  
  return newData
}
