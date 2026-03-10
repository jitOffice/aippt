// Panel configuration and behavior settings

export const panelSettings = {
  // Toolbar positioning
  toolbar: {
    width: 52,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08)',
    hoverBoxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.12)'
  },
  
  // Panel positioning and dimensions
  panel: {
    width: 520,
    maxWidth: 'calc(100vw - 100px)',
    height: '80vh',
    maxHeight: 700,
    borderRadius: '12px 0 0 12px',
    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
    rightOffset: 65
  },
  
  // Icon button styling
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 6,
    hoverBackground: '#f3f4f6',
    activeBackground: '#e0e7ff',
    activeColor: '#4f46e5'
  },
  
  // Component card styling
  componentCard: {
    borderRadius: 10,
    borderWidth: 1.5,
    hoverTransform: 'translateY(-2px)',
    hoverBorderColor: '#6366f1'
  },
  
  // Grid configurations
  grids: {
    default: {
      columns: 2,
      gap: 10
    },
    threeColumn: {
      columns: 3,
      gap: 8
    }
  }
}

// Animation configurations
export const animations = {
  slideDuration: '0.2s',
  slideTimingFunction: 'ease-out',
  hoverTransition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  iconScale: 1.08
}

// Transition names
export const transitions = {
  slideLeft: 'slide-left'
}

// CSS class names
export const classNames = {
  toolbar: 'right-toolbar-gamma',
  dragHandle: 'drag-handle',
  toolbarIcons: 'toolbar-icons',
  iconBtnWrapper: 'icon-btn-wrapper',
  iconBtn: 'icon-btn',
  newBadge: 'new-badge',
  componentPanel: 'component-panel',
  panelContent: 'panel-content',
  panelHeader: 'panel-header',
  panelBody: 'panel-body',
  sectionHeader: 'section-header',
  componentGrid: 'component-grid',
  componentCard: 'component-card',
  cardIcon: 'card-icon',
  cardContent: 'card-content',
  cardLabel: 'card-label',
  cardSublabel: 'card-sublabel'
}