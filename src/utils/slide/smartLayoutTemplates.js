/**
 * Smart Layout Templates for Visual Editor
 * Inspired by Gamma's layout system
 */

export const LAYOUT_CATEGORIES = {
  COLUMNS: 'columns',
  BOXES: 'boxes',
  BULLETS: 'bullets'
}

/**
 * Layout Template Structure:
 * {
 *   id: string - unique identifier
 *   name: string - display name (i18n key)
 *   description: string - description (i18n key)
 *   category: string - LAYOUT_CATEGORIES
 *   icon: string - icon component name or SVG path
 *   preview: object - preview configuration
 *   structure: object - layout structure definition
 * }
 */

export const SMART_LAYOUT_TEMPLATES = [
  // ==================== COLUMNS CATEGORY ====================
  {
    id: 'col-2-equal',
    name: 'slide.layouts.col2Equal',
    description: 'slide.layouts.col2EqualDesc',
    category: LAYOUT_CATEGORIES.COLUMNS,
    icon: 'IconLayoutGrid',
    preview: {
      type: 'columns',
      columns: 2,
      equal: true
    },
    structure: {
      type: 'columns',
      columns: [
        { width: '48%', x: 40, y: 80, height: 320 },
        { width: '48%', x: 480, y: 80, height: 320 }
      ]
    }
  },
  {
    id: 'col-3-equal',
    name: 'slide.layouts.col3Equal',
    description: 'slide.layouts.col3EqualDesc',
    category: LAYOUT_CATEGORIES.COLUMNS,
    icon: 'IconLayoutGrid',
    preview: {
      type: 'columns',
      columns: 3,
      equal: true
    },
    structure: {
      type: 'columns',
      columns: [
        { width: '30%', x: 40, y: 80, height: 320 },
        { width: '30%', x: 310, y: 80, height: 320 },
        { width: '30%', x: 580, y: 80, height: 320 }
      ]
    }
  },
  {
    id: 'col-4-equal',
    name: 'slide.layouts.col4Equal',
    description: 'slide.layouts.col4EqualDesc',
    category: LAYOUT_CATEGORIES.COLUMNS,
    icon: 'IconLayoutGrid',
    preview: {
      type: 'columns',
      columns: 4,
      equal: true
    },
    structure: {
      type: 'columns',
      columns: [
        { width: '22%', x: 40, y: 80, height: 320 },
        { width: '22%', x: 235, y: 80, height: 320 },
        { width: '22%', x: 430, y: 80, height: 320 },
        { width: '22%', x: 625, y: 80, height: 320 }
      ]
    }
  },
  {
    id: 'col-2-left-wide',
    name: 'slide.layouts.col2LeftWide',
    description: 'slide.layouts.col2LeftWideDesc',
    category: LAYOUT_CATEGORIES.COLUMNS,
    icon: 'IconLayoutSidebar',
    preview: {
      type: 'columns',
      columns: 2,
      widths: [60, 40]
    },
    structure: {
      type: 'columns',
      columns: [
        { width: '60%', x: 40, y: 80, height: 320 },
        { width: '35%', x: 545, y: 80, height: 320 }
      ]
    }
  },
  {
    id: 'col-2-right-wide',
    name: 'slide.layouts.col2RightWide',
    description: 'slide.layouts.col2RightWideDesc',
    category: LAYOUT_CATEGORIES.COLUMNS,
    icon: 'IconLayoutSidebar',
    preview: {
      type: 'columns',
      columns: 2,
      widths: [40, 60]
    },
    structure: {
      type: 'columns',
      columns: [
        { width: '35%', x: 40, y: 80, height: 320 },
        { width: '60%', x: 350, y: 80, height: 320 }
      ]
    }
  },

  // ==================== BOXES CATEGORY ====================
  {
    id: 'box-solid-2',
    name: 'slide.layouts.boxSolid2',
    description: 'slide.layouts.boxSolid2Desc',
    category: LAYOUT_CATEGORIES.BOXES,
    icon: 'IconStop',
    preview: {
      type: 'boxes',
      count: 2,
      style: 'solid'
    },
    structure: {
      type: 'boxes',
      boxes: [
        { x: 40, y: 80, width: 400, height: 140, fill: '#e8f0fe', stroke: 'none' },
        { x: 40, y: 240, width: 400, height: 140, fill: '#fef3c7', stroke: 'none' }
      ]
    }
  },
  {
    id: 'box-solid-3',
    name: 'slide.layouts.boxSolid3',
    description: 'slide.layouts.boxSolid3Desc',
    category: LAYOUT_CATEGORIES.BOXES,
    icon: 'IconStop',
    preview: {
      type: 'boxes',
      count: 3,
      style: 'solid'
    },
    structure: {
      type: 'boxes',
      boxes: [
        { x: 40, y: 80, width: 250, height: 280, fill: '#e8f0fe', stroke: 'none' },
        { x: 310, y: 80, width: 250, height: 280, fill: '#fef3c7', stroke: 'none' },
        { x: 580, y: 80, width: 250, height: 280, fill: '#dcfce7', stroke: 'none' }
      ]
    }
  },
  {
    id: 'box-outline-2',
    name: 'slide.layouts.boxOutline2',
    description: 'slide.layouts.boxOutline2Desc',
    category: LAYOUT_CATEGORIES.BOXES,
    icon: 'IconSelect',
    preview: {
      type: 'boxes',
      count: 2,
      style: 'outline'
    },
    structure: {
      type: 'boxes',
      boxes: [
        { x: 40, y: 80, width: 400, height: 140, fill: 'transparent', stroke: '#4285f4', strokeWidth: 2 },
        { x: 40, y: 240, width: 400, height: 140, fill: 'transparent', stroke: '#4285f4', strokeWidth: 2 }
      ]
    }
  },
  {
    id: 'box-outline-4',
    name: 'slide.layouts.boxOutline4',
    description: 'slide.layouts.boxOutline4Desc',
    category: LAYOUT_CATEGORIES.BOXES,
    icon: 'IconSelect',
    preview: {
      type: 'boxes',
      count: 4,
      style: 'outline'
    },
    structure: {
      type: 'boxes',
      boxes: [
        { x: 40, y: 80, width: 195, height: 130, fill: 'transparent', stroke: '#4285f4', strokeWidth: 2 },
        { x: 255, y: 80, width: 195, height: 130, fill: 'transparent', stroke: '#4285f4', strokeWidth: 2 },
        { x: 40, y: 230, width: 195, height: 130, fill: 'transparent', stroke: '#4285f4', strokeWidth: 2 },
        { x: 255, y: 230, width: 195, height: 130, fill: 'transparent', stroke: '#4285f4', strokeWidth: 2 }
      ]
    }
  },
  {
    id: 'box-side-line-left',
    name: 'slide.layouts.boxSideLineLeft',
    description: 'slide.layouts.boxSideLineLeftDesc',
    category: LAYOUT_CATEGORIES.BOXES,
    icon: 'IconMenuFold',
    preview: {
      type: 'boxes',
      count: 3,
      style: 'side-line'
    },
    structure: {
      type: 'boxes',
      boxes: [
        { x: 40, y: 80, width: 380, height: 90, fill: '#f8f9fa', stroke: 'none', leftBorder: { color: '#4285f4', width: 4 } },
        { x: 40, y: 190, width: 380, height: 90, fill: '#f8f9fa', stroke: 'none', leftBorder: { color: '#ea4335', width: 4 } },
        { x: 40, y: 300, width: 380, height: 90, fill: '#f8f9fa', stroke: 'none', leftBorder: { color: '#34a853', width: 4 } }
      ]
    }
  },
  {
    id: 'box-top-line',
    name: 'slide.layouts.boxTopLine',
    description: 'slide.layouts.boxTopLineDesc',
    category: LAYOUT_CATEGORIES.BOXES,
    icon: 'IconMenuUnfold',
    preview: {
      type: 'boxes',
      count: 3,
      style: 'top-line'
    },
    structure: {
      type: 'boxes',
      boxes: [
        { x: 40, y: 80, width: 250, height: 280, fill: '#f8f9fa', stroke: 'none', topBorder: { color: '#4285f4', width: 4 } },
        { x: 310, y: 80, width: 250, height: 280, fill: '#f8f9fa', stroke: 'none', topBorder: { color: '#ea4335', width: 4 } },
        { x: 580, y: 80, width: 250, height: 280, fill: '#f8f9fa', stroke: 'none', topBorder: { color: '#34a853', width: 4 } }
      ]
    }
  },
  {
    id: 'box-circle-top',
    name: 'slide.layouts.boxCircleTop',
    description: 'slide.layouts.boxCircleTopDesc',
    category: LAYOUT_CATEGORIES.BOXES,
    icon: 'IconCheckCircle',
    preview: {
      type: 'boxes',
      count: 3,
      style: 'circle-top'
    },
    structure: {
      type: 'boxes',
      boxes: [
        { x: 40, y: 120, width: 250, height: 240, fill: 'transparent', stroke: '#e5e7eb', strokeWidth: 1, circle: { x: 165, y: 80, radius: 30, fill: '#4285f4' } },
        { x: 310, y: 120, width: 250, height: 240, fill: 'transparent', stroke: '#e5e7eb', strokeWidth: 1, circle: { x: 435, y: 80, radius: 30, fill: '#ea4335' } },
        { x: 580, y: 120, width: 250, height: 240, fill: 'transparent', stroke: '#e5e7eb', strokeWidth: 1, circle: { x: 705, y: 80, radius: 30, fill: '#34a853' } }
      ]
    }
  },
  {
    id: 'box-joined-2',
    name: 'slide.layouts.boxJoined2',
    description: 'slide.layouts.boxJoined2Desc',
    category: LAYOUT_CATEGORIES.BOXES,
    icon: 'IconLink',
    preview: {
      type: 'boxes',
      count: 2,
      style: 'joined'
    },
    structure: {
      type: 'boxes',
      boxes: [
        { x: 40, y: 80, width: 400, height: 120, fill: '#e8f0fe', stroke: 'none' },
        { x: 40, y: 200, width: 400, height: 180, fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 }
      ]
    }
  },
  {
    id: 'box-alternating',
    name: 'slide.layouts.boxAlternating',
    description: 'slide.layouts.boxAlternatingDesc',
    category: LAYOUT_CATEGORIES.BOXES,
    icon: 'IconSwap',
    preview: {
      type: 'boxes',
      count: 4,
      style: 'alternating'
    },
    structure: {
      type: 'boxes',
      boxes: [
        { x: 40, y: 80, width: 195, height: 130, fill: '#e8f0fe', stroke: 'none' },
        { x: 255, y: 80, width: 195, height: 130, fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 },
        { x: 40, y: 230, width: 195, height: 130, fill: '#ffffff', stroke: '#e5e7eb', strokeWidth: 1 },
        { x: 255, y: 230, width: 195, height: 130, fill: '#e8f0fe', stroke: 'none' }
      ]
    }
  },

  // ==================== BULLETS CATEGORY ====================
  {
    id: 'bullet-standard',
    name: 'slide.layouts.bulletStandard',
    description: 'slide.layouts.bulletStandardDesc',
    category: LAYOUT_CATEGORIES.BULLETS,
    icon: 'IconList',
    preview: {
      type: 'bullets',
      style: 'standard'
    },
    structure: {
      type: 'bullets',
      items: [
        { x: 40, y: 100, icon: '•', iconColor: '#4285f4', textX: 70 },
        { x: 40, y: 160, icon: '•', iconColor: '#4285f4', textX: 70 },
        { x: 40, y: 220, icon: '•', iconColor: '#4285f4', textX: 70 },
        { x: 40, y: 280, icon: '•', iconColor: '#4285f4', textX: 70 }
      ]
    }
  },
  {
    id: 'bullet-numbered',
    name: 'slide.layouts.bulletNumbered',
    description: 'slide.layouts.bulletNumberedDesc',
    category: LAYOUT_CATEGORIES.BULLETS,
    icon: 'IconOrderedList',
    preview: {
      type: 'bullets',
      style: 'numbered'
    },
    structure: {
      type: 'bullets',
      items: [
        { x: 40, y: 100, icon: '1', iconColor: '#4285f4', textX: 70, iconStyle: 'circle' },
        { x: 40, y: 160, icon: '2', iconColor: '#4285f4', textX: 70, iconStyle: 'circle' },
        { x: 40, y: 220, icon: '3', iconColor: '#4285f4', textX: 70, iconStyle: 'circle' },
        { x: 40, y: 280, icon: '4', iconColor: '#4285f4', textX: 70, iconStyle: 'circle' }
      ]
    }
  },
  {
    id: 'bullet-checkmark',
    name: 'slide.layouts.bulletCheckmark',
    description: 'slide.layouts.bulletCheckmarkDesc',
    category: LAYOUT_CATEGORIES.BULLETS,
    icon: 'IconCheck',
    preview: {
      type: 'bullets',
      style: 'checkmark'
    },
    structure: {
      type: 'bullets',
      items: [
        { x: 40, y: 100, icon: '✓', iconColor: '#34a853', textX: 70 },
        { x: 40, y: 160, icon: '✓', iconColor: '#34a853', textX: 70 },
        { x: 40, y: 220, icon: '✓', iconColor: '#34a853', textX: 70 },
        { x: 40, y: 280, icon: '✓', iconColor: '#34a853', textX: 70 }
      ]
    }
  },
  {
    id: 'bullet-arrow',
    name: 'slide.layouts.bulletArrow',
    description: 'slide.layouts.bulletArrowDesc',
    category: LAYOUT_CATEGORIES.BULLETS,
    icon: 'IconRight',
    preview: {
      type: 'bullets',
      style: 'arrow'
    },
    structure: {
      type: 'bullets',
      items: [
        { x: 40, y: 100, icon: '→', iconColor: '#4285f4', textX: 70 },
        { x: 40, y: 160, icon: '→', iconColor: '#4285f4', textX: 70 },
        { x: 40, y: 220, icon: '→', iconColor: '#4285f4', textX: 70 },
        { x: 40, y: 280, icon: '→', iconColor: '#4285f4', textX: 70 }
      ]
    }
  },
  {
    id: 'bullet-two-column',
    name: 'slide.layouts.bulletTwoColumn',
    description: 'slide.layouts.bulletTwoColumnDesc',
    category: LAYOUT_CATEGORIES.BULLETS,
    icon: 'IconLayout',
    preview: {
      type: 'bullets',
      style: 'two-column'
    },
    structure: {
      type: 'bullets',
      columns: 2,
      items: [
        { x: 40, y: 100, icon: '•', iconColor: '#4285f4', textX: 70 },
        { x: 40, y: 180, icon: '•', iconColor: '#4285f4', textX: 70 },
        { x: 40, y: 260, icon: '•', iconColor: '#4285f4', textX: 70 },
        { x: 460, y: 100, icon: '•', iconColor: '#ea4335', textX: 490 },
        { x: 460, y: 180, icon: '•', iconColor: '#ea4335', textX: 490 },
        { x: 460, y: 260, icon: '•', iconColor: '#ea4335', textX: 490 }
      ]
    }
  },
  {
    id: 'bullet-emoji',
    name: 'slide.layouts.bulletEmoji',
    description: 'slide.layouts.bulletEmojiDesc',
    category: LAYOUT_CATEGORIES.BULLETS,
    icon: 'IconFace',
    preview: {
      type: 'bullets',
      style: 'emoji'
    },
    structure: {
      type: 'bullets',
      items: [
        { x: 40, y: 100, icon: '🎯', textX: 80 },
        { x: 40, y: 170, icon: '💡', textX: 80 },
        { x: 40, y: 240, icon: '🚀', textX: 80 },
        { x: 40, y: 310, icon: '✨', textX: 80 }
      ]
    }
  }
]

/**
 * Get layouts by category
 */
export function getLayoutsByCategory(category) {
  return SMART_LAYOUT_TEMPLATES.filter(layout => layout.category === category)
}

/**
 * Get all layout categories
 */
export function getAllCategories() {
  return Object.values(LAYOUT_CATEGORIES)
}

/**
 * Find layout by ID
 */
export function getLayoutById(id) {
  return SMART_LAYOUT_TEMPLATES.find(layout => layout.id === id)
}
