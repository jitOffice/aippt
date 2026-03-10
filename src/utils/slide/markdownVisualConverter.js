/**
 * Markdown ↔ Visual Converter Utilities
 * Handles bidirectional conversion between markdown and visual components
 */

/**
 * Parse markdown content to visual components
 * Supports: Text, Rectangles, Circles, Images with full positioning and styling
 * Now supports inline markdown: **bold**, *italic*, ~~strikethrough~~, `code`
 * @param {string} markdownContent - The markdown content to parse
 * @param {string} themeColor - The theme text color (default: '#333')
 */
export function parseMarkdownToVisual(markdownContent, themeColor = '#333') {
  const texts = []
  const rectangles = []
  const circles = []
  const images = []
  const charts = []
  let yOffset = 50

  // Extract charts (if any) and only parse non-chart content as text/shapes
  let contentToParse = markdownContent || ''

  try {
    // Process all charts in the markdown
    while (true) {
      const chartMarker = contentToParse.match(/<!-- CHART:(\w+) -->/)
      if (!chartMarker) break // No more charts
      
      const markerIndex = contentToParse.indexOf(chartMarker[0])
      const beforeMarker = contentToParse.substring(0, markerIndex)
      const afterMarker = contentToParse.substring(markerIndex + chartMarker[0].length).trim()

      // Try to parse position metadata
      let chartPos = null
      const posMatch = afterMarker.match(/<!-- CHART_POS: (\{.*?\}) -->/)
      console.log('[markdownVisualConverter] Looking for CHART_POS in:', afterMarker.substring(0, 200))
      console.log('[markdownVisualConverter] posMatch:', posMatch)
      
      if (posMatch) {
        try {
          chartPos = JSON.parse(posMatch[1])
          console.log('[markdownVisualConverter] Parsed chartPos:', chartPos)
        } catch (e) {
          console.error('Failed to parse chart position:', e)
        }
      } else {
        console.warn('[markdownVisualConverter] No CHART_POS found, using defaults')
      }

      // Try to parse JSON after marker
      // Skip CHART_POS comment if present
      let jsonSource = afterMarker
      if (posMatch) {
        // Remove the CHART_POS comment from the beginning
        jsonSource = afterMarker.replace(/^<!-- CHART_POS:.*?-->\s*/, '')
      }
      
      // Match JSON until next chart marker or end
      const jsonMatch = jsonSource.match(/^\{[\s\S]*?\}(?=\s*(?:<!-- CHART:|$))/)
      console.log('[markdownVisualConverter] jsonSource:', jsonSource.substring(0, 100))
      console.log('[markdownVisualConverter] jsonMatch:', jsonMatch ? 'Found' : 'Not found')
      
      if (jsonMatch) {
        try {
          // First, try to parse the JSON as-is (it should be valid)
          let chartOption
          try {
            chartOption = JSON.parse(jsonMatch[0])
          } catch (firstError) {
            console.warn('[markdownVisualConverter] Initial JSON parse failed, attempting to clean:', firstError.message)
            
            // If initial parse fails, try cleaning control characters
            // This handles cases where markdown storage/retrieval corrupted the JSON
            let cleanedJson = jsonMatch[0]
              // Replace unescaped newlines in string values
              .replace(/"([^"]*?)\n([^"]*?)"/g, (match, before, after) => {
                return `"${before}\\n${after}"`
              })
              // Replace unescaped tabs
              .replace(/"([^"]*?)\t([^"]*?)"/g, (match, before, after) => {
                return `"${before}\\t${after}"`
              })
            
            console.log('[markdownVisualConverter] Attempting parse with cleaned JSON')
            chartOption = JSON.parse(cleanedJson)
          }
          const chartId = `chart-md-${Date.now()}-${charts.length}`
          const chartObj = {
            id: chartId,
            x: chartPos?.x || 160,
            y: chartPos?.y || 180,
            width: chartPos?.width || 640,
            height: chartPos?.height || 320,
            option: chartOption,
            type: chartMarker[1] || 'bar',
            draggable: true,
            name: chartId,
            __type: 'chart',
            __zIndex: chartPos?.__zIndex ?? (texts.length + rectangles.length + circles.length + images.length + charts.length)
          }
          console.log('[markdownVisualConverter] Created chart:', chartObj)
          charts.push(chartObj)
          
          // Calculate the end position of the entire chart block
          // Find where the JSON ends in the original afterMarker
          const jsonStartInAfterMarker = afterMarker.indexOf(jsonMatch[0])
          const jsonEndInAfterMarker = jsonStartInAfterMarker + jsonMatch[0].length
          
          // Remove everything from chart marker to end of JSON
          contentToParse = beforeMarker + afterMarker.substring(jsonEndInAfterMarker).trim()
        } catch (e) {
          console.error('Failed to parse chart JSON in markdownVisualConverter:', e)
          // Skip this chart and try to continue
          const jsonStartInAfterMarker = afterMarker.indexOf(jsonMatch[0])
          const jsonEndInAfterMarker = jsonStartInAfterMarker + jsonMatch[0].length
          contentToParse = beforeMarker + afterMarker.substring(jsonEndInAfterMarker).trim()
        }
      } else {
        console.warn('[markdownVisualConverter] No JSON match found for chart')
        // Skip this marker and continue
        contentToParse = beforeMarker + afterMarker
        break
      }
    }
  } catch (e) {
    console.error('Error while extracting charts from markdown:', e)
  }

  // Extract videos from markdown comments
  const videos = []
  try {
    const videoRegex = /<!-- VIDEO -->\s*<!-- VIDEO_POS: (\{.*?\}) -->/gs
    let videoMatch
    
    while ((videoMatch = videoRegex.exec(contentToParse)) !== null) {
      try {
        const videoPos = JSON.parse(videoMatch[1])
        const videoId = videoPos.id || `video-md-${Date.now()}-${videos.length}`
        
        const videoObj = {
          id: videoId,
          x: videoPos.x || 240,
          y: videoPos.y || 135,
          width: videoPos.width || 480,
          height: videoPos.height || 270,
          url: videoPos.url,
          embedUrl: videoPos.embedUrl,
          provider: videoPos.provider || 'custom',
          isLocal: videoPos.isLocal || false,
          isAudio: videoPos.isAudio || false,
          fileName: videoPos.fileName,
          fileType: videoPos.fileType,
          draggable: true,
          name: videoId,
          __type: 'video',
          __zIndex: videoPos.__zIndex ?? (texts.length + rectangles.length + circles.length + images.length + charts.length + videos.length)
        }
        
        console.log('[markdownVisualConverter] Parsed video:', videoObj)
        videos.push(videoObj)
        
        // Remove video comments from content
        contentToParse = contentToParse.replace(videoMatch[0], '')
      } catch (e) {
        console.error('Failed to parse video from markdown:', e)
      }
    }
    
    if (videos.length > 0) {
      console.log('[markdownVisualConverter] Parsed videos:', videos.length)
    }
  } catch (e) {
    console.error('Error while extracting videos from markdown:', e)
  }

  // Extract tables from markdown comments
  const tables = []
  try {
    // Count total TABLE markers before parsing
    const totalTableMarkers = (contentToParse.match(/<!-- TABLE -->/g) || []).length
    console.log('[markdownVisualConverter] Searching for tables in markdown...')
    console.log('[markdownVisualConverter] Total TABLE markers found:', totalTableMarkers)
    
    // Use [\s\S] instead of . to match newlines in large JSON objects
    const tableRegex = /<!-- TABLE -->\s*<!-- TABLE_POS: (\{[\s\S]*?\}) -->/g
    let tableMatch
    
    while ((tableMatch = tableRegex.exec(contentToParse)) !== null) {
      try {
        const tablePos = JSON.parse(tableMatch[1])
        const tableId = tablePos.id || `table-md-${Date.now()}-${tables.length}`
        
        console.log('[markdownVisualConverter] Found table in markdown:', tableId)
        
        const tableObj = {
          id: tableId,
          x: tablePos.x || 240,
          y: tablePos.y || 135,
          width: tablePos.width || 480,
          height: tablePos.height || 120,
          rows: tablePos.rows || 3,
          cols: tablePos.cols || 4,
          cells: tablePos.cells || [],
          cellWidth: tablePos.cellWidth || 120,
          cellHeight: tablePos.cellHeight || 40,
          hasHeader: tablePos.hasHeader ?? true,
          headerBg: tablePos.headerBg || '#f3f4f6',
          borderColor: tablePos.borderColor || '#e5e7eb',
          alternateRows: tablePos.alternateRows ?? true,
          draggable: true,
          name: tableId,
          __type: 'table',
          __zIndex: tablePos.__zIndex ?? (texts.length + rectangles.length + circles.length + images.length + charts.length + videos.length + tables.length)
        }
        
        console.log('[markdownVisualConverter] Parsed table:', tableObj)
        console.log('[markdownVisualConverter] Table cells loaded:', tableObj.cells)
        tables.push(tableObj)
        
        // Remove table comments from content
        contentToParse = contentToParse.replace(tableMatch[0], '')
      } catch (e) {
        console.error('Failed to parse table from markdown:', e)
      }
    }
    
    if (tables.length > 0) {
      console.log('[markdownVisualConverter] Parsed tables:', tables.length)
    }
  } catch (e) {
    console.error('Error while extracting tables from markdown:', e)
  }

  const lines = contentToParse.split('\n')
    
  // Group consecutive text lines that should be merged into multiline text
  const textGroups = []
  let currentGroup = []
  let inSpecialBlock = false // Track if we're inside a special block
  let specialBlockGroup = []
    
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
      
    // Check if this line starts a special block
    if (line === '<!-- RECTANGLES_START -->' || line === '<!-- CIRCLES_START -->' || line === '<!-- IMAGES_START -->') {
      // If we have accumulated text lines, save them first
      if (currentGroup.length > 0) {
        textGroups.push(currentGroup)
        currentGroup = []
      }
      inSpecialBlock = true
      specialBlockGroup = [line]
    }
    // Check if this line ends a special block
    else if (line === '<!-- RECTANGLES_END -->' || line === '<!-- CIRCLES_END -->' || line === '<!-- IMAGES_END -->') {
      specialBlockGroup.push(line)
      textGroups.push(specialBlockGroup)
      specialBlockGroup = []
      inSpecialBlock = false
    }
    // If we're inside a special block, accumulate lines
    else if (inSpecialBlock) {
      specialBlockGroup.push(line)
    }
    // If it's a text line (not a special comment)
    else if (line && !line.startsWith('<!--')) {
      currentGroup.push(line)
    } else {
      // If we have accumulated text lines, save them as a group
      if (currentGroup.length > 0) {
        textGroups.push(currentGroup)
        currentGroup = []
      }
      // Also save the special line (like TEXT_POS comments)
      if (line) {
        textGroups.push([line])
      }
    }
  }
    
  // Don't forget the last group
  if (currentGroup.length > 0) {
    textGroups.push(currentGroup)
  }
    
  let i = 0
    
  while (i < textGroups.length) {
    const group = textGroups[i]
    const firstLine = group[0]
      
    // Handle special blocks (rectangles, circles, images)
    if (firstLine === '<!-- RECTANGLES_START -->') {
      console.log('[parseMarkdownToVisual] Found RECTANGLES_START block with', group.length, 'lines')
      // Parse rectangle blocks
      for (let j = 1; j < group.length - 1; j++) {
        const line = group[j]
        if (line.startsWith('<!-- RECT:')) {
          try {
            const jsonStr = line.substring(10, line.length - 4) // Remove <!-- RECT: and -->
            const rectData = JSON.parse(jsonStr)
            const rect = {
              id: `rect-md-${Date.now()}-${rectangles.length}`,
              ...rectData,
              draggable: true,
              name: `rect-md-${Date.now()}-${rectangles.length}`
            }
            rectangles.push(rect)
            console.log('[parseMarkdownToVisual] Parsed rectangle:', rect)
          } catch (e) {
            console.warn('[parseMarkdownToVisual] Failed to parse rectangle:', line, e)
          }
        }
      }
      console.log('[parseMarkdownToVisual] Total rectangles parsed:', rectangles.length)
      i++
      continue
    } else if (firstLine === '<!-- CIRCLES_START -->') {
      // Parse circle blocks
      for (let j = 1; j < group.length - 1; j++) {
        const line = group[j]
        if (line.startsWith('<!-- CIRCLE:')) {
          try {
            const jsonStr = line.substring(12, line.length - 4) // Remove <!-- CIRCLE: and -->
            const circleData = JSON.parse(jsonStr)
            circles.push({
              id: `circle-md-${Date.now()}-${circles.length}`,
              ...circleData,
              draggable: true,
              name: `circle-md-${Date.now()}-${circles.length}`
            })
          } catch (e) {
            console.warn('[parseMarkdownToVisual] Failed to parse circle:', line, e)
          }
        }
      }
      i++
      continue
    } else if (firstLine === '<!-- IMAGES_START -->') {
      // Parse image blocks
      for (let j = 1; j < group.length - 1; j++) {
        const line = group[j]
        if (line.startsWith('<!-- IMAGE:')) {
          try {
            const jsonStr = line.substring(11, line.length - 4) // Remove <!-- IMAGE: and -->
            const imageData = JSON.parse(jsonStr)
            images.push({
              id: `image-md-${Date.now()}-${images.length}`,
              ...imageData,
              draggable: true,
              name: `image-md-${Date.now()}-${images.length}`
            })
          } catch (e) {
            console.warn('[parseMarkdownToVisual] Failed to parse image:', line, e)
          }
        }
      }
      i++
      continue
    }
      
    // Handle text groups
    if (group.length > 0 && !firstLine.startsWith('<!--')) {
      // Join all lines in the group with newlines
      const fullText = group.join('\n')
        
      let fontSize = 24
      let fontWeight = 'normal'
      let fontStyle = 'normal'
      let textDecoration = ''
      let color = themeColor
      let xPos = 80
      let yPos = yOffset
        
      // Parse the first line for styling (headers, lists, etc.)
      let firstLineText = group[0]
        
      // Block-level markdown parsing
      if (firstLineText.startsWith('# ')) {
        firstLineText = firstLineText.substring(2)
        fontSize = 48
        fontWeight = 'bold'
        color = '#1f2937'
      } else if (firstLineText.startsWith('## ')) {
        firstLineText = firstLineText.substring(3)
        fontSize = 36
        fontWeight = 'bold'
        color = '#374151'
      } else if (firstLineText.startsWith('### ')) {
        firstLineText = firstLineText.substring(4)
        fontSize = 28
        fontWeight = 'bold'
        color = '#4b5563'
      } else if (firstLineText.startsWith('- ') || firstLineText.startsWith('* ')) {
        // Update all lines to use bullet points
        const updatedLines = group.map(line => {
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return '• ' + line.substring(2)
          }
          return line
        })
        firstLineText = updatedLines[0]
        fontSize = 20
        color = '#6b7280'
      } else if (/^\d+\.\s/.test(firstLineText)) {
        // Numbered list - keep numbering but adjust styling
        fontSize = 18
        color = '#374151'
      }
        
      // Reconstruct full text with parsed first line
      const reconstructedLines = [...group]
      reconstructedLines[0] = firstLineText
      const finalText = reconstructedLines.join('\n')
        
      // Parse inline markdown
      let processedText = finalText
        
      // **bold**
      if (processedText.includes('**')) {
        const boldMatch = processedText.match(/\*\*(.+?)\*\*/)
        if (boldMatch) {
          processedText = processedText.replace(/\*\*(.+?)\*\*/g, '$1')
          fontWeight = 'bold'
        }
      }
        
      // *italic*
      if (processedText.includes('*') && !finalText.includes('**')) {
        const italicMatch = processedText.match(/\*(.+?)\*/)
        if (italicMatch) {
          processedText = processedText.replace(/\*(.+?)\*/g, '$1')
          fontStyle = 'italic'
        }
      }
        
      // ~~strikethrough~~
      if (processedText.includes('~~')) {
        const strikeMatch = processedText.match(/~~(.+?)~~/)
        if (strikeMatch) {
          processedText = processedText.replace(/~~(.+?)~~/g, '$1')
          textDecoration = 'line-through'
        }
      }
        
      // `code`
      if (processedText.includes('`')) {
        const codeMatch = processedText.match(/`(.+?)`/)
        if (codeMatch) {
          processedText = processedText.replace(/`(.+?)`/g, '$1')
          fontSize = Math.floor(fontSize * 0.9)
          color = '#d73a49'
        }
      }
        
      // Check for position metadata
      let hasMetadata = false
      if (i + 1 < textGroups.length) {
        const nextGroup = textGroups[i + 1]
        if (nextGroup.length === 1 && nextGroup[0].trim().startsWith('<!-- TEXT_POS: ')) {
          const metaLine = nextGroup[0].trim()
          const jsonStr = metaLine.substring(15, metaLine.length - 4)
          try {
            const posData = JSON.parse(jsonStr)
            xPos = posData.x
            yPos = posData.y
            fontSize = posData.fontSize || fontSize
            fontWeight = posData.fontWeight || fontWeight
            fontStyle = posData.fontStyle || fontStyle
            textDecoration = posData.textDecoration || textDecoration
            color = posData.fill || color
              
            texts.push({
              id: `text-md-${Date.now()}-${texts.length}`,
              x: xPos,
              y: yPos,
              text: processedText,
              fontSize: fontSize,
              fontWeight: fontWeight,
              fontFamily: 'Arial, sans-serif',
              fontStyle: fontStyle,
              textDecoration: textDecoration,
              fill: color,
              draggable: true,
              name: `text-md-${texts.length}`,
              __zIndex: posData.__zIndex !== undefined ? posData.__zIndex : texts.length
            })
              
            hasMetadata = true
            i++ // Skip metadata group
          } catch (e) {
            console.error('Failed to parse text position:', e)
          }
        }
      }
        
      if (!hasMetadata) {
        texts.push({
          id: `text-md-${Date.now()}-${texts.length}`,
          x: xPos,
          y: yPos,
          text: processedText,
          fontSize: fontSize,
          fontWeight: fontWeight,
          fontFamily: 'Arial, sans-serif',
          fontStyle: fontStyle,
          textDecoration: textDecoration,
          fill: color,
          draggable: true,
          name: `text-md-${texts.length}`,
          __zIndex: texts.length
        })
          
        // Auto-increment y offset
        yOffset += (group.length * fontSize * 1.5) + 20
      }
        
      i++
      continue
    }
      
    i++
  }
  
  return { texts, images, rectangles, circles, charts, videos, tables }
}

