<template>
  <div class="slidev-demo">
    <!-- Top Navigation Bar -->
    <EditorHeader
      headerBackgroundColor="white"
      appTitleShort="JitSlide  Studio"
      :documentTitle="documentTitle"
      :enableCreateDocument="false"
      :enableDocumentList="false"
      :editableTitle="true"
      :showOnlineUsers="false"
      :enable-share="false"
      logoHref="/"
      :logoSrc="logoSrc"
      @create-document-click="handleCreateDocument"
      @go-home="handleGoHome"
      @document-list-click="handleOpenDocDrawer"
      @title-change="handleTitleChange"
      @mouseenter="handleHideFloatingBarMouseEnter"
    >
      <template #rightActions>
        <!-- Collaboration Avatars (Placeholder) -->
        <div class="collaboration-avatars margin-left-1">
          <div class="avatar-item" style="background: #3b82f6;">
            <span>A</span>
          </div>
          <div class="avatar-item" style="background: #10b981;">
            <span>B</span>
          </div>
          <div class="avatar-item" style="background: #8b5cf6;">
            <span>C</span>
          </div>
          <div class="avatar-item avatar-more" style="background: #e2e8f0; color: #64748b;">
            <span>+2</span>
          </div>
        </div>
        
        <!-- Present Button (Primary Action) -->
        <a-button 
          type="primary" 
          size="small" 
          class="present-btn-primary margin-left-1"
          @click="enterPresentMode"
        >
          <template #icon><icon-play-arrow /></template>
           {{ t('slide.present') }}
        </a-button>
         <!-- <a-button size="small" type="text" class="header-action-btn margin-left-1" @click="showMarkdownEditor = !showMarkdownEditor">
          <template #icon><icon-code /></template>
          {{ showMarkdownEditor ? t('slide.hideCode') : t('slide.showCode') }}
        </a-button>
         -->
        <!-- Theme/Template Button -->
        <a-button 
          size="small" 
          class="theme-btn-secondary margin-left-1" 
          @click="showTemplateModal = !showTemplateModal"
        >
           <Icon 
          style="display:flex;flex-direction:row;align-items:center;margin-right:6px;"
           name="template" :size="14" />
           <span> {{ t('slide.changeTemplate') }}</span>
        </a-button>
        
        <!-- Background Setting Button -->
        <a-dropdown trigger="click" position="br">
          <a-button 
            size="small" 
            class="theme-btn-secondary margin-left-1"
          >
            <template #icon><icon-bg-colors /></template>
            <span>背景</span>
          </a-button>
          <template #content>
            <div class="background-dropdown-content">
              <div class="dropdown-section">
                <div class="section-title">选择背景颜色</div>
                <div class="color-grid-large">
                  <div 
                    v-for="color in quickColors"
                    :key="color"
                    class="color-item-large"
                    :style="{ background: color }"
                    :title="color"
                    @click="applyBackgroundColor(color)"
                  >
                    <icon-check v-if="currentSlideBackground === color" :size="14" style="color: rgba(0,0,0,0.6); filter: drop-shadow(0 0 2px white);" />
                  </div>
                </div>
              </div>
              
              <a-divider :margin="12" />
              
              <a-space direction="vertical" :size="4" style="width: 100%;">
                <a-button 
                  long 
                  size="small"
                  @click="handleUploadBackground"
                >
                  <template #icon><icon-image :size="16" /></template>
                  上传背景图片
                </a-button>
                
                <a-button 
                  v-if="currentSlideBackground" 
                  long
                  size="small"
                  @click="resetBackground"
                >
                  <template #icon><icon-refresh :size="16" /></template>
                  重置背景
                </a-button>
              </a-space>
            </div>
          </template>
        </a-dropdown>
        
        <!-- Hidden file input for background upload -->
        <input
          ref="bgFileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/gif"
          style="display: none"
          @change="handleBackgroundFileSelect"
        />
        
        <!-- JSON Import/Export -->
        <a-dropdown trigger="click">
          <a-button 
            size="small" 
            class="export-btn-dark margin-left-1"
          >
            <template #icon><icon-download /></template>
            <span>导出</span>
          </a-button>
          <template #content>
            <a-doption @click="handleExportPPTX">
              <template #icon><icon-download :size="16" /></template>
              导出 PPTX
            </a-doption>
            <a-doption @click="handleExportJSON">
              <template #icon><icon-code :size="16" /></template>
              导出 JSON
            </a-doption>
            <a-doption @click="handleImportJSONClick">
              <template #icon><icon-file-image :size="16" /></template>
              导入 JSON
            </a-doption>
          </template>
        </a-dropdown>
        
        <!-- Hidden file input for JSON import -->
        <input
          ref="jsonFileInputRef"
          type="file"
          accept=".json"
          style="display: none"
          @change="handleJSONFileSelect"
        />
      
        
      </template>
    </EditorHeader>

    <!-- Theme Panel -->
    <div v-if="showThemePanel" class="theme-drawer">
      <div class="theme-drawer-overlay" @click="showThemePanel = false"></div>
      <div class="theme-drawer-content">
        <div class="theme-drawer-header">
          <h3>{{ t('slide.theme') }}</h3>
          <a-button size="mini" type="text" @click="showThemePanel = false">
            <icon-close />
          </a-button>
        </div>
        
        <div class="theme-drawer-body">
          <!-- Theme Category Tabs -->
          <div class="theme-categories">
            <button 
              class="category-tab"
              :class="{ active: activeThemeCategory === 'light' }"
              @click="activeThemeCategory = 'light'"
            >
              {{ t('slide.themeCategories.light') }}
            </button>
            <button 
              class="category-tab"
              :class="{ active: activeThemeCategory === 'dark' }"
              @click="activeThemeCategory = 'dark'"
            >
              {{ t('slide.themeCategories.dark') }}
            </button>
            <button 
              class="category-tab"
              :class="{ active: activeThemeCategory === 'colorful' }"
              @click="activeThemeCategory = 'colorful'"
            >
              {{ t('slide.themeCategories.colorful') }}
            </button>
          </div>

          <!-- Theme Grid -->
          <div class="theme-grid">
            <div 
              v-for="theme in themesByCategory[activeThemeCategory]" 
              :key="theme.name"
              class="theme-card"
              :class="{ active: currentTheme === theme.name }"
              @click="selectTheme(theme.name)"
            >
              <div class="theme-preview-card" :style="{ background: theme.preview }">
                <div class="theme-preview-content" :style="theme.slideStyle">
                  <div class="preview-title">Title</div>
                  <div class="preview-text">Body & text</div>
                </div>
              </div>
              <div class="theme-label">{{ theme.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="main-container" :class="{ 'with-chat-panel': showChatPanel, 'with-ai-panel': showAICreationPanel }">
      <!-- Left Sidebar: Unified Sidebar with Tab Switching -->
      <SlideThumbnailSidebar
        :slides="parsedSlides"
        :current-index="currentSlideIndex"
        :theme-style="currentThemeStyle"
        :is-adding-slide="isAddingSlide"
        v-model:view-mode="thumbnailViewMode"
        @select-slide="currentSlideIndex = $event"
        @add-slide="addNewSlide"
        @copy-slide="handleCopySlide"
        @delete-slide="handleDeleteSlide"
        @reorder-slides="handleSlideReorder"
        @mouseenter="handleHideFloatingBarMouseEnter"
        @tab-change="handleSidebarTabChange"
      >
        <!-- Visual preview slot -->
        <template #slide-preview="{ slide, index }">
          <div v-if="getSlideVisualData(index)" class="thumb-visual-preview">
            <VisualEditorProto
              :slide-data="getSlideVisualData(index)"
              :theme-style="currentThemeStyle"
              :readonly="true"
            />
          </div>
        </template>
        
        <!-- AI Creation Content Slot -->
        <template #ai-creation-content>
          <div class="ai-creation-content">
            <!-- AI Creation Header -->
            <div class="ai-creation-header-inline">
              <div class="header-step-badge">1</div>
              <h3 class="header-title">AI 创意中心</h3>
            </div>

            <!-- Prompt Input -->
            <div class="ai-creation-input">
              <label class="input-label">你想生成什么样的PPT？</label>
              <a-textarea
                v-model="slidePrompt"
                :placeholder="'例如：2026年Q1市场增长计划报告，风格专业稳重...'"
                :auto-size="{ minRows: 4, maxRows: 6 }"
                class="prompt-textarea"
              />
            </div>

            <!-- Generate Outline Button -->
            <a-button 
              type="primary" 
              long 
              size="large"
              class="generate-outline-btn"
              @click="handleGenerateOutline"
              :loading="isGeneratingOutline"
            >
              <template #icon><icon-barChart :size="18" /></template>
              <span>生成内容大纲</span>
            </a-button>

            <!-- Outline Preview Section -->
            <div class="outline-preview-section">
              <div class="section-header">
                <div class="header-left">
                  <div class="header-step-badge secondary">2</div>
                  <h4 class="section-title">内容大纲预览</h4>
                </div>
                <a-button size="mini" type="text" class="edit-btn" @click="handleManualEdit">
                  <template #icon><icon-edit :size="14" /></template>
                  <span>手动编辑</span>
                </a-button>
              </div>

              <!-- Card-based outline list -->
              <div class="outline-card-list">
                <div 
                  v-for="(slide, index) in parsedSlides" 
                  :key="index"
                  class="outline-card"
                  :class="{ 'active': currentSlideIndex === index }"
                  @click="currentSlideIndex = index"
                >
                  <div class="card-badge">P{{ String(index + 1).padStart(2, '0') }}</div>
                  <div class="card-title">{{ getSlideTitle(index) }}</div>
                </div>
              </div>

              <!-- Add More Sections -->
              <button class="add-section-btn" @click="addNewSlide">
                <icon-plus :size="16" />
                <span>添加更多章节</span>
              </button>
            </div>

            <!-- Render PPT Button -->
            <div class="render-ppt-footer">
              <a-button 
                type="primary" 
                long 
                size="large"
                class="render-ppt-btn"
                @click="handleRenderPPT"
              >
                <template #icon><icon-play-arrow :size="20" /></template>
                <span>立即渲染 PPT</span>
              </a-button>
            </div>
          </div>
        </template>
      </SlideThumbnailSidebar>

      <!-- Center Canvas: Current Slide -->
      <div class="canvas-center" :class="{ 'preview-mode-active': isPreviewMode }">
        <div 
          class="canvas-main" 
          @click.self="handleCanvasClick"
          @keydown="handleCanvasKeydown"
          tabindex="0"
        >
          <div class="canvas-zoom-wrapper" :style="canvasZoomStyle">
            <VisualEditorProto 
              ref="visualEditorRef"
              :slide-data="currentVisualData"
              :theme-style="computedThemeStyle"
              :readonly="false"
              @update:slide-data="handleVisualDataUpdate"
            />
          </div>
        </div>

        <!-- Bottom Thumbnail Strip (Show only when AI Creation Panel is open) -->
        <BottomThumbnailStrip
          v-if="showAICreationPanel"
          :slides="parsedSlides"
          :current-index="currentSlideIndex"
          :theme-style="currentThemeStyle"
          :get-slide-visual-data="getSlideVisualData"
          @select-slide="currentSlideIndex = $event"
          @add-slide="addNewSlide"
          @copy-slide="handleCopySlide"
          @delete-slide="handleDeleteSlide"
          @mouseenter="handleHideFloatingBarMouseEnter"
        />

        <div  class="zoom-control-bar">
          <a-button-group size="small">
            <a-button @click="zoomOut" :disabled="zoomLevel <= 25">
              <icon-zoom-out />
            </a-button>
            <a-dropdown trigger="click">
              <a-button class="zoom-display">
                {{ zoomLevel }}%
                <icon-down :size="12" />
              </a-button>
              <template #content>
                <a-doption 
                  v-for="preset in zoomPresets" 
                  :key="preset"
                  @click="setZoom(preset)"
                  :class="{ 'zoom-active': zoomLevel === preset }"
                >
                  {{ preset }}%
                </a-doption>
                <a-divider :margin="4" />
                <a-doption @click="fitToWindow">
                  <icon-expand :size="14" style="margin-right: 6px" />
                  {{ t('slide.zoomControl.fitToWindow') }}
                </a-doption>
              </template>
            </a-dropdown>
            <a-button @click="zoomIn" :disabled="zoomLevel >= 200">
              <icon-zoom-in />
            </a-button>
          </a-button-group>
        </div>

        <!-- Markdown Editor Overlay -->
        <div v-if="showMarkdownEditor" class="markdown-editor-overlay">
          <div class="editor-header">
            <div class="editor-header-left">
              <icon-code :size="18" />
              <span class="label">{{ t('slide.markdownSource') }}</span>
            </div>
            <a-button size="mini" type="text" @click="showMarkdownEditor = false">
              <icon-close />
            </a-button>
          </div>
          <div class="markdown-syntax-tips">
            <div class="tip-item"><code># Heading</code> - Title slide</div>
            <div class="tip-item"><code>## Heading</code> - Section title</div>
            <div class="tip-item"><code>---</code> - Slide separator</div>
            <div class="tip-item"><code>**bold**</code> - Bold text</div>
            <div class="tip-item"><code>- item</code> - Bullet list</div>
            <div class="tip-item"><code><!-- CHART:type --></code> - Insert chart</div>
          </div>
          <a-textarea
            v-model="markdownContent"
            :auto-size="{ minRows: 20, maxRows: 30 }"
            placeholder="AI will generate Markdown content here..."
            class="markdown-input"
          />
        </div>

        <!-- Preview Mode Overlay -->
        <div v-if="isPreviewMode" class="preview-mode-overlay">
          <div class="preview-banner">
            <div class="preview-label">
              <icon-eye :size="18" :style="{ color: '#165DFF' }" />
              <span>预览模式 - 查看 AI 建议的效果</span>
            </div>
            <div class="preview-actions">
              <a-button @click="cancelPreview" size="small" type="outline">
                <template #icon><icon-close /></template>
                取消
              </a-button>
              <a-button @click="confirmPreview" type="primary" size="small">
                <template #icon><icon-check /></template>
                应用修改
              </a-button>
            </div>
          </div>
        </div>

           <!-- Visual Editor Toolbars (outside zoom wrapper) -->
    <template v-if="visualEditorRef">
      <RightToolbar
        v-if="showAICreationPanel"
        ref="rightToolbarRef"
        @add-component="handleVisualEditorAddComponent"
        @panel-change="handleRightPanelChange"
        @mouseenter="handleHideFloatingBarMouseEnter"
        @ai-assistant="handleAIAssistant"
      />
      <TopToolbar
         v-if="!showAICreationPanel"
        ref="topToolbarRef"
        @add-component="handleVisualEditorAddComponent"
        @panel-change="handleRightPanelChange"
        @mouseenter="handleHideFloatingBarMouseEnter"
        @ai-assistant="handleAIAssistant"
      />
            
      <!-- Smart Layouts Panel (conditionally shown) -->
      <SmartLayoutsPanel
        v-if="showSmartLayoutsPanel"
        @close="showSmartLayoutsPanel = false"
        @apply-layout="handleApplyLayout"
      />
      
      <FloatingTextToolbar
        v-if="visualEditorRef"
        :visible="visualEditorRef.showTextToolbar"
        :position="visualEditorRef.textToolbarPosition"
        :selected-text="visualEditorRef.selectedTextData"
        @update-style="handleVisualEditorTextStyleUpdate"
        @delete="handleVisualEditorDelete"
        @copy="handleVisualEditorCopy"
        @duplicate="handleVisualEditorDuplicate"
        @layer-up="handleVisualEditorLayerUp"
        @layer-down="handleVisualEditorLayerDown"
        @layer-top="handleVisualEditorLayerTop"
        @layer-bottom="handleVisualEditorLayerBottom"
        @edit-link="handleVisualEditorEditLink"
      />
      
      <FloatingShapeToolbar
        v-if="visualEditorRef"
        :visible="visualEditorRef.showShapeToolbar"
        :position="visualEditorRef.shapeToolbarPosition"
        :selected-shape="visualEditorRef.selectedShapeData"
        @update-style="handleVisualEditorShapeStyleUpdate"
        @delete="handleVisualEditorDelete"
        @copy="handleVisualEditorCopy"
        @duplicate="handleVisualEditorDuplicate"
        @layer-up="handleVisualEditorLayerUp"
        @layer-down="handleVisualEditorLayerDown"
        @layer-top="handleVisualEditorLayerTop"
        @layer-bottom="handleVisualEditorLayerBottom"
      />
      
      <FloatingImageToolbar
        v-if="visualEditorRef"
        :visible="visualEditorRef.showImageToolbar"
        :position="visualEditorRef.imageToolbarPosition"
        :selected-image="visualEditorRef.selectedImageData"
        @replace="handleVisualEditorImageReplace"
        @crop="handleVisualEditorImageCrop"
        @filter="handleVisualEditorImageFilter"
        @delete="handleVisualEditorDelete"
        @copy="handleVisualEditorCopy"
        @duplicate="handleVisualEditorDuplicate"
        @layer-up="handleVisualEditorLayerUp"
        @layer-down="handleVisualEditorLayerDown"
        @layer-top="handleVisualEditorLayerTop"
        @layer-bottom="handleVisualEditorLayerBottom"
      />
      
      <FloatingChartToolbar
        v-if="visualEditorRef"
        :visible="visualEditorRef.showChartToolbar"
        :position="visualEditorRef.chartToolbarPosition"
        :selected-chart="visualEditorRef.selectedChartData"
        @edit-data="handleVisualEditorChartEditData"
        @change-type="handleVisualEditorChartChangeType"
        @delete="handleVisualEditorDelete"
        @copy="handleVisualEditorCopy"
        @duplicate="handleVisualEditorDuplicate"
        @layer-up="handleVisualEditorLayerUp"
        @layer-down="handleVisualEditorLayerDown"
        @layer-top="handleVisualEditorLayerTop"
        @layer-bottom="handleVisualEditorLayerBottom"
      />
      
      <FloatingVideoToolbar
        v-if="visualEditorRef"
        :visible="visualEditorRef.showVideoToolbar"
        :position="visualEditorRef.videoToolbarPosition"
        :selected-video="visualEditorRef.selectedVideoData"
        @replace-url="handleVisualEditorVideoReplaceUrl"
        @delete="handleVisualEditorDelete"
        @copy="handleVisualEditorCopy"
        @duplicate="handleVisualEditorDuplicate"
        @layer-up="handleVisualEditorLayerUp"
        @layer-down="handleVisualEditorLayerDown"
        @layer-top="handleVisualEditorLayerTop"
        @layer-bottom="handleVisualEditorLayerBottom"
      />
      
      <FloatingTableToolbar
        v-if="visualEditorRef"
        :visible="visualEditorRef.showTableToolbar"
        :position="visualEditorRef.tableToolbarPosition"
        @add-row="handleVisualEditorAddTableRow"
        @delete-row="handleVisualEditorDeleteTableRow"
        @add-column="handleVisualEditorAddTableColumn"
        @delete-column="handleVisualEditorDeleteTableColumn"
        @delete="handleVisualEditorDelete"
        @duplicate="handleVisualEditorDuplicate"
        @layer-up="handleVisualEditorLayerUp"
        @layer-down="handleVisualEditorLayerDown"
        @layer-top="handleVisualEditorLayerTop"
        @layer-bottom="handleVisualEditorLayerBottom"
      />
    </template>
      </div>

    </div>

    <!-- Present Mode Fullscreen -->
    <div v-if="isPresentMode" class="present-mode" @mousemove="handleMouseMove">
      <div class="present-header" :class="{ visible: showPresentControls }">
        <div class="present-title">{{ documentTitle }}</div>
        <div class="present-controls">
          <span class="present-counter">{{ currentSlideIndex + 1 }} / {{ parsedSlides.length }}</span>
          <a-button size="small" type="text" @click="exitPresentMode">
            <icon-close :size="20" />
          </a-button>
        </div>
      </div>
      
      <div class="present-canvas" @click="handlePresentClick" :style="currentThemeStyle">
        <div v-if="currentSlide" class="present-slide-wrapper">
          <VisualEditorProto
            :slide-data="currentVisualData"
            :theme-style="currentThemeStyle"
            :readonly="true"
            class="present-visual-editor"
            :style="{ transform: `scale(${presentScale})` }"
          />
        </div>
      </div>

      <div class="present-footer" :class="{ visible: showPresentControls }">
        <a-button-group>
          <a-button size="large" :disabled="currentSlideIndex === 0" @click="prevSlide">
            <icon-left :size="20" />
          </a-button>
          <a-button size="large" :disabled="currentSlideIndex >= parsedSlides.length - 1" @click="nextSlide">
            <icon-right :size="20" />
          </a-button>
        </a-button-group>
        <div class="present-hint">Use arrow keys, space, or click to navigate • ESC to exit</div>
      </div>
    </div>

    <!-- Insertion Options Dialog -->
    <a-modal 
      v-model:visible="showInsertionDialog"
      title="选择插入方式"
      @ok="confirmInsertSlides"
      @cancel="cancelInsertSlides"
      :ok-text="'确认插入'"
      :cancel-text="'取消'"
    >
      <div class="insertion-options">
        <a-radio-group v-model="insertionOption" direction="vertical">
          <a-radio value="replace">
            <div class="radio-option">
              <div class="option-title">替换所有幻灯片</div>
              <div class="option-desc">删除现有内容，使用新生成的幻灯片</div>
            </div>
          </a-radio>
          <a-radio value="insert">
            <div class="radio-option">
              <div class="option-title">在当前位置插入</div>
              <div class="option-desc">在当前幻灯片后插入新内容</div>
            </div>
          </a-radio>
          <a-radio value="append">
            <div class="radio-option">
              <div class="option-title">追加到末尾</div>
              <div class="option-desc">在所有幻灯片之后添加新内容</div>
            </div>
          </a-radio>
        </a-radio-group>
      </div>
    </a-modal>

    <!-- Template Selection Modal -->
    <a-modal 
      v-model:visible="showTemplateModal"
      :footer="false"
      :body-style="{ padding: '0' , borderRadius: '1.5rem'}"
      :width="'90%'"
      style="border-radius: 1.5rem"
      :closable="false"
      :mask-closable="true"
      modal-class="template-selection-modal"
    >
      <div class="template-modal-wrapper">
        <!-- Modal Header -->
        <div class="template-modal-header">
          <div class="header-info">
            <h2 class="header-title">{{ t('slide.selectTemplate') }}</h2>
            <p class="header-subtitle">{{ t('slide.templateSubtitle') }}</p>
          </div>
          <button class="close-button" @click="showTemplateModal = false">
            <icon-close :size="24" />
          </button>
        </div>

        <!-- Category Tabs -->
        <div class="template-categories-wrapper">
          <div class="template-categories">
            <button 
              v-for="category in templateCategories"
              :key="category.key"
              class="category-btn"
              :class="{ active: activeThemeCategory === category.key }"
              @click="activeThemeCategory = category.key"
            >
              {{ t(category.label) }}
            </button>
          </div>
        </div>

        <!-- Template Grid -->
        <div class="template-grid-wrapper">
          <div class="template-grid-container">
            <div 
              v-for="theme in themesByCategory[activeThemeCategory]" 
              :key="theme.name"
              class="template-item"
              @click="applyTemplate(theme.name)"
            >
              <!-- Template Preview Card -->
              <div 
                class="template-preview-card" 
                :class="{ 'is-current': currentTheme === theme.name }"
                :style="{ background: theme.preview }"
              >
                <div class="template-preview-inner" :style="theme.slideStyle">
                  <div class="preview-bar"></div>
                  <div class="preview-title-text">{{ theme.label }}</div>
                  <div class="preview-subtitle-text">{{ t('slide.professionalStyle') }}</div>
                </div>
                
                <!-- Current Badge -->
                <div v-if="currentTheme === theme.name" class="current-template-badge">
                  {{ t('slide.current') }}
                </div>
                
                <!-- Hot Badge -->
                <div v-if="theme.hot" class="hot-badge">
                  HOT
                </div>
                
                <!-- Hover Overlay -->
                <div class="template-hover-overlay"></div>
              </div>
              
              <!-- Template Info Footer -->
              <div class="template-item-footer">
                <div class="template-meta">
                  <div class="template-name-text">{{ theme.label }}</div>
                  <div class="template-usage-text">{{ t('slide.usageCount', { count: theme.usage || 0 }) }}</div>
                </div>
                
                <!-- Apply Button / Check Icon -->
                <icon-check 
                  v-if="currentTheme === theme.name"
                  :size="20"
                  class="check-icon"
                />
                <button 
                  v-else
                  class="apply-template-btn"
                  @click.stop="applyTemplate(theme.name)"
                >
                  {{ t('slide.apply') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Recommendation Section -->
        <div class="template-ai-recommendation">
          <div class="ai-recommendation-icon">
            
            <Icon name='home-magic-wand'  :size="24"/>
          </div>
          <div class="ai-recommendation-content">
            <h3 class="ai-recommendation-title">{{ t('slide.aiRecommendation.title') }}</h3>
            <p class="ai-recommendation-desc">{{ t('slide.aiRecommendation.description') }}</p>
            <a-button type="primary" class="ai-recommendation-button">
            <Icon name='star-fall'  :size="24"/>
              
              {{ t('slide.aiRecommendation.button') }}
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>

 

    <DocumentsDrawer
      v-model="docDrawerVisible"
      :documents="documentList"
      :current-document-id="String(route.params.docId)"
      :is-trash-view="viewTrash"
      :loading="docDrawerLoading"
      :scope="docScope"
      :stats="docStats"
      @toggle-trash="toggleTrash"
      @select="handleSelectDocFromDrawer"
      @create="handleCreateDocument"
      @delete="handleDeleteDocument"
      @restore="handleRestoreDocument"
      @permanent-delete="handlePermanentDeleteDocument"
      @rename="handleRenameDocument"
      @change-scope="onChangeDocScope"
      @batch-delete="handleBatchDeleteDocuments"
    />

    <CreateDocumentDialog
      v-model:visible="createDocVisible"
      v-model:name="createDocForm.name"
      :loading="createDocLoading"
      :type="createDocForm.type"
      @confirm="handleCreateDocumentConfirm"
      @cancel="handleCreateDocumentCancel"
    />

    <!-- Chat Panel Component -->
    <ChatPanel
      v-if="showChatPanel"
      :current-slide-index="currentSlideIndex"
      :parsed-slides="parsedSlides"
      :current-visual-data="currentVisualData"
      :current-theme-style="currentThemeStyle"
      @send-message="handleChatSendMessage"
      @preview-changes="handlePreviewChanges"
      @close="showChatPanel = false"
    />
  </div>
</template>

<script setup>
// ============================================================
// Vue Core & Router
// ============================================================
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { 
  IconPalette, IconShareAlt, IconPlayArrow, IconPlus, IconBarChart,
  IconLeft, IconRight, IconCode, IconClose, IconFileImage, IconSearch,
  IconFontColors, IconImage, IconApps, IconDown, IconEdit, IconCheck,
  IconLanguage, IconMenu, IconMinus, IconCommon, IconZoomIn, IconZoomOut,
  IconExpand, IconEye, IconDownload, IconNotification, IconUser,
  IconBgColors, IconRefresh
} from '@arco-design/web-vue/es/icon'
import { marked } from 'marked'

// ============================================================
// Components
// ============================================================
import EditorHeader from '@/components/editor-header/EditorHeader.vue'
import DocumentsDrawer from '@/components/editor-header/DocumentsDrawer.vue'
import CreateDocumentDialog from '@/components/slide-page/CreateDocumentDialog.vue'
import VisualEditorProto from '@/components/slide-page/VisualEditorProto.vue'  
import RightToolbar from '@/components/slide-page/RightToolbarContainer.vue'
import TopToolbar from '@/components/slide-page/TopToolbarContainer.vue'
import SlideThumbnailSidebar from '@/components/slide-page/SlideThumbnailSidebar.vue'
import BottomThumbnailStrip from '@/components/slide-page/BottomThumbnailStrip.vue'
import SmartLayoutsPanel from '@/components/slide-page/panels/SmartLayoutsPanel.vue'
import FloatingTextToolbar from '@/components/slide-page/floatingToolbar/FloatingTextToolbar.vue'
import FloatingShapeToolbar from '@/components/slide-page/floatingToolbar/FloatingShapeToolbar.vue'
import FloatingImageToolbar from '@/components/slide-page/floatingToolbar/FloatingImageToolbar.vue'
import FloatingChartToolbar from '@/components/slide-page/floatingToolbar/FloatingChartToolbar.vue'
import FloatingVideoToolbar from '@/components/slide-page/floatingToolbar/FloatingVideoToolbar.vue'
import FloatingTableToolbar from '@/components/slide-page/floatingToolbar/FloatingTableToolbar.vue'
import ChatPanel from '@/components/slide-page/ChatPanel.vue'
import EChartsChart from '@/components/slide-page/EChartsChart.vue'
import IIcon from '@/utils/slide/icon.js'

// ============================================================
// NEW: Business Logic Composables (Refactored)
// ============================================================
import { useThemeManager } from '../../composables/useThemeManager.ts'
import { useZoomControls } from '../../composables/useZoomControls.ts'
import { useSlideOperations } from '../../composables/useSlideOperations.ts'
import { useVisualDataManager } from '../../composables/useVisualDataManager.ts'
import { useAIGeneration } from '../../composables/useAIGeneration.ts'
import { usePresentMode } from '../../composables/usePresentMode.ts'
import { useKeyboardShortcuts } from '../../composables/useKeyboardShortcuts.ts'
import { useDocumentIntegration } from '../../composables/useDocumentIntegration.ts'
import { useLayoutApplication } from '../../composables/useLayoutApplication.ts'
import { useChatIntegration } from '../../composables/useChatIntegration.ts'

// ============================================================
// Existing Composables & Utilities
// ============================================================
import { useDocumentOperations } from '../../composables/useDocumentOperations.ts'
import { useDocumentMeta } from '../../composables/useDocumentMeta.ts'
import { useSlideAutoSave } from '../../composables/useSlideAutoSave.ts'
import { usePreviewMode } from '../../composables/usePreviewMode.ts'
import { parseMarkdownToVisual, convertVisualToMarkdown } from '../../utils/slide/markdownVisualConverter.js'
import { applyLayoutToSlide } from '../../utils/slide/layoutApplier.js'
import { applySuggestions } from '../../composables/useAISuggestionApplier.ts'
import { unwrapResponse } from '@/api/response'
import { presentationApi } from '@/api/presentation'
import { getLayoutById } from '../../utils/slide/smartLayoutTemplates.js'
import DEFAULT_PRESENTATION from '@/data/defaultPresentation.js'
import { uploadApi } from '@/api/file'

// ============================================================
// Global State
// ============================================================
const Icon = IIcon
let mouseLeaveTimeout = null

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const documentTitle = ref(t('doc.untitled'))
const logoSrc = ref(`${import.meta.env.BASE_URL}logo.png`)

// ============================================================
// Core Reactive State
// ============================================================
const markdownContent = ref('')

const showMarkdownEditor = ref(false)
const showThemePanel = ref(false)
const showTemplateModal = ref(false)
const showAIPanel = ref(false)
const showChatPanel = ref(false)
const showSmartLayoutsPanel = ref(false)
const showAICreationPanel = ref(false)
const thumbnailViewMode = ref('filmstrip')
const visualEditorRef = ref(null)
const rightToolbarRef = ref(null)
const topToolbarRef = ref(null)
const jsonFileInputRef = ref(null)
const bgFileInputRef = ref(null)

// Background settings
const currentSlideBackground = ref('')
const slideBackgrounds = ref({})

// Quick color presets for background dropdown - 精选配色方案
const quickColors = [
  // 基础色系
  '#FFFFFF', // 纯白
  '#F8F9FA', // 浅灰白
  '#E9ECEF', // 中灰白
  '#DEE2E6', // 深灰白
  
  // 蓝色系
  '#E3F2FD', // 天空蓝
  '#BBDEFB', // 浅蓝
  '#90CAF9', // 明亮蓝
  '#2196F3', // 标准蓝
  '#1976D2', // 深蓝
  '#0D47A1', // 海军蓝
  
  // 绿色系
  '#E8F5E9', // 薄荷绿
  '#C8E6C9', // 浅绿
  '#81C784', // 草绿
  '#4CAF50', // 标准绿
  '#388E3C', // 深绿
  '#1B5E20', // 墨绿
  
  // 紫色系
  '#F3E5F5', // 淡紫
  '#E1BEE7', // 浅紫
  '#BA68C8', // 亮紫
  '#9C27B0', // 标准紫
  '#7B1FA2', // 深紫
  '#4A148C', // 暗紫
  
  // 橙色系
  '#FFF3E0', // 杏色
  '#FFE0B2', // 浅橙
  '#FFB74D', // 明橙
  '#FF9800', // 标准橙
  '#F57C00', // 深橙
  '#E65100', // 暗橙
  
  // 红色系
  '#FFEBEE', // 粉红
  '#FFCDD2', // 浅红
  '#EF5350', // 亮红
  '#F44336', // 标准红
  '#D32F2F', // 深红
  '#B71C1C', // 暗红
  
  // 黄色系
  '#FFFDE7', // 淡黄
  '#FFF9C4', // 浅黄
  '#FFF176', // 明黄
  '#FFEB3B', // 标准黄
  '#FBC02D', // 金黄
  '#F57F17', // 深黄
  
  // 青色系
  '#E0F7FA', // 淡青
  '#B2EBF2', // 浅青
  '#4DD0E1', // 明青
  '#00BCD4', // 标准青
  '#0097A7', // 深青
  '#006064', // 暗青
  
  // 深色系
  '#ECEFF1', // 浅灰
  '#CFD8DC', // 中灰
  '#90A4AE', // 灰蓝
  '#607D8B', // 深灰蓝
  '#455A64', // 暗灰
  '#263238', // 炭黑
]


// AI Creation Sidebar state
const slidePrompt = ref('')
const isGeneratingOutline = ref(false)
const showInsertionDialog = ref(false)
const insertionOption = ref('replace')

// Visual editor state per slide
const visualSlideData = ref({})

// Template categories for modal
const templateCategories = [
  { key: 'all', label: 'slide.templateCategories.all' },
  { key: 'business', label: 'slide.templateCategories.business' },
  { key: 'tech', label: 'slide.templateCategories.tech' },
  { key: 'education', label: 'slide.templateCategories.education' },
  { key: 'medical', label: 'slide.templateCategories.medical' },
  { key: 'finance', label: 'slide.templateCategories.finance' },
  { key: 'marketing', label: 'slide.templateCategories.marketing' },
  { key: 'minimal', label: 'slide.templateCategories.minimal' }
]

// ============================================================
// 1. THEME MANAGER COMPOSABLE
// ============================================================
const {
  themes,
  currentTheme,
  currentThemeStyle,
  themesByCategory,
  activeThemeCategory,
  previousThemeColor,
  selectTheme
} = useThemeManager()

// Computed theme style with background override
const computedThemeStyle = computed(() => {
  const baseStyle = currentThemeStyle.value || {}
  const slideBackground = slideBackgrounds.value[currentSlideIndex.value]
  
  if (slideBackground) {
    return {
      ...baseStyle,
      background: slideBackground.value,
      ...(slideBackground.type === 'image' && {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      })
    }
  }
  
  return baseStyle
})

// ============================================================
// 2. SLIDE OPERATIONS COMPOSABLE
// ============================================================
const {
  currentSlideIndex,
  parsedSlides,
  currentSlide,
  prevSlide,
  nextSlide,
  addNewSlide,
  isAddingSlide,
  handleSlideReorder,
  handleCopySlide,
  handleDeleteSlide
} = useSlideOperations(markdownContent, t)

// ============================================================
// 3. VISUAL DATA MANAGER COMPOSABLE
// ============================================================
const {
  currentVisualData,
  getSlideVisualData,
  handleVisualDataUpdate,
  clearVisualCache
} = useVisualDataManager(parsedSlides, currentSlideIndex, markdownContent, currentThemeStyle)

// ============================================================
// 4. ZOOM CONTROLS COMPOSABLE
// ============================================================
const {
  zoomLevel,
  zoomPresets,
  canvasZoomStyle,
  zoomIn,
  zoomOut,
  resetZoom,
  setZoom,
  fitToWindow
} = useZoomControls()

// Smart initial zoom based on viewport size
const initializeSmartZoom = () => {
  const viewportWidth = window.innerWidth
  
  // For smaller screens, use a more comfortable zoom level
  if (viewportWidth < 1400) {
    // Small screens: 75% looks better
    setZoom(75)
  } else if (viewportWidth < 1600) {
    // Medium screens: 85% is comfortable
    setZoom(85)
  } else {
    // Large screens: 100% is fine
    setZoom(100)
  }
}

// Re-adjust on window resize (debounced)
let resizeTimer
const handleResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    initializeSmartZoom()
  }, 300)
}

// Initialize smart zoom on mount - AFTER document loads
onMounted(() => {
  // Defer initialization to avoid blocking
  nextTick(() => {
    initializeSmartZoom()
  })
  
  // Register event listeners
  window.addEventListener('resize', handleResize)
  registerKeyboardListeners()
  registerPresentListeners()
})

onBeforeUnmount(() => {
  // Remove event listeners
  window.removeEventListener('resize', handleResize)
  removeKeyboardListeners()
  removePresentListeners()
})

// ============================================================
// 5. AI GENERATION COMPOSABLE
// ============================================================
const {
  aiPrompt,
  aiMode,
  isGenerating,
  handleGenerateFromPrompt,
  handleQuickAction,
  // applyTemplate
} = useAIGeneration(markdownContent, parsedSlides, t)

// ============================================================
// 6. PRESENT MODE COMPOSABLE
// ============================================================
const {
  isPresentMode,
  showPresentControls,
  presentScale,
  enterPresentMode,
  exitPresentMode,
  handlePresentClick,
  handleMouseMove,
  registerListeners: registerPresentListeners,
  removeListeners: removePresentListeners
} = usePresentMode(parsedSlides, currentSlideIndex)

// ============================================================
// 7. LAYOUT APPLICATION COMPOSABLE
// ============================================================
const {
  handleApplyLayout,
  stripMarkdown,
  parseTextIntoSections,
  applyTextWithSmartLineBreaking,
  applySimpleLineBreaking,
  applyBulletListLayout,
  applyBoxesLayout,
  applyLayoutToSlideWithContent
} = useLayoutApplication(currentVisualData, currentThemeStyle, handleVisualDataUpdate, t)

// ============================================================
// 8. CHAT INTEGRATION COMPOSABLE
// ============================================================
const {
  handleChatSendMessage
} = useChatIntegration(
  currentVisualData,
  currentThemeStyle,
  currentSlideIndex,
  visualSlideData,
  handleVisualDataUpdate,
  selectTheme,
  applyTextWithSmartLineBreaking,
  t
)

// ============================================================
// Document Management (existing pattern)
// ============================================================
const docDrawerVisible = ref(false)
const docDrawerLoading = ref(false)
const documentList = ref([])
const docScope = ref('mine')
const viewTrash = ref(false)
const docStats = ref({ mine: 0, shared: 0, all: 0 })
const createDocVisible = ref(false)
const createDocLoading = ref(false)
const createDocForm = ref({ name: '', type: 'slide' })

// Composables
const { loadDocumentList } = useDocumentMeta({
  currentDocumentId: computed(() => String(route.params.docId || '')),
  currentDocumentName: documentTitle,
  documentList,
  viewTrash,
  docDrawerVisible,
  t
})

const refreshDocStats = async () => {
  try {
    // Note: presentationApi doesn't have getStats endpoint yet
    // This will need to be implemented on the backend
    const res = await presentationApi.getAll()
    const payload = unwrapResponse(res)
    if (payload.code === 200) {
      // For now, just count the presentations
      const presentations = payload.data?.presentations || []
      docStats.value = {
        total: presentations.length,
        active: presentations.length,
        deleted: 0
      }
    }
  } catch {
    // ignore
  }
}

const {
  handleRenameDocument,
  handleBatchDeleteDocuments,
  handleDeleteDocument,
  handleRestoreDocument,
  handlePermanentDeleteDocument,
  handleCreateDocument,
  handleCreateDocumentConfirm,
  handleCreateDocumentCancel
} = useDocumentOperations({
  currentDocumentId: computed(() => String(route.params.docId || '')),
  currentDocumentName: documentTitle,
  documentList,
  docScope,
  viewTrash,
  docDrawerLoading,
  createDocForm,
  createDocVisible,
  createDocLoading,
  router,
  loadDocumentList,
  refreshDocStats,
  t
})

// Auto-save composable
const {
  startAutoSave,
  stopAutoSave,
  handleManualSave,
  saveStatus
} = useSlideAutoSave({
  docId: computed(() => String(route.params.docId || '')),
  markdownContent
})

// Preview mode composable
const {
  isPreviewMode,
  handlePreviewChanges,
  confirmPreview,
  cancelPreview
} = usePreviewMode({
  visualSlideData,
  currentSlideIndex,
  generateMarkdownFromVisual: async () => {
    // Convert current visual data to markdown and save
    const slideKey = `slide-${currentSlideIndex.value}`
    const currentData = visualSlideData.value[slideKey]
    if (currentData) {
      handleVisualDataUpdate(currentData)
    }
  }
})

// ============================================================
// 9. KEYBOARD SHORTCUTS COMPOSABLE
// ============================================================
const keyboardShortcutsDeps = computed(() => ({
  isPresentMode,
  visualEditorRef,
  handleManualSave,
  nextSlide,
  prevSlide,
  exitPresentMode,
  zoomIn,
  zoomOut,
  resetZoom,
  deleteCurrentSlide: handleDeleteSlide
}))

const {
  handleCanvasKeydown,
  registerListeners: registerKeyboardListeners,
  removeListeners: removeKeyboardListeners
} = useKeyboardShortcuts(keyboardShortcutsDeps.value)

// ============================================================
// Utility State
// ============================================================
let abortController = null

// ============================================================
// UI Interaction Handlers
// ============================================================
// Handle canvas click (deselect elements when clicking empty area)
const handleCanvasClick = () => {
  if (visualEditorRef.value && visualEditorRef.value.deselectAll) {
    visualEditorRef.value.deselectAll()
  }
}


// ============================================================
// Document Loading
// ============================================================
onMounted(async () => {
  console.log('[slide-page] Component mounted, loading slide document')
  
  const docId = String(route.params.docId || '')
  if (!docId) {
    console.warn('[slide-page] No document ID provided, initializing with professional demo presentation')
    markdownContent.value = DEFAULT_PRESENTATION
    documentTitle.value = 'JitSlide Studio - 产品演示'
    return
  }
  
  try {
    console.log('[slide-page] Loading document:', docId)
    const res = await presentationApi.getById(docId)
    const payload = unwrapResponse(res)
    
    if (payload.code === 200 && payload.data?.presentation) {
      const doc = payload.data.presentation
      documentTitle.value = doc.title || t('doc.untitled')
      
     // Load slide content
      if (doc.content) {
        // Check if content is a string (markdown) or object (Konva PPT data)
        if (typeof doc.content === 'string') {
          // Markdown format
          markdownContent.value = doc.content
          console.log('[slide-page] Loaded markdown content:', markdownContent.value.substring(0, 100))
        } else if (typeof doc.content === 'object' && doc.content.slides) {
          // Konva PPT format from template
          console.log('[slide-page] Loaded PPT data with', doc.content.slides.length, 'slides')
          // TODO: We need to either:
          // 1. Convert Konva data to markdown
          // 2. Load directly into canvas without markdown
          // For now, initialize with empty markdown
          markdownContent.value = `# ${doc.title || 'Untitled'}\n\n从模板创建的 PPT`
          console.warn('[slide-page] PPT format detected, markdown conversion not yet implemented')
        } else {
          console.warn('[slide-page] Unknown content format:', typeof doc.content)
          markdownContent.value = `# ${doc.title || 'Untitled'}`
        }
      } else {
        console.warn('[slide-page] Document has no content, initializing with professional demo presentation')
        markdownContent.value = DEFAULT_PRESENTATION
      }
      
      // Start auto-save
      startAutoSave()
    } else {
      console.error('[slide-page] Failed to load document:', payload)
      Message.error(t('doc.loadFailed') || 'Failed to load document')
      // Initialize with default content
      markdownContent.value = `# New Presentation\n\n- Start creating`
    }
  } catch (error) {
    console.error('[slide-page] Error loading document:', error)
    Message.error(t('doc.loadFailed') || 'Failed to load document')
    // Initialize with default content
    markdownContent.value = `# New Presentation\n\n- Start creating`
}
})

onBeforeUnmount(() => {
  // Stop auto-save when leaving
  stopAutoSave()
})

// ============================================================
// Document & Navigation Functions
// ============================================================

// Return to home page
const handleGoHome = () => {
  router.push('/')
}

// Open document drawer
const handleOpenDocDrawer = async () => {
  try {
    docDrawerVisible.value = true
    // Load document list when opening drawer
    docDrawerLoading.value = true
    try {
      await loadDocumentList({ skipPageSettings: true, scope: docScope.value })
    } finally {
      docDrawerLoading.value = false
    }
    // Refresh statistics
    await refreshDocStats()
  } catch (err) {
    Message.error('Failed to open document list: ' + (err?.message || 'Unknown error'))
  }
}

// Select document from drawer
const handleSelectDocFromDrawer = (docId, docType) => {
  console.log('[slide-page] handleSelectDocFromDrawer:', docId, docType)
  docDrawerVisible.value = false
  // Navigate to the selected document
  if (docType === 'slide') {
    router.push(`/slide/${docId}`)
  } else if (docType === 'doc') {
    router.push(`/${docId}`)
  } else if (docType === 'sheet') {
    router.push(`/sheet/${docId}`)
  } else if (docType === 'mindmap') {
    router.push(`/mindmap/${docId}`)
  }
}

// Toggle trash view
const toggleTrash = async () => {
  viewTrash.value = !viewTrash.value
  // Refresh list after toggling view
  docDrawerLoading.value = true
  try {
    await loadDocumentList({ skipPageSettings: true, scope: docScope.value })
  } finally {
    docDrawerLoading.value = false
  }
}

// Handle document scope change
const onChangeDocScope = async (v) => {
  const map = ['mine', 'shared', 'all']
  const normalize = val => {
    if (typeof val === 'string') return map.includes(val) ? val : 'mine'
    if (typeof val === 'number') {
      const idx = Math.max(0, Math.min(map.length - 1, val - 1))
      return map[idx]
    }
    const s = val?.target?.value ?? val?.value
    return (typeof s === 'string' && map.includes(s)) ? s : 'mine'
  }
  const next = normalize(v)
  docScope.value = next
  docDrawerLoading.value = true
  try {
    await loadDocumentList({ skipPageSettings: true, scope: next })
    await refreshDocStats()
  } finally {
    docDrawerLoading.value = false
  }
}

// Handle title change
const handleTitleChange = async (newName) => {
  try {
    const res = await presentationApi.update(route.params.docId, { title: newName })
    const payload = unwrapResponse(res)
    if (payload.code === 200) {
      documentTitle.value = newName
      
      // Update document list cache to prevent stale data fallback
      if (documentList.value) {
        const targetDoc = documentList.value.find(doc => doc.id === route.params.docId)
        if (targetDoc) {
          targetDoc.title = newName
        }
      }
      
      Message.success(t('common.success') || 'Renamed successfully')
      
      // Notify other tabs/windows to update document list
      try {
        localStorage.setItem('pxdoc:documents:updated', String(Date.now()))
      } catch (e) {}
    } else {
      Message.error(payload.message || t('doc.saveFailed') || 'Failed to rename')
    }
  } catch (error) {
    console.error('[handleTitleChange] error:', error)
    Message.error(`${t('doc.saveFailed')}: ${error?.message || 'Unknown error'}`)
  }
}

// Prevent floating bar from hiding when hovering over UI elements
const handleHideFloatingBarMouseEnter = () => {
  // This function prevents the floating bar from auto-hiding
  // when the user hovers over header or toolbar elements
  if (!visualEditorRef.value) return
  
  visualEditorRef.value.showShapeToolbar = false
  visualEditorRef.value.showTextToolbar = false
  visualEditorRef.value.showImageToolbar = false
  visualEditorRef.value.showChartToolbar = false
  visualEditorRef.value.showVideoToolbar = false
  visualEditorRef.value.showTableToolbar = false
  
}
const handleAIAssistant = () => {
  console.log('[slide-page] AI Assistant clicked')
  // showAICreationPanel.value = !showAICreationPanel.value
  showChatPanel.value = !showChatPanel.value
}

// Handle sidebar tab change
const handleSidebarTabChange = (tab) => {
  console.log('[slide-page] Sidebar tab changed to:', tab)
  // You can add additional logic here if needed
  // For example, track analytics or adjust UI state
} 

// ============================================================
// Helper Functions (keep existing utility functions)
// ============================================================

// Get or create visual data for current slide (DEPRECATED - now in composable)
const oldCurrentVisualData = computed(() => {
  const slideKey = `slide-${currentSlideIndex.value}`
  
  if (!visualSlideData.value[slideKey]) {
    // Parse markdown content to visual components
    const slide = currentSlide.value
    
    if (slide && slide.raw) {
      // Pass theme color to converter
      const themeColor = currentThemeStyle.value?.color || '#333'
      const parsed = parseMarkdownToVisual(slide.raw, themeColor)
      visualSlideData.value[slideKey] = parsed
      console.log('[currentVisualData] Parsed slide', currentSlideIndex.value, ':', {
        slideKey,
        raw: slide.raw.substring(0, 100),
        parsed
      })
    } else {
      // Empty state for non-markdown slides
      visualSlideData.value[slideKey] = {
        texts: [],
        images: [],
        rectangles: [],
        circles: [],
        charts: []
      }
      console.warn('[currentVisualData] Empty visual data for slide', currentSlideIndex.value, 'slide:', slide)
    }
  }
  return visualSlideData.value[slideKey]
})

// Clear visual data cache when markdown content changes (e.g., after loading from server)
watch(() => markdownContent.value, () => {
  console.log('[slide-page] Markdown content changed, clearing visual cache')
  visualSlideData.value = {}
})



// Handle Right Panel Change from RightToolbar
const handleRightPanelChange = (panelName) => {
  if (panelName === 'layouts') {
    showSmartLayoutsPanel.value = true
  } else {
    showSmartLayoutsPanel.value = false
  }
}


// Visual Editor Toolbar Handlers (delegate to child component)
const handleVisualEditorAddComponent = (component) => {
  if (visualEditorRef.value && visualEditorRef.value.handleAddComponent) {
    visualEditorRef.value.handleAddComponent(component)
  }
}

// AI Creation Sidebar Methods
const getSlideTitle = (index) => {
  const slide = parsedSlides.value[index]
  if (!slide) return `幻灯片 ${index + 1}`
  
  // Try to get title from visual data first
  const visualData = getSlideVisualData(index)
  if (visualData?.texts && visualData.texts.length > 0) {
    // Find the largest/first text as title
    const titleText = visualData.texts.find(t => t.fontSize > 20) || visualData.texts[0]
    if (titleText?.text) {
      return titleText.text.substring(0, 30) + (titleText.text.length > 30 ? '...' : '')
    }
  }
  
  // Fallback to markdown content
  if (slide.content) {
    const firstLine = slide.content.split('\n')[0].replace(/^#+\s*/, '')
    return firstLine.substring(0, 30) + (firstLine.length > 30 ? '...' : '')
  }
  
  return `幻灯片 ${index + 1}`
}

const handleGenerateOutline = async () => {
  if (!slidePrompt.value.trim()) {
    Message.warning('请输入PPT主题描述')
    return
  }
  
  isGeneratingOutline.value = true
  
  try {
    // Generate outline using AI
    const prompt = `请基于以下主题生成PPT大纲：

${slidePrompt.value}

要求：
1. 生成5-8个章节
2. 每个章节包含标题和要点
3. 使用Markdown格式
4. 使用---分隔每个章节`
    
    await handleGenerateFromPrompt('all', prompt)
    
    Message.success('大纲生成成功！')
  } catch (error) {
    console.error('[handleGenerateOutline] Error:', error)
    Message.error('大纲生成失败，请重试')
  } finally {
    isGeneratingOutline.value = false
  }
}

const handleRenderPPT = () => {
  if (parsedSlides.value.length === 0) {
    Message.warning('请先生成内容大纲')
    return
  }
  
  // Show insertion options dialog
  showInsertionDialog.value = true
}

const confirmInsertSlides = async () => {
  showInsertionDialog.value = false
  
  try {
    const option = insertionOption.value
    
    if (option === 'replace') {
      // Replace all slides
      Message.info('正在替换所有幻灯片...')
      // Slides are already in parsedSlides from outline generation
      // Just clear visual cache to force re-render
      clearVisualCache()
      currentSlideIndex.value = 0
      Message.success(`已替换所有幻灯片，共 ${parsedSlides.value.length} 张`)
    } else if (option === 'insert') {
      // Insert at current position
      Message.info('正在当前位置插入幻灯片...')
      // Since markdown is already updated, just navigate to first new slide
      currentSlideIndex.value = Math.min(currentSlideIndex.value, parsedSlides.value.length - 1)
      Message.success(`已在当前位置插入 ${parsedSlides.value.length} 张幻灯片`)
    } else if (option === 'append') {
      // Append to end
      Message.info('正在末尾追加幻灯片...')
      currentSlideIndex.value = parsedSlides.value.length - 1
      Message.success(`已在末尾追加 ${parsedSlides.value.length} 张幻灯片`)
    }
    
    // Auto-save the changes
    await nextTick()
    handleManualSave()
    
  } catch (error) {
    console.error('[confirmInsertSlides] Error:', error)
    Message.error('插入幻灯片失败，请重试')
  }
}

const cancelInsertSlides = () => {
  showInsertionDialog.value = false
  insertionOption.value = 'replace' // Reset to default
}

const handleManualEdit = () => {
  showMarkdownEditor.value = true
}

const handleVisualEditorTextStyleUpdate = (styles) => {
  if (visualEditorRef.value && visualEditorRef.value.handleTextStyleUpdate) {
    visualEditorRef.value.handleTextStyleUpdate(styles)
  }
}

const handleVisualEditorShapeStyleUpdate = (styles) => {
  if (visualEditorRef.value && visualEditorRef.value.handleShapeStyleUpdate) {
    visualEditorRef.value.handleShapeStyleUpdate(styles)
  }
}

const handleVisualEditorDelete = () => {
  if (visualEditorRef.value && visualEditorRef.value.deleteSelected) {
    visualEditorRef.value.deleteSelected()
  }
}

const handleVisualEditorCopy = () => {
  if (visualEditorRef.value && visualEditorRef.value.copySelected) {
    visualEditorRef.value.copySelected()
  }
}

const handleVisualEditorDuplicate = () => {
  if (visualEditorRef.value && visualEditorRef.value.duplicateSelected) {
    visualEditorRef.value.duplicateSelected()
  }
}

const handleVisualEditorLayerUp = () => {
  if (visualEditorRef.value && visualEditorRef.value.moveLayerUp) {
    visualEditorRef.value.moveLayerUp()
  }
}

const handleVisualEditorLayerDown = () => {
  if (visualEditorRef.value && visualEditorRef.value.moveLayerDown) {
    visualEditorRef.value.moveLayerDown()
  }
}

const handleVisualEditorLayerTop = () => {
  if (visualEditorRef.value && visualEditorRef.value.moveLayerToTop) {
    visualEditorRef.value.moveLayerToTop()
  }
}

const handleVisualEditorLayerBottom = () => {
  if (visualEditorRef.value && visualEditorRef.value.moveLayerToBottom) {
    visualEditorRef.value.moveLayerToBottom()
  }
}

const handleVisualEditorEditLink = () => {
  if (visualEditorRef.value && visualEditorRef.value.handleEditLink) {
    visualEditorRef.value.handleEditLink()
  }
}

const handleVisualEditorImageReplace = () => {
  if (visualEditorRef.value && visualEditorRef.value.handleImageReplace) {
    visualEditorRef.value.handleImageReplace()
  }
}

const handleVisualEditorImageCrop = () => {
  if (visualEditorRef.value && visualEditorRef.value.handleImageCrop) {
    visualEditorRef.value.handleImageCrop()
  }
}

const handleVisualEditorImageFilter = (filterType) => {
  if (visualEditorRef.value && visualEditorRef.value.handleImageFilter) {
    visualEditorRef.value.handleImageFilter(filterType)
  }
}

// Chart Toolbar Handlers
const handleVisualEditorChartEditData = () => {
  if (visualEditorRef.value && visualEditorRef.value.handleChartEditData) {
    visualEditorRef.value.handleChartEditData()
  }
}

const handleVisualEditorChartChangeType = (newType) => {
  if (visualEditorRef.value && visualEditorRef.value.handleChartChangeType) {
    visualEditorRef.value.handleChartChangeType(newType)
  }
}

// Video Toolbar Handlers
const handleVisualEditorVideoReplaceUrl = () => {
  if (visualEditorRef.value && visualEditorRef.value.handleVideoReplaceUrl) {
    visualEditorRef.value.handleVideoReplaceUrl()
  }
}

// Table Toolbar Handlers
const handleVisualEditorAddTableRow = () => {
  if (visualEditorRef.value && visualEditorRef.value.addTableRow) {
    visualEditorRef.value.addTableRow()
  }
}

const handleVisualEditorDeleteTableRow = () => {
  if (visualEditorRef.value && visualEditorRef.value.deleteTableRow) {
    visualEditorRef.value.deleteTableRow()
  }
}

const handleVisualEditorAddTableColumn = () => {
  if (visualEditorRef.value && visualEditorRef.value.addTableColumn) {
    visualEditorRef.value.addTableColumn()
  }
}

const handleVisualEditorDeleteTableColumn = () => {
  if (visualEditorRef.value && visualEditorRef.value.deleteTableColumn) {
    visualEditorRef.value.deleteTableColumn()
  }
}

// ========== NEW AGENT SKILLS HANDLERS ==========

/**
 * Add AI-generated image to slide
 * @param {Object} payload - Image payload from Agent Skills
 * @param {string} payload.src - Image URL
 * @param {number} payload.x - X position
 * @param {number} payload.y - Y position
 * @param {number} payload.width - Image width
 * @param {number} payload.height - Image height
 */
const addImageToSlide = (payload) => {
  console.log('[addImageToSlide] Adding image:', payload)
  
  // Create Image object for Konva
  // NOTE: Don't set crossOrigin for external CDNs that don't support CORS
  // This allows the image to be displayed but prevents canvas operations like toDataURL()
  const imageObj = new window.Image()
  
  imageObj.onload = () => {
    console.log('[addImageToSlide] Image loaded successfully')
    
    // Calculate dimensions (maintain aspect ratio if needed)
    let width = payload.width || 400
    let height = payload.height || 300
    
    // If image dimensions differ significantly from requested, scale proportionally
    if (imageObj.naturalWidth && imageObj.naturalHeight) {
      const aspectRatio = imageObj.naturalWidth / imageObj.naturalHeight
      const requestedRatio = width / height
      
      // If aspect ratios differ significantly, adjust dimensions
      if (Math.abs(aspectRatio - requestedRatio) > 0.1) {
        if (aspectRatio > requestedRatio) {
          // Image is wider, adjust height
          height = width / aspectRatio
        } else {
          // Image is taller, adjust width
          width = height * aspectRatio
        }
      }
    }
    
    const newImage = {
      id: `img-${Date.now()}`,
      type: 'image',
      x: payload.x || 100,
      y: payload.y || 100,
      width: width,
      height: height,
      image: imageObj,  // Image object for Konva
      src: payload.src, // Keep original src for serialization
      draggable: true,
      name: `image-${Date.now()}`,
      __zIndex: 100 // Place above other elements
    }
    
    const currentData = currentVisualData.value
    if (!currentData.images) currentData.images = []
    currentData.images.push(newImage)
    
    console.log('[addImageToSlide] Updated visual data:', {
      totalImages: currentData.images.length,
      newImage: {
        id: newImage.id,
        x: newImage.x,
        y: newImage.y,
        width: newImage.width,
        height: newImage.height,
        hasImageObject: !!newImage.image
      }
    })
    
    handleVisualDataUpdate(currentData)
    Message.success(t('slide.imageAdded') || 'Image added successfully!')
  }
  
  imageObj.onerror = (error) => {
    console.error('[addImageToSlide] Image load error:', error)
    console.error('[addImageToSlide] Failed URL:', payload.src)
    
    // Provide helpful error message
    Message.error(
      t('slide.imageLoadFailed') || 
      'Failed to load image. The image URL may be blocked by CORS policy.'
    )
  }
  
  // Start loading the image (without crossOrigin to avoid CORS issues)
  imageObj.src = payload.src
}

/**
 * Add chart from ECharts option (Agent Skills format)
 * @param {Object} payload - Chart payload from Agent Skills
 * @param {Object} payload.echartOption - ECharts configuration object
 * @param {number} payload.x - X position (optional)
 * @param {number} payload.y - Y position (optional)
 * @param {number} payload.width - Chart width (optional)
 * @param {number} payload.height - Chart height (optional)
 */
const addChartFromEChartOption = (payload) => {
  console.log('[addChartFromEChartOption] Adding chart:', payload)
  
  try {
    const newChart = {
      id: `chart-${Date.now()}`,
      type: 'echarts',
      x: payload.x || 100,
      y: payload.y || 150,
      width: payload.width || 600,
      height: payload.height || 400,
      option: payload.echartOption,
      draggable: true,
      __zIndex: 100
    }
    
    const currentData = currentVisualData.value
    if (!currentData.charts) currentData.charts = []
    currentData.charts.push(newChart)
    
    console.log('[addChartFromEChartOption] Updated visual data:', {
      totalCharts: currentData.charts.length,
      newChart: {
        id: newChart.id,
        x: newChart.x,
        y: newChart.y,
        width: newChart.width,
        height: newChart.height
      }
    })
    
    handleVisualDataUpdate(currentData)
    Message.success(t('slide.chartAdded') || 'Chart added successfully!')
  } catch (error) {
    console.error('[addChartFromEChartOption] Failed to add chart:', error)
    Message.error(t('slide.chartError') || 'Failed to add chart')
  }
}

/**
 * Replace text on slide with optional smart layout application
 * @param {Object} payload - Text replacement payload from Agent Skills
 * @param {string} payload.oldText - Original text to replace
 * @param {string} payload.newText - New optimized text
 * @param {Object} payload.structure - Content structure analysis
 * @param {string} payload.recommendedLayout - Recommended layout ID
 * @param {boolean} applyLayout - Whether to apply recommended layout
 */


const replaceSlideText = (payload, applyLayout = false) => {
  console.log('[replaceSlideText] Replacing text:', { payload, applyLayout })
  
  const currentData = currentVisualData.value
  
  if (!currentData.texts || currentData.texts.length === 0) {
    console.warn('[replaceSlideText] No text elements found on slide')
    Message.warning('当前幻灯片没有文本元素')
    return
  }
  
  const newText = payload.newText || ''
  
  // Strip markdown formatting for visual display
  const cleanedText = stripMarkdown(newText)
  
  // 如果需要应用布局且有推荐
  if (applyLayout && payload.recommendedLayout) {
    console.log('[replaceSlideText] Applying layout:', payload.recommendedLayout)
    applySmartLayoutWithText(payload.recommendedLayout, cleanedText, currentData)
  } else {
    // 智能分行替换：将文本按段落拆分
    console.log('[replaceSlideText] Applying text without layout (smart line breaking)')
    applyTextWithSmartLineBreaking(cleanedText, currentData)
  }
  
  handleVisualDataUpdate(currentData)
  Message.success(t('slide.textUpdated') || 'Text updated successfully!')
}




/**
 * Apply smart layout with parsed text content
 * @param {string} layoutId - Layout template ID
 * @param {string} text - Text content to parse and layout
 * @param {Object} visualData - Current visual data
 */
const applySmartLayoutWithText = (layoutId, text, visualData) => {
  console.log('[applySmartLayoutWithText] Layout:', layoutId, 'Text length:', text.length)
  
  // Parse text into structured sections
  const sections = parseTextIntoSections(text)
  console.log('[applySmartLayoutWithText] Parsed sections:', sections)
  
  // Clear existing texts
  visualData.texts = []
  
  // Apply layout based on type
  if (layoutId.startsWith('bullets')) {
    applyBulletListLayout(sections, visualData)
  } else if (layoutId.startsWith('boxes')) {
    applyBoxesLayout(sections, visualData, layoutId)
  } else {
    // Fallback: single text block
    visualData.texts.push({
      id: `text-${Date.now()}`,
      text: text,
      x: 80,
      y: 150,
      fontSize: 16,
      fontWeight: 'normal',
      fill: '#1f2937',
      __zIndex: 1
    })
  }
}



/**
 * Fallback bullet list layout (original implementation)
 */
const applyBulletListLayoutFallback = (sections, visualData) => {
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
    
    section.bullets.forEach((bullet, bulletIdx) => {
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
 * Fallback boxes layout (original implementation)
 */
const applyBoxesLayoutFallback = (sections, visualData, layoutId) => {
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
    
    // Add box background
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
    
    // Section title
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
    
    // Bullets
    let bulletY = y + 40
    const maxBulletY = y + boxHeight - 10
    
    section.bullets.forEach((bullet, bulletIdx) => {
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
 * Add chart to slide
 * @param {Object} payload - Chart payload from Agent Skills
 * @param {string} payload.chartXml - ECharts XML configuration
 */
const addChartToSlide = (payload) => {
  console.log('[addChartToSlide] Adding chart:', payload)
  
  try {
    // Parse XML to get chart configuration
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(payload.chartXml, 'text/xml')
    
    // Extract chart data from XML
    const chartElement = xmlDoc.querySelector('chart')
    if (!chartElement) {
      throw new Error('Invalid chart XML: missing <chart> element')
    }
    
    const chartType = chartElement.getAttribute('type') || 'bar'
    const title = chartElement.querySelector('title')?.textContent || ''
    
    // Parse data series
    const series = Array.from(xmlDoc.querySelectorAll('series')).map(s => ({
      name: s.getAttribute('name') || '',
      data: s.textContent.split(',').map(v => parseFloat(v.trim()))
    }))
    
    const categories = xmlDoc.querySelector('xAxis categories')?.textContent.split(',').map(c => c.trim()) || []
    
    // Create ECharts configuration
    const newChart = {
      id: `chart-${Date.now()}`,
      type: 'echarts',
      x: 100,
      y: 150,
      width: 760,
      height: 400,
      config: {
        title: { text: title },
        tooltip: {},
        xAxis: { data: categories },
        yAxis: {},
        series: series.map(s => ({
          name: s.name,
          type: chartType,
          data: s.data
        }))
      }
    }
    
    const currentData = currentVisualData.value
    if (!currentData.charts) currentData.charts = []
    currentData.charts.push(newChart)
    
    handleVisualDataUpdate(currentData)
    Message.success(t('slide.chartAdded') || 'Chart added successfully!')
  } catch (error) {
    console.error('[addChartToSlide] Error:', error)
    Message.error(t('slide.chartError') || 'Failed to add chart')
  }
}

/**
 * Update slide layout based on AI optimization
 * @param {Array} layout - Array of layout adjustments
 * @param {string} layout[].id - Element ID
 * @param {number} layout[].x - New X position
 * @param {number} layout[].y - New Y position
 * @param {number} layout[].width - New width
 * @param {number} layout[].height - New height
 */
const updateSlideLayout = (layout) => {
  console.log('[updateSlideLayout] Updating layout:', layout)
  
  const currentData = currentVisualData.value
  
  // Apply layout adjustments to each element type
  layout.forEach(adjustment => {
    // Try to find element in texts
    if (currentData.texts) {
      const textElement = currentData.texts.find(t => t.id === adjustment.id)
      if (textElement) {
        if (adjustment.x !== undefined) textElement.x = adjustment.x
        if (adjustment.y !== undefined) textElement.y = adjustment.y
        if (adjustment.width !== undefined) textElement.width = adjustment.width
        if (adjustment.height !== undefined) textElement.height = adjustment.height
        return
      }
    }
    
    // Try to find element in images
    if (currentData.images) {
      const imageElement = currentData.images.find(img => img.id === adjustment.id)
      if (imageElement) {
        if (adjustment.x !== undefined) imageElement.x = adjustment.x
        if (adjustment.y !== undefined) imageElement.y = adjustment.y
        if (adjustment.width !== undefined) imageElement.width = adjustment.width
        if (adjustment.height !== undefined) imageElement.height = adjustment.height
        return
      }
    }
    
    // Try to find element in charts
    if (currentData.charts) {
      const chartElement = currentData.charts.find(c => c.id === adjustment.id)
      if (chartElement) {
        if (adjustment.x !== undefined) chartElement.x = adjustment.x
        if (adjustment.y !== undefined) chartElement.y = adjustment.y
        if (adjustment.width !== undefined) chartElement.width = adjustment.width
        if (adjustment.height !== undefined) chartElement.height = adjustment.height
        return
      }
    }
    
    // Try to find element in rectangles (shapes)
    if (currentData.rectangles) {
      const rectElement = currentData.rectangles.find(r => r.id === adjustment.id)
      if (rectElement) {
        if (adjustment.x !== undefined) rectElement.x = adjustment.x
        if (adjustment.y !== undefined) rectElement.y = adjustment.y
        if (adjustment.width !== undefined) rectElement.width = adjustment.width
        if (adjustment.height !== undefined) rectElement.height = adjustment.height
      }
    }
  })
  
  handleVisualDataUpdate(currentData)
  Message.success(t('slide.layoutUpdated') || 'Layout optimized successfully!')
}

const goToNextSlide = async () => {
  if (currentSlideIndex.value < parsedSlides.value.length - 1) {
    currentSlideIndex.value++;
  }
};

const goToPrevSlide = async () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--;
  }
};

const suggestChartFromData = async () => {
  // Analyze current slide content to extract potential data points
  const slideContent = currentSlide.value?.raw || '';
  
  // Look for numbers and percentages in the content
  const numbers = slideContent.match(/\d+(\.\d+)?/g) || [];
  
  if (numbers.length > 1) {
    // For now, just log that we detected numbers
    console.log('Detected numbers in slide:', numbers.slice(0, 5));
  }
};

const suggestFlowchartConversion = async () => {
  // Extract list items from the current slide
  const slideContent = currentSlide.value?.raw || '';
  
  // Look for list items
  const lines = slideContent.split('\n');
  const listItems = lines.filter(line => 
    line.trim().startsWith('- ') || 
    line.trim().startsWith('* ') || 
    /^\d+\.\s/.test(line)
  );
  
  if (listItems.length > 0) {
    // For now, just log that we detected list items
    console.log('Detected list items in slide:', listItems.length);
  }
};

// Add chart from AI-generated XML data
const addChartFromAI = async (chartDataXML, slideIndex) => {
  console.log('[addChartFromAI] Adding chart to slide', slideIndex);
  console.log('[addChartFromAI] Chart XML:', chartDataXML);
  
  try {
    // Parse XML to extract chart data
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(chartDataXML, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      console.error('[addChartFromAI] XML parsing error:', parseError[0].textContent);
      return;
    }
    
    // Extract chart properties
    const chartElement = xmlDoc.getElementsByTagName('chart')[0];
    if (!chartElement) {
      console.error('[addChartFromAI] No <chart> element found in XML');
      return;
    }
    
    const title = chartElement.getAttribute('title') || 'AI Generated Chart';
    const xLabelsStr = chartElement.getAttribute('x_labels') || '';
    const valuesStr = chartElement.getAttribute('values') || '';
    const colorsStr = chartElement.getAttribute('colors') || '';
    
    // Parse comma-separated values
    const xLabels = xLabelsStr.split(',').map(s => s.trim());
    const values = valuesStr.split(',').map(s => parseFloat(s.trim()));
    const colors = colorsStr.split(',').map(s => s.trim());
    
    console.log('[addChartFromAI] Parsed chart data:', { title, xLabels, values, colors });
    
    // Create chart component data
    const newChart = {
      id: `chart-${Date.now()}`,
      type: 'bar', // Default to bar chart
      title: title,
      x: 100,
      y: 150,
      width: 760,
      height: 400,
      data: {
        labels: xLabels,
        datasets: [{
          label: title,
          data: values,
          backgroundColor: colors.length > 0 ? colors : ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: title
          }
        }
      }
    };
    
    // Get target slide data
    const targetSlideKey = `slide-${slideIndex}`;
    if (!visualSlideData.value[targetSlideKey]) {
      visualSlideData.value[targetSlideKey] = {
        texts: [],
        images: [],
        rectangles: [],
        circles: [],
        charts: []
      };
    }
    
    // Add chart to the slide
    visualSlideData.value[targetSlideKey].charts.push(newChart);
    
    console.log('[addChartFromAI] Chart added successfully:', newChart);
    
    // Trigger visual data update
    handleVisualDataUpdate(visualSlideData.value[targetSlideKey]);
    
  } catch (error) {
    console.error('[addChartFromAI] Error adding chart:', error);
  }
};

// Apply general AI suggestion to slide
const applySuggestionToSlide = async (suggestionContent, slideIndex) => {
  console.log('[applySuggestionToSlide] Applying suggestion to slide', slideIndex);
  console.log('[applySuggestionToSlide] Content:', suggestionContent);
  
  const targetSlideKey = `slide-${slideIndex}`;
  const currentData = visualSlideData.value[targetSlideKey];
  
  if (!currentData) {
    console.warn('[applySuggestionToSlide] No visual data for slide', slideIndex);
    return;
  }
  
  try {
    // Use the applySuggestions composable
    const updatedData = applySuggestions(currentData, suggestionContent);
    
    // Trigger visual data update to reflect changes
    handleVisualDataUpdate(updatedData);
    
    console.log('[applySuggestionToSlide] Suggestions applied successfully');
    
  } catch (error) {
    console.error('[applySuggestionToSlide] Error applying suggestions:', error);
  }
};

/**
 * Apply intelligent layout based on AI analysis
 * @param {Object} payload - Layout payload from IntelligentLayoutSkill
 * @param {string} payload.layoutType - Layout type (bullets|boxes|columns)
 * @param {string} payload.variant - Specific variant
 * @param {Array} payload.sections - Structured content sections
 * @param {boolean} payload.preserveImages - Keep existing images
 * @param {boolean} payload.preserveCharts - Keep existing charts
 */
const applyIntelligentLayout = (payload) => {
  console.log('[applyIntelligentLayout] Applying intelligent layout:', payload)
  
  const currentData = currentVisualData.value
  const { layoutType, variant, sections, preserveImages, preserveCharts } = payload
  
  // Find matching layout template
  const layoutTemplate = findLayoutTemplate(layoutType, variant)
  
  if (!layoutTemplate) {
    console.error('[applyIntelligentLayout] Layout template not found:', variant)
    Message.error('Layout template not found')
    return
  }
  
  // Apply layout with content-aware positioning
  const newData = {
    texts: [],
    images: preserveImages ? (currentData.images || []) : [],
    rectangles: [],
    circles: [],
    charts: preserveCharts ? (currentData.charts || []) : []
  }
  
  const themeColor = currentThemeStyle.value?.color || '#333'
  
  // Apply layout based on type
  if (layoutType === 'bullets') {
    applyIntelligentBulletLayout(sections, newData, themeColor)
  } else if (layoutType === 'boxes') {
    applyIntelligentBoxLayout(sections, newData, themeColor, variant)
  } else if (layoutType === 'columns') {
    applyIntelligentColumnLayout(sections, newData, themeColor)
  }
  
  handleVisualDataUpdate(newData)
  Message.success(`Applied ${layoutType} layout intelligently!`)
}

/**
 * Find layout template by type and variant
 */
const findLayoutTemplate = (layoutType, variant) => {
  // This is a simplified version - you can import actual templates
  // For now, return a basic structure
  return {
    type: layoutType,
    variant: variant
  }
}

/**
 * Apply intelligent bullet layout with content
 */
const applyIntelligentBulletLayout = (sections, visualData, themeColor) => {
  const canvasHeight = 540
  const maxY = canvasHeight - 50
  let yOffset = 100
  
  sections.forEach((section, sectionIdx) => {
    if (yOffset > maxY) return
    
    // Add section title
    if (section.title && section.title !== `Section ${sectionIdx + 1}`) {
      visualData.texts.push({
        id: `text-title-${Date.now()}-${sectionIdx}`,
        text: section.title,
        x: 80,
        y: yOffset,
        fontSize: 24,
        fontWeight: 'bold',
        fill: themeColor,
        __zIndex: sectionIdx * 100
      })
      yOffset += 36
    }
    
    // Add bullet items
    section.items.forEach((item, itemIdx) => {
      if (yOffset > maxY) return
      
      visualData.texts.push({
        id: `text-bullet-${Date.now()}-${sectionIdx}-${itemIdx}`,
        text: `• ${item}`,
        x: 100,
        y: yOffset,
        fontSize: 16,
        fontWeight: 'normal',
        fill: '#4b5563',
        __zIndex: sectionIdx * 100 + itemIdx + 1
      })
      yOffset += 32
    })
    
    yOffset += 20 // Section spacing
  })
}

/**
 * Apply intelligent box layout with content
 */
const applyIntelligentBoxLayout = (sections, visualData, themeColor, variant) => {
  const boxCount = parseInt(variant.split('-')[1]) || 2
  const canvasWidth = 960
  const boxWidth = (canvasWidth - 160 - (boxCount - 1) * 20) / boxCount
  const boxHeight = 180
  const startX = 80
  const startY = 120
  
  const baseZIndex = Date.now()
  let shapeZIndex = baseZIndex
  let textZIndex = baseZIndex + 10000
  
  // Limit to available boxes
  const limitedSections = sections.slice(0, boxCount)
  
  limitedSections.forEach((section, idx) => {
    const x = startX + idx * (boxWidth + 20)
    
    // Create box rectangle
    visualData.rectangles.push({
      id: `rect-box-${Date.now()}-${idx}`,
      x: x,
      y: startY,
      width: boxWidth,
      height: boxHeight,
      fill: '#ffffff',
      stroke: '#e5e7eb',
      strokeWidth: 2,
      cornerRadius: 8,
      draggable: true,
      __zIndex: shapeZIndex++
    })
    
    // Add title
    visualData.texts.push({
      id: `text-box-title-${Date.now()}-${idx}`,
      text: section.title,
      x: x + 16,
      y: startY + 20,
      width: boxWidth - 32,
      fontSize: 18,
      fontWeight: 'bold',
      fill: themeColor,
      align: 'center',
      __zIndex: textZIndex++
    })
    
    // Add items (limit to 3)
    const limitedItems = section.items.slice(0, 3)
    limitedItems.forEach((item, itemIdx) => {
      visualData.texts.push({
        id: `text-box-item-${Date.now()}-${idx}-${itemIdx}`,
        text: `• ${item}`,
        x: x + 16,
        y: startY + 56 + (itemIdx * 28),
        width: boxWidth - 32,
        fontSize: 13,
        fontWeight: 'normal',
        fill: '#6b7280',
        __zIndex: textZIndex++
      })
    })
  })
}

/**
 * Apply intelligent column layout with content
 */
const applyIntelligentColumnLayout = (sections, visualData, themeColor) => {
  const columnCount = 2
  const canvasWidth = 960
  const columnWidth = (canvasWidth - 160 - 20) / columnCount
  const startX = 80
  const startY = 100
  
  const baseZIndex = Date.now()
  let textZIndex = baseZIndex + 10000
  
  // Distribute sections across columns
  const sectionsPerColumn = Math.ceil(sections.length / columnCount)
  
  for (let col = 0; col < columnCount; col++) {
    const columnSections = sections.slice(
      col * sectionsPerColumn,
      (col + 1) * sectionsPerColumn
    )
    
    const x = startX + col * (columnWidth + 20)
    let yOffset = startY
    
    columnSections.forEach((section, sectionIdx) => {
      // Add section title
      if (section.title) {
        visualData.texts.push({
          id: `text-col-title-${Date.now()}-${col}-${sectionIdx}`,
          text: section.title,
          x: x,
          y: yOffset,
          width: columnWidth,
          fontSize: 18,
          fontWeight: 'bold',
          fill: themeColor,
          __zIndex: textZIndex++
        })
        yOffset += 32
      }
      
      // Add items
      section.items.forEach((item) => {
        visualData.texts.push({
          id: `text-col-item-${Date.now()}-${col}-${sectionIdx}`,
          text: item,
          x: x,
          y: yOffset,
          width: columnWidth - 10,
          fontSize: 14,
          fontWeight: 'normal',
          fill: '#4b5563',
          __zIndex: textZIndex++
        })
        yOffset += 24
      })
      
      yOffset += 16 // Section spacing
    })
  }
}



/**
 * Apply boxes layout with existing content
 */
const applyBoxesLayoutWithContent = (structure, textContents, newData, themeColor, layoutId) => {
  const boxes = structure.boxes
  const baseZIndex = Date.now()
  let shapeZIndex = baseZIndex
  let textZIndex = baseZIndex + 10000
  
  console.log('[applyBoxesLayoutWithContent] Boxes:', boxes.length, 'Text contents:', textContents.length)
  
  // Create box shapes
  boxes.forEach((box, boxIndex) => {
    // Main box rectangle
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
    
    // Add decorative borders if defined
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
  
  // Distribute text content across boxes
  boxes.forEach((box, boxIndex) => {
    const contentStartY = box.circle ? box.y + 60 : box.y + 20
    
    // Get text content for this box (one per box, or empty)
    const textContent = textContents[boxIndex] || `Box ${boxIndex + 1}`
    
    // Split long text into title and subtitle
    const maxTitleLength = 30
    let title, subtitle
    
    if (textContent.length > maxTitleLength) {
      // Split at sentence or word boundary
      const splitIndex = textContent.lastIndexOf(' ', maxTitleLength)
      title = textContent.substring(0, splitIndex > 0 ? splitIndex : maxTitleLength)
      subtitle = textContent.substring(splitIndex > 0 ? splitIndex + 1 : maxTitleLength)
    } else {
      title = textContent
      subtitle = ''
    }
    
    console.log(`[applyBoxesLayoutWithContent] Box ${boxIndex}: title="${title}", subtitle="${subtitle}"`)
    
    // Add title
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
    
    // Add subtitle if exists
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

/**
 * Apply bullets layout with existing content
 */
const applyBulletsLayoutWithContent = (structure, textContents, newData, themeColor, layoutId) => {
  const items = structure.items
  const baseZIndex = Date.now()
  let shapeZIndex = baseZIndex
  let textZIndex = baseZIndex + 10000
  
  console.log('[applyBulletsLayoutWithContent] Items:', items.length, 'Text contents:', textContents.length)
  
  // Limit to available bullet slots
  const itemCount = Math.min(items.length, textContents.length || items.length)
  
  items.slice(0, itemCount).forEach((item, idx) => {
    // Add bullet icon/number
    if (item.iconStyle === 'circle') {
      // Numbered circle bullet
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
      // Regular bullet/emoji icon
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
    
    // Add text content from existing slide (or placeholder)
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

/**
 * Apply columns layout with existing content
 */
const applyColumnsLayoutWithContent = (structure, textContents, newData, themeColor) => {
  const columns = structure.columns
  const baseZIndex = Date.now()
  let textZIndex = baseZIndex + 10000
  
  console.log('[applyColumnsLayoutWithContent] Columns:', columns.length, 'Text contents:', textContents.length)
  
  // Distribute text content across columns
  const textsPerColumn = Math.ceil(textContents.length / columns.length)
  
  columns.forEach((col, colIndex) => {
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
    
    // Add placeholder if no content in this column
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
  });
}

// ============================================================
// Header Placeholder Functions
// ============================================================

/**
 * Apply template/theme to all slides
 */
const applyTemplate = (themeName) => {
  console.log('[applyTemplate] Applying template:', themeName)
  selectTheme(themeName)
  showTemplateModal.value = false
  Message.success(t('slide.templateApplied') || 'Template applied successfully!')
}

/**
 * Export PPTX (Placeholder)
 * TODO: Implement PPTX export functionality
 */
const handleExportPPTX = () => {
  Message.info('PPTX 导出功能开发中...')
  console.log('[handleExportPPTX] Export functionality placeholder')
}

/**
 * Export current PPT data as JSON
 */
const handleExportJSON = () => {
  try {
    console.log('[handleExportJSON] Exporting PPT data to JSON')
    
    // Build PPT data structure
    const pptData = {
      title: documentTitle.value,
      slides: parsedSlides.value.map((slide, index) => ({
        type: slide.type || 'markdown',
        content: slide.content || '',
        raw: slide.raw || '',
        option: slide.option || null
      })),
      markdownContent: markdownContent.value,
      theme: currentTheme.value,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        slideCount: parsedSlides.value.length
      }
    }
    
    // Convert to JSON string with formatting
    const jsonStr = JSON.stringify(pptData, null, 2)
    
    // Create download link
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${documentTitle.value || 'presentation'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    Message.success('JSON 导出成功！')
    console.log('[handleExportJSON] Export completed:', pptData)
  } catch (error) {
    console.error('[handleExportJSON] Export failed:', error)
    Message.error('导出失败：' + error.message)
  }
}

/**
 * Trigger JSON file import
 */
const handleImportJSONClick = () => {
  console.log('[handleImportJSONClick] Triggering file input')
  jsonFileInputRef.value?.click()
}

/**
 * Handle JSON file selection and import
 */
const handleJSONFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  try {
    console.log('[handleJSONFileSelect] Importing JSON file:', file.name)
    Message.loading({ content: '正在导入 JSON...', duration: 0, id: 'json-import' })
    
    // Read file content
    const fileContent = await file.text()
    const pptData = JSON.parse(fileContent)
    
    // Validate data structure
    if (!pptData.markdownContent && !pptData.slides) {
      throw new Error('Invalid JSON format: missing markdownContent or slides')
    }
    
    // Apply imported data
    if (pptData.title) {
      documentTitle.value = pptData.title
    }
    
    if (pptData.markdownContent) {
      markdownContent.value = pptData.markdownContent
      console.log('[handleJSONFileSelect] Loaded markdown content:', markdownContent.value.substring(0, 100))
    }
    
    if (pptData.theme) {
      selectTheme(pptData.theme)
    }
    
    // Clear visual cache to force re-render
    clearVisualCache()
    
    // Reset to first slide
    currentSlideIndex.value = 0
    
    Message.clear()
    Message.success({
      content: `成功导入 ${parsedSlides.value.length} 页幻灯片！`,
      duration: 3000
    })
    
    console.log('[handleJSONFileSelect] Import completed:', {
      title: documentTitle.value,
      slideCount: parsedSlides.value.length,
      theme: currentTheme.value
    })
  } catch (error) {
    Message.clear()
    console.error('[handleJSONFileSelect] Import failed:', error)
    Message.error('导入失败：' + error.message)
  } finally {
    // Reset file input
    event.target.value = ''
  }
}

/**
 * Handle Notifications (Placeholder)
 * TODO: Implement notification center
 */
const handleNotifications = () => {
  Message.info('通知功能开发中...')
  console.log('[handleNotifications] Notification functionality placeholder')
}

// ============================================================
// BACKGROUND SETTINGS HANDLERS
// ============================================================

/**
 * Apply background color to current slide
 */
const applyBackgroundColor = (color) => {
  console.log('[applyBackgroundColor] Applying color:', color)
  
  // Store background for current slide
  slideBackgrounds.value[currentSlideIndex.value] = {
    type: 'color',
    value: color
  }
  
  currentSlideBackground.value = color
  Message.success('背景颜色已应用')
}

/**
 * Trigger background image upload
 */
const handleUploadBackground = () => {
  bgFileInputRef.value?.click()
}

/**
 * Handle background image file selection
 */
const handleBackgroundFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    Message.error('请选择图片文件（JPG/PNG/GIF）')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    Message.error('图片大小不能超过 5MB')
    return
  }

  const loadingMsg = Message.loading({ 
    content: '正在上传背景图片...', 
    duration: 0 
  })

  try {
    // Try to upload to server first
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      // Attempt server upload
      const response = await uploadApi(formData)
      
      // Extract URL from response
      const url = response?.data?.url || response?.url
      
      if (url && typeof url === 'string') {
        // Clean URL (remove backticks, quotes)
        const cleanUrl = String(url).trim()
          .replace(/^`+|`+$/g, '')
          .replace(/^"+|"+$/g, '')
          .replace(/^'+|'+$/g, '')
        
        console.log('[handleBackgroundFileSelect] Upload success, URL:', cleanUrl)
        
        // Apply background image
        const bgValue = `url(${cleanUrl})`
        slideBackgrounds.value[currentSlideIndex.value] = {
          type: 'image',
          value: bgValue,
          url: cleanUrl
        }
        
        currentSlideBackground.value = bgValue
        loadingMsg.close()
        Message.success('背景图片已上传')
        return
      }
    } catch (uploadError) {
      console.warn('[handleBackgroundFileSelect] Server upload failed, using local preview:', uploadError)
    }
    
    // Fallback: Use FileReader to create local preview
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const dataUrl = e.target.result
      
      // Apply background image using data URL
      const bgValue = `url(${dataUrl})`
      slideBackgrounds.value[currentSlideIndex.value] = {
        type: 'image',
        value: bgValue,
        url: dataUrl,
        isLocal: true
      }
      
      currentSlideBackground.value = bgValue
      loadingMsg.close()
      Message.success('背景图片已设置（本地预览）')
    }
    
    reader.onerror = () => {
      loadingMsg.close()
      Message.error('读取图片失败')
    }
    
    reader.readAsDataURL(file)
    
  } catch (error) {
    loadingMsg.close()
    console.error('[handleBackgroundFileSelect] Error:', error)
    Message.error('设置背景失败：' + (error.message || '未知错误'))
  } finally {
    // Reset file input
    event.target.value = ''
  }
}

/**
 * Reset background to theme default
 */
const resetBackground = () => {
  console.log('[resetBackground] Resetting to theme default')
  
  delete slideBackgrounds.value[currentSlideIndex.value]
  currentSlideBackground.value = ''
  Message.success('已重置为主题默认背景')
}

// Watch for slide changes to update current background
watch(currentSlideIndex, (newIndex) => {
  const bg = slideBackgrounds.value[newIndex]
  currentSlideBackground.value = bg ? bg.value : ''
})

</script>

<style scoped src="../../styles/slide-page.scss"></style>
<style scoped src="../../styles/slide-page-global.scss"></style>
