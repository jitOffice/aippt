import { 
  IconFontColors, 
  IconH1, 
  IconH2, 
  IconH3,
  IconList,
  IconOrderedList,
  IconImage, 
  IconVideoCamera,
  IconLink,
  IconStarFill,
  IconBarChart,
  IconRecord,
  IconLayout
} from '@arco-design/web-vue/es/icon'
import { h } from 'vue'

// Custom Shapes Icon Component
const IconShapes = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '1.25em',
  height: '1.25em',
  viewBox: '0 0 24 24',
  style: {
    display: 'inline-block',
    verticalAlign: 'middle'
  }
}, [
  h('path', {
    fill: 'currentColor',
    d: 'M1.5.5h8s1 0 1 1v8s0 1-1 1h-8s-1 0-1-1v-8s0-1 1-1M6.43 13a1.16 1.16 0 0 0-1.86 0l-3.16 4.33a1.11 1.11 0 0 0 0 1.34L4.57 23a1.16 1.16 0 0 0 1.86 0l3.16-4.36a1.11 1.11 0 0 0 0-1.34Zm7.07-7.5a5 5 0 1 0 10 0a5 5 0 1 0-10 0m4.36 8.5a1 1 0 0 0-1.72 0l-4.75 8a1 1 0 0 0 0 1a1 1 0 0 0 .87.5h9.5a1 1 0 0 0 .87-.5a1 1 0 0 0 0-1Z'
  })
])

// Custom Text Icon Component
const IconText = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': 'true',
  role: 'img',
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  style: {
    display: 'inline-block',
    verticalAlign: 'middle'
  }
}, [
  h('path', {
    fill: 'currentColor',
    'fill-rule': 'evenodd',
    d: 'M8 2h-.066c-.886 0-1.65 0-2.262.082c-.655.088-1.284.287-1.793.797c-.51.51-.709 1.138-.797 1.793C3 5.284 3 6.048 3 6.934V7.95a1 1 0 1 0 2 0V7c0-.971.002-1.599.064-2.061c.059-.434.153-.57.229-.646s.212-.17.646-.229C6.4 4.002 7.029 4 8 4h8c.971 0 1.599.002 2.061.064c.434.059.57.153.646.229s.17.212.229.646C18.998 5.4 19 6.029 19 7v.95a1 1 0 1 0 2 0V6.934c0-.886 0-1.65-.082-2.262c-.088-.655-.287-1.284-.797-1.793c-.51-.51-1.138-.709-1.793-.797C17.716 2 16.952 2 16.066 2z',
    'clip-rule': 'evenodd'
  }),
  h('path', {
    fill: 'currentColor',
    d: 'M13 4h-2v16h2z',
    opacity: '.5'
  }),
  h('path', {
    fill: 'currentColor',
    'fill-rule': 'evenodd',
    d: 'M6 21a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1',
    'clip-rule': 'evenodd'
  })
])

// Custom Chart Icon Component
const IconChart = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': 'true',
  role: 'img',
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  style: {
    display: 'inline-block',
    verticalAlign: 'middle'
  }
}, [
  h('path', {
    fill: 'currentColor',
    d: 'M3.293 9.293C3 9.586 3 10.057 3 11v6c0 .943 0 1.414.293 1.707S4.057 19 5 19s1.414 0 1.707-.293S7 17.943 7 17v-6c0-.943 0-1.414-.293-1.707S5.943 9 5 9s-1.414 0-1.707.293'
  }),
  h('path', {
    fill: 'currentColor',
    d: 'M17.293 2.293C17 2.586 17 3.057 17 4v13c0 .943 0 1.414.293 1.707S18.057 19 19 19s1.414 0 1.707-.293S21 17.943 21 17V4c0-.943 0-1.414-.293-1.707S19.943 2 19 2s-1.414 0-1.707.293',
    opacity: '.4'
  }),
  h('path', {
    fill: 'currentColor',
    d: 'M10 7c0-.943 0-1.414.293-1.707S11.057 5 12 5s1.414 0 1.707.293S14 6.057 14 7v10c0 .943 0 1.414-.293 1.707S12.943 19 12 19s-1.414 0-1.707-.293S10 17.943 10 17z',
    opacity: '.7'
  }),
  h('path', {
    fill: 'currentColor',
    d: 'M3 21.25a.75.75 0 0 0 0 1.5h18a.75.75 0 0 0 0-1.5z'
  })
])