/**
 * Convert visual components to markdown with full metadata
 * Preserves inline styles in metadata for round-trip conversion
 */
export function convertVisualToMarkdown(visualData) {
  const lines = []
  
  // Sort texts by y position (top to bottom)
  const sortedTexts = [...(visualData.texts || [])].sort((a, b) => a.y - b.y)
  
  sortedTexts.forEach(text => {
    // Skip if text content is missing
    if (!text.text || typeof text.text !== 'string') {
      console.warn('[convertVisualToMarkdown] Skipping text with invalid content:', text);
      return;
    }
    
    let markdown = text.text
    
    // Apply inline markdown formatting based on properties
    if (text.fontWeight === 'bold' && text.fontSize < 26) {
      // Only apply ** if not a header (headers are naturally bold)
      markdown = `**${markdown}**`
    }
    
    if (text.fontStyle === 'italic') {
      markdown = `*${markdown}*`
    }
    
    if (text.textDecoration === 'line-through') {
      markdown = `~~${markdown}~~`
    }
    
    if (text.fill === '#d73a49') {
      // Inline code color
      markdown = `\`${markdown}\``
    }
    
    // Convert to block-level markdown syntax based on font size
    if (text.fontSize >= 44) {
      markdown = '# ' + markdown
    } else if (text.fontSize >= 32) {
      markdown = '## ' + markdown
    } else if (text.fontSize >= 26) {
      markdown = '### ' + markdown
    } else if (markdown.startsWith('• ')) {
      markdown = '- ' + markdown.substring(2)
    }
    
    lines.push(markdown)
    
    // Add position metadata with all style properties
    const metadata = {
      x: text.x,
      y: text.y,
      fontSize: text.fontSize,
      fontWeight: text.fontWeight,
      fill: text.fill
    }
    
    if (text.fontStyle && text.fontStyle !== 'normal') {
      metadata.fontStyle = text.fontStyle
    }
    
    if (text.textDecoration) {
      metadata.textDecoration = text.textDecoration
    }
    
    // CRITICAL: Preserve z-index for proper layering
    if (text.__zIndex !== undefined) {
      metadata.__zIndex = text.__zIndex
    }
    
    // Preserve offset for precise positioning (e.g., centered text in circles)
    if (text.offsetX !== undefined) {
      metadata.offsetX = text.offsetX
    }
    if (text.offsetY !== undefined) {
      metadata.offsetY = text.offsetY
    }
    
    lines.push(`<!-- TEXT_POS: ${JSON.stringify(metadata)} -->`)
  })
  
  // Serialize rectangles
  if (visualData.rectangles?.length > 0) {
    console.log('[convertVisualToMarkdown] Serializing rectangles:', visualData.rectangles.length)
    lines.push('')
    lines.push('<!-- RECTANGLES_START -->')
    visualData.rectangles.forEach(rect => {
      const rectData = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        fill: rect.fill,
        stroke: rect.stroke,
        strokeWidth: rect.strokeWidth,
        cornerRadius: rect.cornerRadius,
        dash: rect.dash
      }
      // Preserve gradient properties if present
      if (rect.fillLinearGradientStartPoint) {
        rectData.fillLinearGradientStartPoint = rect.fillLinearGradientStartPoint
        rectData.fillLinearGradientEndPoint = rect.fillLinearGradientEndPoint
        rectData.fillLinearGradientColorStops = rect.fillLinearGradientColorStops
      }
      // Preserve z-index for proper layering
      if (rect.__zIndex !== undefined) {
        rectData.__zIndex = rect.__zIndex
      }
      lines.push(`<!-- RECT: ${JSON.stringify(rectData)} -->`)
      console.log('[convertVisualToMarkdown] Added rectangle:', rectData)
    })
    lines.push('<!-- RECTANGLES_END -->')
    console.log('[convertVisualToMarkdown] Rectangles serialization complete')
  } else {
    console.log('[convertVisualToMarkdown] No rectangles to serialize')
  }
  
  // Serialize circles
  if (visualData.circles?.length > 0) {
    lines.push('')
    lines.push('<!-- CIRCLES_START -->')
    visualData.circles.forEach(circle => {
      const circleData = {
        x: circle.x,
        y: circle.y,
        radius: circle.radius,
        fill: circle.fill,
        stroke: circle.stroke,
        strokeWidth: circle.strokeWidth
      }
      // Preserve z-index for proper layering
      if (circle.__zIndex !== undefined) {
        circleData.__zIndex = circle.__zIndex
      }
      lines.push(`<!-- CIRCLE: ${JSON.stringify(circleData)} -->`)
    })
    lines.push('<!-- CIRCLES_END -->')
  }
  
  // Serialize images
  if (visualData.images?.length > 0) {
    lines.push('')
    lines.push('<!-- IMAGES_START -->')
    visualData.images.forEach(img => {
      // Handle both GIF (img.src) and non-GIF (img.image.src) formats
      const imgSrc = img.isGif 
        ? img.src  // GIF: direct src property
        : (img.image?.src || img.src || '')  // Non-GIF: img.image.src or fallback to img.src
      
      console.log('[convertVisualToMarkdown] Serializing image:', {
        id: img.id,
        isGif: img.isGif,
        imgSrc: imgSrc,
        hasImageObj: !!img.image,
        hasSrc: !!img.src
      })
      
      const imgData = JSON.stringify({
        x: img.x,
        y: img.y,
        width: img.width,
        height: img.height,
        src: imgSrc,
        isGif: img.isGif || false  // Preserve GIF flag
      })
      lines.push(`<!-- IMAGE: ${imgData} -->`)
    })
    lines.push('<!-- IMAGES_END -->')
  }

  // Serialize charts (one or many)
  if (visualData.charts?.length > 0) {
    // For now, serialize each chart as a separate CHART block with position metadata
    visualData.charts.forEach((chart, index) => {
      if (!chart.option) return
      lines.push('')
      const chartType = chart.type || chart.chartType || 'bar'
      
      // Create metadata with position and size
      const chartMeta = {
        x: chart.x,
        y: chart.y,
        width: chart.width,
        height: chart.height
      }
      
      // Preserve z-index for proper layering
      if (chart.__zIndex !== undefined) {
        chartMeta.__zIndex = chart.__zIndex
      }
      
      // Stringify the chart option with proper escaping
      // Use JSON.stringify which automatically escapes control characters
      const optionString = JSON.stringify(chart.option)
      
      // Verify the JSON is valid before adding to markdown
      try {
        JSON.parse(optionString) // Test parse
        lines.push(`<!-- CHART:${chartType} -->`)
        lines.push(`<!-- CHART_POS: ${JSON.stringify(chartMeta)} -->`)
        lines.push(optionString)
      } catch (e) {
        console.error('[convertVisualToMarkdown] Invalid chart JSON, skipping:', e)
      }
    })
  }
  
  // Serialize videos
  if (visualData.videos && visualData.videos.length > 0) {
    console.log('[convertVisualToMarkdown] Serializing videos:', visualData.videos.length)
    
    visualData.videos.forEach(video => {
      const videoMeta = {
        id: video.id,
        x: video.x,
        y: video.y,
        width: video.width,
        height: video.height,
        url: video.url,
        embedUrl: video.embedUrl,
        provider: video.provider,
        isLocal: video.isLocal,
        isAudio: video.isAudio,
        fileName: video.fileName,
        fileType: video.fileType,
        __zIndex: video.__zIndex || 0
      }
      
      lines.push(`<!-- VIDEO -->`)
      lines.push(`<!-- VIDEO_POS: ${JSON.stringify(videoMeta)} -->`)
    })
    
    console.log('[convertVisualToMarkdown] Videos serialization complete')
  }
  
  // Serialize tables
  if (visualData.tables && visualData.tables.length > 0) {
    console.log('[convertVisualToMarkdown] Serializing tables:', visualData.tables.length)
    console.log('[convertVisualToMarkdown] Table IDs:', visualData.tables.map(t => t.id))
    
    visualData.tables.forEach(table => {
      const tableMeta = {
        id: table.id,
        x: table.x,
        y: table.y,
        width: table.width,
        height: table.height,
        rows: table.rows,
        cols: table.cols,
        cells: table.cells,
        cellWidth: table.cellWidth,
        cellHeight: table.cellHeight,
        hasHeader: table.hasHeader,
        headerBg: table.headerBg,
        borderColor: table.borderColor,
        alternateRows: table.alternateRows,
        __zIndex: table.__zIndex || 0
      }
      
      console.log('[convertVisualToMarkdown] Serializing table:', table.id, 'at', table.x, table.y)
      lines.push(`<!-- TABLE -->`)
      lines.push(`<!-- TABLE_POS: ${JSON.stringify(tableMeta)} -->`)
    })
    
    console.log('[convertVisualToMarkdown] Tables serialization complete')
  }
  
  const finalMarkdown = lines.join('\n')
  
  // Debug: count how many TABLE markers in final markdown
  const tableMarkerCount = (finalMarkdown.match(/<!-- TABLE -->/g) || []).length
  console.log('[convertVisualToMarkdown] Final markdown contains', tableMarkerCount, 'TABLE markers')
  
  return finalMarkdown
}
