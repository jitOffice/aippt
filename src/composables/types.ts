/**
 * Type definitions for slide page composables
 */

import { Ref } from 'vue'

/**
 * Visual data for a single text element
 */
export interface VisualTextElement {
  id: string
  type: 'text'
  x: number
  y: number
  width: number
  height: number
  content: string
  text?: string  // Backward compatibility
  fontSize: number
  fontWeight?: string
  fill?: string
  textAlign?: string
  backgroundColor?: string
}

/**
 * Visual data for a single image element
 */
export interface VisualImageElement {
  id: string
  type: 'image'
  x: number
  y: number
  width: number
  height: number
  src: string
  alt?: string
}

/**
 * Visual data for a rectangle shape
 */
export interface VisualRectangleElement {
  id: string
  type: 'rectangle'
  x: number
  y: number
  width: number
  height: number
  fill?: string
  stroke?: string
  strokeWidth?: number
}

/**
 * Visual data for a circle shape
 */
export interface VisualCircleElement {
  id: string
  type: 'circle'
  x: number
  y: number
  radius: number
  fill?: string
  stroke?: string
  strokeWidth?: number
}

/**
 * Visual data for a chart element
 */
export interface VisualChartElement {
  id: string
  type: string
  title?: string
  x: number
  y: number
  width: number
  height: number
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string | string[]
    }>
  }
  options?: Record<string, any>
}

/**
 * Visual data for a video element
 */
export interface VisualVideoElement {
  id: string
  type: 'video'
  x: number
  y: number
  width: number
  height: number
  url: string
  provider?: 'youtube' | 'vimeo' | 'custom'
  embedUrl?: string
  draggable?: boolean
  name?: string
  __zIndex?: number
}

/**
 * Complete visual data for a single slide
 */
export interface SlideVisualData {
  texts: VisualTextElement[]
  images: VisualImageElement[]
  rectangles: VisualRectangleElement[]
  circles: VisualCircleElement[]
  charts: VisualChartElement[]
  videos?: VisualVideoElement[]
}

/**
 * Collection of visual data for all slides
 * Key format: "slide-{index}"
 */
export interface VisualSlideDataMap {
  [key: string]: SlideVisualData
}

/**
 * Preview mode change request data
 */
export interface PreviewChangeData {
  slideIndex: number
  content: string
  action?: string
}

/**
 * Parameters for usePreviewMode composable
 */
export interface UsePreviewModeParams {
  visualSlideData: Ref<VisualSlideDataMap>
  currentSlideIndex: Ref<number>
  generateMarkdownFromVisual: () => Promise<void>
}

/**
 * Return type for usePreviewMode composable
 */
export interface UsePreviewModeReturn {
  // State
  isPreviewMode: Ref<boolean>
  previewOriginalData: Ref<SlideVisualData | null>
  previewModifiedData: Ref<SlideVisualData | null>
  
  // Actions
  handlePreviewChanges: (data: PreviewChangeData) => void
  confirmPreview: () => Promise<void>
  cancelPreview: () => void
  
  // Utilities
  isInPreviewMode: () => boolean
  getPreviewOriginalData: () => SlideVisualData | null
  getPreviewModifiedData: () => SlideVisualData | null
}

/**
 * Parameters for useSlideAutoSave composable
 */
export interface UseSlideAutoSaveParams {
  docId: Ref<string>
  markdownContent: Ref<string>
}

/**
 * Return type for useSlideAutoSave composable
 */
export interface UseSlideAutoSaveReturn {
  startAutoSave: () => void
  stopAutoSave: () => void
  handleManualSave: () => Promise<void>
  saveStatus: Ref<'idle' | 'saving' | 'saved' | 'error'>
}

/**
 * AI Suggestion Types
 */
export type SuggestionType = 
  | 'text-change'
  | 'add-component'
  | 'title-change'
  | 'font-size-change'
  | 'position-change'
  | 'layout-adjust'
  | 'color-change'
  | 'add-separator'

export type SuggestionTarget = 'title' | 'subtitle'

export type ComponentType = 'shape' | 'image' | 'chart'

export type LineStyle = 'simple' | 'thick' | 'gradient' | 'dotted' | 'dashed'

export type Alignment = 'left' | 'center' | 'right'

export type AlignmentDirection = 'horizontal' | 'vertical' | 'both'

/**
 * Base suggestion interface
 */
export interface BaseSuggestion {
  type: SuggestionType
}

/**
 * Text change suggestion
 */
export interface TextChangeSuggestion extends BaseSuggestion {
  type: 'text-change'
  target: SuggestionTarget
  text: string
}

/**
 * Component addition suggestion
 */
export interface ComponentAdditionSuggestion extends BaseSuggestion {
  type: 'add-component'
  componentId: string
  componentType: ComponentType
}

/**
 * Title change suggestion (find and replace)
 */
export interface TitleChangeSuggestion extends BaseSuggestion {
  type: 'title-change'
  from: string
  to: string
}

/**
 * Font size change suggestion
 */
export interface FontSizeChangeSuggestion extends BaseSuggestion {
  type: 'font-size-change'
  target: SuggestionTarget
  size: number
}

/**
 * Position change suggestion
 */
export interface PositionChangeSuggestion extends BaseSuggestion {
  type: 'position-change'
  target: SuggestionTarget
  x?: number
  y?: number
  isPercentage?: boolean
}

/**
 * Layout adjustment suggestion
 */
export interface LayoutAdjustSuggestion extends BaseSuggestion {
  type: 'layout-adjust'
  alignment?: Alignment
  direction?: AlignmentDirection
  spacing?: number
}

/**
 * Color change suggestion
 */
export interface ColorChangeSuggestion extends BaseSuggestion {
  type: 'color-change'
  target: SuggestionTarget
  colorHex?: string
  color?: string
}

/**
 * Separator addition suggestion
 */
export interface SeparatorSuggestion extends BaseSuggestion {
  type: 'add-separator'
  separatorType?: string
}

/**
 * Union type for all suggestions
 */
export type AISuggestion = 
  | TextChangeSuggestion
  | ComponentAdditionSuggestion
  | TitleChangeSuggestion
  | FontSizeChangeSuggestion
  | PositionChangeSuggestion
  | LayoutAdjustSuggestion
  | ColorChangeSuggestion
  | SeparatorSuggestion

/**
 * Component definition for shapes
 */
export interface ShapeComponentProps {
  shapeType: string
  lineStyle?: LineStyle
  width: number
  height: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  cornerRadius?: number
  dash?: number[]
  fillLinearGradientStartPoint?: { x: number; y: number }
  fillLinearGradientEndPoint?: { x: number; y: number }
  fillLinearGradientColorStops?: (number | string)[]
}

export interface ShapeComponentDefinition {
  id: string
  props: ShapeComponentProps
}

export interface ComponentDefinitions {
  shapeComponents: ShapeComponentDefinition[]
}