// Custom Table Icon Component
const IconTable = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': 'true',
  role: 'img',
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  style: {
    display: 'inline-block',
    verticalAlign: 'middle'
  }
}, [
  h('g', {
    fill: 'currentColor',
    'fill-rule': 'evenodd',
    'clip-rule': 'evenodd'
  }, [
    h('path', {
      d: 'M22.25 6.5a4.75 4.75 0 1 0-9.5 0a4.75 4.75 0 0 0 9.5 0m-11 11a4.75 4.75 0 1 0-9.5 0a4.75 4.75 0 0 0 9.5 0'
    }),
    h('path', {
      d: 'M1.75 6.5a4.75 4.75 0 1 1 9.5 0a4.75 4.75 0 0 1-9.5 0m11 11a4.75 4.75 0 1 1 9.5 0a4.75 4.75 0 0 1-9.5 0',
      opacity: '.5'
    })
  ])
])

// Text Components Definitions
export const textComponents = [
  { 
    id: 'heading1', 
    name: 'slide.visual.text.heading1', 
    sublabel: '# Heading 1', 
    icon: IconH1, 
    type: 'text', 
    props: { fontSize: 48, fontWeight: 'bold' } 
  },
  { 
    id: 'heading2', 
    name: 'slide.visual.text.heading2', 
    sublabel: '## Heading 2', 
    icon: IconH2, 
    type: 'text', 
    props: { fontSize: 36, fontWeight: 'bold' } 
  },
  { 
    id: 'heading3', 
    name: 'slide.visual.text.heading3', 
    sublabel: '### Heading 3', 
    icon: IconH3, 
    type: 'text', 
    props: { fontSize: 28, fontWeight: 'bold' } 
  },
  { 
    id: 'paragraph', 
    name: 'slide.visual.text.paragraph', 
    sublabel: 'Regular text', 
    icon: IconFontColors, 
    type: 'text', 
    props: { fontSize: 18 } 
  },
  { 
    id: 'bulletList', 
    name: 'slide.visual.text.bulletList', 
    sublabel: '• Item', 
    icon: IconList, 
    type: 'text', 
    props: { fontSize: 18, listStyle: 'bullet' } 
  },
  { 
    id: 'numberedList', 
    name: 'slide.visual.text.numberedList', 
    sublabel: '1. Item', 
    icon: IconOrderedList, 
    type: 'text', 
    props: { fontSize: 18, listStyle: 'numbered' } 
  },
  { 
    id: 'link', 
    name: 'slide.visual.text.link', 
    sublabel: 'Hyperlink', 
    icon: IconLink, 
    type: 'link', 
    props: { fontSize: 18, text: 'Link', color: '#165DFF', textDecoration: 'underline' } 
  }
]

// Shape Components Definitions
export const shapeComponents = [
  { 
    id: 'rectangle', 
    name: 'slide.visual.shapes.rectangle', 
    icon: 'rectangle', 
    type: 'shape', 
    color: '#4285f4', 
    props: { shapeType: 'rectangle', fill: '#4285f4' } 
  },
  { 
    id: 'square', 
    name: 'slide.visual.shapes.square', 
    icon: 'square', 
    type: 'shape', 
    color: '#ea4335', 
    props: { shapeType: 'square', fill: '#ea4335' } 
  },
  { 
    id: 'circle', 
    name: 'slide.visual.shapes.circle', 
    icon: IconRecord, 
    type: 'shape', 
    color: '#34a853', 
    props: { shapeType: 'circle', fill: '#34a853' } 
  },
  { 
    id: 'triangle', 
    name: 'slide.visual.shapes.triangle', 
    icon: 'triangle', 
    type: 'shape', 
    color: '#fbbc04', 
    props: { shapeType: 'triangle', fill: '#fbbc04' } 
  },
  { 
    id: 'star', 
    name: 'slide.visual.shapes.star', 
    icon: IconStarFill, 
    type: 'shape', 
    color: '#ff6d00', 
    props: { shapeType: 'star', fill: '#ff6d00' } 
  },
  // --- Decorative Lines (New) ---
  { 
    id: 'simple-line', 
    name: 'slide.visual.shapes.simpleLine', 
    icon: 'line-simple',  // Custom SVG icon
    type: 'shape', 
    color: '#3b82f6', 
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
    name: 'slide.visual.shapes.thickLine', 
    icon: 'line-thick',  // Custom SVG icon
    type: 'shape', 
    color: '#8b5cf6', 
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
    name: 'slide.visual.shapes.gradientLine', 
    icon: 'line-gradient',  // Custom SVG icon
    type: 'shape', 
    color: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', 
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
    name: 'slide.visual.shapes.dottedLine', 
    icon: 'line-dotted',  // Custom SVG icon
    type: 'shape', 
    color: '#64748b', 
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
    name: 'slide.visual.shapes.dashedLine', 
    icon: 'line-dashed',  // Custom SVG icon
    type: 'shape', 
    color: '#64748b', 
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

// Chart Components Definitions
export const chartComponents = [
  { 
    id: 'barChart', 
    name: 'slide.visual.charts.barChart', 
    sublabel: 'slide.visual.charts.column', 
    icon: IconBarChart, 
    type: 'chart', 
    props: { chartType: 'bar' } 
  },
  { 
    id: 'lineChart', 
    name: 'slide.visual.charts.lineChart', 
    sublabel: 'slide.visual.charts.trend', 
    icon: IconBarChart, 
    type: 'chart', 
    props: { chartType: 'line' } 
  },
  { 
    id: 'pieChart', 
    name: 'slide.visual.charts.pieChart', 
    sublabel: 'slide.visual.charts.proportion', 
    icon: IconBarChart, 
    type: 'chart', 
    props: { chartType: 'pie' } 
  },
  { 
    id: 'areaChart', 
    name: 'slide.visual.charts.areaChart', 
    sublabel: 'slide.visual.charts.filled', 
    icon: IconBarChart, 
    type: 'chart', 
    props: { chartType: 'area' } 
  },
  { 
    id: 'scatterChart', 
    name: 'slide.visual.charts.scatterChart', 
    sublabel: 'slide.visual.charts.correlation', 
    icon: IconBarChart, 
    type: 'chart', 
    props: { chartType: 'scatter' } 
  },
  { 
    id: 'radarChart', 
    name: 'slide.visual.charts.radarChart', 
    sublabel: 'slide.visual.charts.multidim', 
    icon: IconBarChart, 
    type: 'chart', 
    props: { chartType: 'radar' } 
  },
  { 
    id: 'funnelChart', 
    name: 'slide.visual.charts.funnelChart', 
    sublabel: 'slide.visual.charts.conversion', 
    icon: IconBarChart, 
    type: 'chart', 
    props: { chartType: 'funnel' } 
  },
  { 
    id: 'gaugeChart', 
    name: 'slide.visual.charts.gaugeChart', 
    sublabel: 'slide.visual.charts.progress', 
    icon: IconBarChart, 
    type: 'chart', 
    props: { chartType: 'gauge' } 
  }
]

// Panel Configuration
export const panelConfig = {
  text: {
    id: 'text',
    title: 'slide.visual.categories.text',
    icon: IconText,
    component: 'TextPanel'
  },
  shapes: {
    id: 'shapes',
    title: 'slide.visual.categories.shapes',
    icon: IconShapes,
    component: 'ShapesPanel'
  },
  table: {
    id: 'table',
    title: 'slide.visual.categories.table',
    icon: IconTable,
    component: 'TablePanel'
  },
  charts: {
    id: 'charts',
    title: 'slide.visual.categories.charts',
    icon: IconChart,
    component: 'ChartsPanel',
    isNew: false
  },
  layouts: {
    id: 'layouts',
    title: 'slide.visual.categories.layouts',
    icon: IconLayout,
    component: 'SmartLayoutsPanel'
  },
  images: {
    id: 'images',
    title: 'slide.visual.categories.images',
    icon: IconImage,
    component: 'ImagesPanel'
  },
  media: {
    id: 'media',
    title: 'slide.visual.categories.media',
    icon: IconVideoCamera,
    component: 'MediaPanel'
  }
}

// Sub-panel options that require searchable interface
export const searchableSubPanels = [
  'webSearch', 
  'aiImages', 
  'pexels', 
  'giphy', 
  'pictographic', 
  'galleryImages'
]