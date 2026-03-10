<template>
  <div ref="editorRoot" class="visual-editor-proto" tabindex="0">
    <!-- Main Editor Area -->
    <div class="editor-main">
      <!-- Konva Canvas (Full height, no toolbar/footer) -->
      <div class="canvas-wrapper">
        <!-- Theme background layer (behind Konva canvas) -->
        <div class="canvas-background" :style="canvasBackgroundStyle"></div>
        
        <v-stage
          ref="stage"
          :config="stageConfig"
          @mousedown="handleStageMouseDown"
          @touchstart="handleStageMouseDown"
          @mousemove="handleStageMouseMove"
          @mouseup="handleStageMouseUp"
        >
          <v-layer ref="layer">
          <!-- Background rectangle (transparent to show HTML background) -->
          <v-rect
            :config="{
              x: 0,
              y: 0,
              width: SLIDE_WIDTH,
              height: SLIDE_HEIGHT,
              fill: 'transparent',
              listening: false
            }"
          />
          
          <!-- Render all components in z-index order -->
          <template v-for="comp in allComponents" :key="comp.id">
            <!-- Text with container for alignment (includes Link) -->
            <template v-if="comp.__type === 'text' || comp.__type === 'link'">
              <!-- Calculate container dimensions -->
              <v-rect
                :config="{
                  id: `${comp.id}-container`,
                  name: comp.id,
                  x: comp.x,
                  y: comp.y,
                  width: getTextWidth(comp),
                  height: getTextHeight(comp),
                  fill: 'transparent',
                  stroke: isSelected(comp.id) ? '#4080ff' : 'transparent',
                  strokeWidth: 1,
                  dash: [5, 5],
                  draggable: comp.draggable,
                  rotation: comp.rotation || 0,
                  listening: true
                }"
                @click="handleShapeClick(comp.id, $event)"
                @dblclick="comp.__type === 'link' ? handleLinkDoubleClick(comp.id) : handleTextDoubleClick(comp.id)"
                @dragmove="handleDragMove"
                @dragend="handleDragEnd"
                @transformend="handleTransformEnd"
              />
              <!-- Text inside container (with link styling if link) - Hide when editing -->
              <v-text
                v-if="editingTextId !== comp.id"
                :config="{
                  ...comp,
                  name: comp.id,
                  x: comp.x,
                  y: comp.y,
                  width: getTextWidth(comp),
                  height: getTextHeight(comp),
                  fill: comp.__type === 'link' ? '#1e88e5' : comp.fill,
                  textDecoration: comp.__type === 'link' ? 'underline' : comp.textDecoration,
                  fontSize: comp.fontSize || 24,
                  fontWeight: comp.fontWeight || '400',
                  fontStyle: comp.fontStyle || 'normal',
                  fontFamily: comp.fontFamily || 'Arial, sans-serif',
                  verticalAlign: 'top',
                  lineHeight: 1.5,
                  wrap: 'word',
                  listening: false,
                  draggable: false
                }"
              />
            </template>
            <v-image
              v-else-if="comp.__type === 'image' && getSafeImageForKonva(comp)"
              :config="{
                ...comp,
                image: getSafeImageForKonva(comp),
                filters: comp.filters || [],
                blurRadius: comp.blurRadius,
                brightness: comp.brightness
              }"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <!-- Fallback for invalid images -->
            <v-rect
              v-else-if="comp.__type === 'image' && !getSafeImageForKonva(comp)"
              :config="{
                ...comp,
                fill: '#f0f0f0',
                stroke: '#ccc',
                strokeWidth: 1,
                dash: [5, 5]
              }"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            >
              <v-text
                :config="{
                  text: 'Invalid Image',
                  x: comp.x + (comp.width || 100) / 2,
                  y: comp.y + (comp.height || 100) / 2,
                  fontSize: 12,
                  fill: '#999',
                  align: 'center',
                  listening: false
                }"
              />
            </v-rect>
            <v-rect
              v-else-if="comp.__type === 'rect'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <v-circle
              v-else-if="comp.__type === 'circle'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <v-line
              v-else-if="comp.__type === 'triangle'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <v-star
              v-else-if="comp.__type === 'star'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <v-line
              v-else-if="comp.__type === 'hexagon'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <v-line
              v-else-if="comp.__type === 'pentagon'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <v-line
              v-else-if="comp.__type === 'diamond'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <v-line
              v-else-if="comp.__type === 'ring'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <v-line
              v-else-if="comp.__type === 'ellipse'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <v-line
              v-else-if="comp.__type === 'arrow'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <v-line
              v-else-if="comp.__type === 'parallelogram'"
              :config="comp"
              @click="handleShapeClick(comp.id, $event)"
              @dragmove="handleDragMove"
              @dragend="handleDragEnd"
              @transformend="handleTransformEnd"
            />
            <!-- Tables are rendered as HTML overlays, not Konva shapes -->
            <!-- Charts are rendered as HTML overlays, not Konva shapes -->
          </template>
          
          <!-- Multi-selection rectangle (marquee) -->
          <v-rect
            v-if="isMultiSelecting && selectionRect"
            :config="{
              x: selectionRect.x,
              y: selectionRect.y,
              width: selectionRect.width,
              height: selectionRect.height,
              fill: 'rgba(99, 102, 241, 0.1)',
              stroke: '#6366f1',
              strokeWidth: 2,
              dash: [5, 5],
              listening: false,
              name: 'selection-rect'
            }"
          />
          
          <!-- Transformer for resizing/rotating -->
          <v-transformer 
            ref="transformer" 
            :config="transformerConfig"
          />
        </v-layer>
      </v-stage>

      <!-- Chart HTML overlays (rendered above Konva canvas) -->
      <div
        v-for="chart in charts"
        :key="chart.id"
        class="chart-container"
        :class="{ selected: isSelected(chart.id), dragging: isDragging && draggingChartId === chart.id }"
        :style="{
          left: chart.x + 'px',
          top: chart.y + 'px',
          width: (chart.width || 640) + 'px',
          height: (chart.height || 320) + 'px',
          zIndex: 100 + (chart.__zIndex || 0),
          transform: props.isThumbnail ? `scale(${props.scale})` : 'none',
          transformOrigin: 'top left'
        }"
        @click="handleChartClick(chart.id)"
        @mousedown="handleChartMouseDown(chart, $event)"
        @mouseenter="() => console.log('[Chart Container] Rendered:', chart.id, 'at', chart.x, chart.y)"
      >
        <!-- Chart container border and selection indicator -->
        <div class="chart-wrapper">
          <!-- Resize handles (only show when selected) -->
          <template v-if="selectedId === chart.id && !props.isThumbnail">
            <!-- Corner handles -->
            <div 
              class="resize-handle top-left" 
              @mousedown="handleChartResizeStart(chart, 'top-left', $event)"
            ></div>
            <div 
              class="resize-handle top-right" 
              @mousedown="handleChartResizeStart(chart, 'top-right', $event)"
            ></div>
            <div 
              class="resize-handle bottom-left" 
              @mousedown="handleChartResizeStart(chart, 'bottom-left', $event)"
            ></div>
            <div 
              class="resize-handle bottom-right" 
              @mousedown="handleChartResizeStart(chart, 'bottom-right', $event)"
            ></div>
            
            <!-- Edge handles -->
            <div 
              class="resize-handle top-center" 
              @mousedown="handleChartResizeStart(chart, 'top-center', $event)"
            ></div>
            <div 
              class="resize-handle bottom-center" 
              @mousedown="handleChartResizeStart(chart, 'bottom-center', $event)"
            ></div>
            <div 
              class="resize-handle middle-left" 
              @mousedown="handleChartResizeStart(chart, 'middle-left', $event)"
            ></div>
            <div 
              class="resize-handle middle-right" 
              @mousedown="handleChartResizeStart(chart, 'middle-right', $event)"
            ></div>
          </template>
          
          <!-- Chart overlay content -->
          <div 
            class="chart-overlay"
            :class="{ selected: selectedId === chart.id }"
          >
            <!-- Chart type badge (top-right corner) -->
            <div class="chart-type-badge">
              {{ chart.type?.toUpperCase() || 'CHART' }}
            </div>
            
            <!-- EChart content -->
            <div class="chart-content">
              <EChartsChart 
                :option="chart.option" 
                :id="chart.id" 
                :is-thumbnail="props.isThumbnail"
                :style="{ width: '100%', height: '100%' }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- GIF/Animated Image HTML overlays (for proper animation) -->
      <div
        v-for="img in gifImages"
        :key="img.id"
        class="gif-overlay"
        :class="{ selected: selectedId === img.id, dragging: isDragging && draggingImageId === img.id }"
        :style="{
          left: img.x + 'px',
          top: img.y + 'px',
          width: img.width + 'px',
          height: img.height + 'px',
          zIndex: 100 + (img.__zIndex || 0)
        }"
        @click="handleImageClick(img.id)"
        @mousedown="handleImageMouseDown(img, $event)"
      >
        <img
          :src="img.metadata?.originalUrl || img.src"
          :alt="img.metadata?.title || 'GIF'"
          class="gif-content"
          draggable="false"
        />
      </div>

      <!-- Video HTML overlays (iframe embeds) -->
      <div
        v-for="video in videos"
        :key="video.id"
        class="video-container"
        :class="{ selected: selectedId === video.id, dragging: isDragging && draggingVideoId === video.id }"
        :style="{
          left: video.x + 'px',
          top: video.y + 'px',
          width: video.width + 'px',
          height: video.height + 'px',
          zIndex: 100 + (video.__zIndex || 0),
          transform: props.isThumbnail ? `scale(${props.scale})` : 'none',
          transformOrigin: 'top left'
        }"
        @click="videoClick(video.id, handleShapeClick)"
      >
        <!-- Video wrapper for border and selection -->
        <div 
          class="video-wrapper"
        >
          <!-- Resize handles (only show when selected) -->
          <template v-if="selectedId === video.id && !props.isThumbnail">
            <!-- Corner handles -->
            <div 
              class="resize-handle top-left" 
              @mousedown="videoResizeStart(video, 'top-left', $event)"
            ></div>
            <div 
              class="resize-handle top-right" 
              @mousedown="videoResizeStart(video, 'top-right', $event)"
            ></div>
            <div 
              class="resize-handle bottom-left" 
              @mousedown="videoResizeStart(video, 'bottom-left', $event)"
            ></div>
            <div 
              class="resize-handle bottom-right" 
              @mousedown="videoResizeStart(video, 'bottom-right', $event)"
            ></div>
            
            <!-- Edge handles -->
            <div 
              class="resize-handle top-center" 
              @mousedown="videoResizeStart(video, 'top-center', $event)"
            ></div>
            <div 
              class="resize-handle bottom-center" 
              @mousedown="videoResizeStart(video, 'bottom-center', $event)"
            ></div>
            <div 
              class="resize-handle middle-left" 
              @mousedown="videoResizeStart(video, 'middle-left', $event)"
            ></div>
            <div 
              class="resize-handle middle-right" 
              @mousedown="videoResizeStart(video, 'middle-right', $event)"
            ></div>
          </template>
          
          <!-- Video overlay content -->
          <div 
            class="video-overlay"
            :class="{ selected: selectedId === video.id }"
            @mousedown="videoMouseDown(video, $event)"
          >
          <!-- Local video/audio file -->
          <video
            v-if="video.isLocal && !video.isAudio"
            :src="video.embedUrl"
            class="video-iframe"
            controls
            style="width: 100%; height: 100%; object-fit: contain;"
          ></video>
          
          <!-- Local audio file -->
          <audio
            v-else-if="video.isLocal && video.isAudio"
            :src="video.embedUrl"
            class="video-iframe"
            controls
            style="width: 100%; height: 100%;"
          ></audio>
          
          <!-- External video iframe (YouTube, Bilibili, etc.) -->
          <iframe
            v-else
            :src="video.embedUrl"
            class="video-iframe"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          
          <!-- Provider badge (top-right corner) -->
          <div v-if="video.provider" class="video-provider-badge">
            {{ video.provider.toUpperCase() }}
          </div>
          
          <!-- File name badge for local files -->
          <div v-if="video.isLocal && video.fileName" class="video-filename-badge">
            {{ video.fileName }}
          </div>
          </div> <!-- End video-overlay -->
        </div> <!-- End video-wrapper -->
      </div> <!-- End video-container -->
    </div>  
  </div>

    <!-- Table HTML overlays (rendered above Konva canvas) -->
    <div
      v-for="table in tables"
      :key="table.id"
      class="table-container"
      :class="{ 
        selected: isSelected(table.id), 
        'multi-selected': selectedIds.size > 1 && isSelected(table.id),
        dragging: isDraggingTable && draggingTableId === table.id, 
        'editing-cell': isEditingTableCell 
      }"
      :style="{
        left: table.x + 'px',
        top: table.y + 'px',
        width: table.width + 'px',
        height: table.height + 'px',
        zIndex: 100 + (table.__zIndex || 0),
        transform: props.isThumbnail ? `scale(${props.scale})` : 'none',
        transformOrigin: 'top left'
      }"
      @mousedown="handleTableMouseDown(table, $event)"
    >
      <div class="table-wrapper">
        
        <!-- Resize handles (only show when selected) -->
        <template v-if="selectedId === table.id && !props.isThumbnail">
          <!-- Corner handles -->
          <div class="resize-handle top-left" @mousedown="handleTableResizeStart(table, 'top-left', $event)"></div>
          <div class="resize-handle top-right" @mousedown="handleTableResizeStart(table, 'top-right', $event)"></div>
          <div class="resize-handle bottom-left" @mousedown="handleTableResizeStart(table, 'bottom-left', $event)"></div>
          <div class="resize-handle bottom-right" @mousedown="handleTableResizeStart(table, 'bottom-right', $event)"></div>
          
          <!-- Edge handles -->
          <div class="resize-handle top-center" @mousedown="handleTableResizeStart(table, 'top-center', $event)"></div>
          <div class="resize-handle bottom-center" @mousedown="handleTableResizeStart(table, 'bottom-center', $event)"></div>
          <div class="resize-handle middle-left" @mousedown="handleTableResizeStart(table, 'middle-left', $event)"></div>
          <div class="resize-handle middle-right" @mousedown="handleTableResizeStart(table, 'middle-right', $event)"></div>
        </template>
        
        <!-- Editable table -->
        <table class="editable-table" :class="{ 'has-header': table.hasHeader }">
          <thead v-if="table.hasHeader && table.cells && table.cells.length > 0">
            <tr>
              <th
                v-for="(cell, colIndex) in table.cells[0]"
                :key="`header-${colIndex}`"
                :contenteditable="false"
                :class="{
                  'selected-cell': lastFocusedCell.tableId === table.id && lastFocusedCell.rowIndex === 0 && lastFocusedCell.colIndex === colIndex
                }"
                :style="{
                  width: table.cellWidth + 'px',
                  minWidth: table.cellWidth + 'px',
                  height: table.cellHeight + 'px',
                  backgroundColor: table.headerBg || '#f3f4f6',
                  borderColor: table.borderColor || '#e5e7eb'
                }"
                @click.stop="handleTableCellClick(table.id, 0, colIndex, $event)"
                @dblclick="handleTableCellDblClick(table.id, 0, colIndex, $event)"
              >
                {{ cell }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in (table.hasHeader ? table.cells.slice(1) : table.cells)"
              :key="`row-${rowIndex}`"
              :class="{ 'alternate-row': table.alternateRows && rowIndex % 2 === 1 }"
            >
              <td
                v-for="(cell, colIndex) in row"
                :key="`cell-${rowIndex}-${colIndex}`"
                :contenteditable="false"
                :class="{
                  'selected-cell': lastFocusedCell.tableId === table.id && lastFocusedCell.rowIndex === (table.hasHeader ? rowIndex + 1 : rowIndex) && lastFocusedCell.colIndex === colIndex
                }"
                :style="{
                  width: table.cellWidth + 'px',
                  minWidth: table.cellWidth + 'px',
                  height: table.cellHeight + 'px',
                  borderColor: table.borderColor || '#e5e7eb'
                }"
                @click.stop="handleTableCellClick(table.id, table.hasHeader ? rowIndex + 1 : rowIndex, colIndex, $event)"
                @dblclick="handleTableCellDblClick(table.id, table.hasHeader ? rowIndex + 1 : rowIndex, colIndex, $event)"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Multi-selection indicator badge -->
    <div 
      v-if="selectedIds.size > 1"
      class="multi-selection-badge"
    >
      <icon-check :size="14" />
      <span>{{ selectedIds.size }} items selected</span>
    </div>
    
    <!-- Inline Text Editor (appears on double-click) -->
    <div
      v-if="isEditingText"
      class="inline-text-editor"
      :style="inlineEditorStyle"
    >
      <textarea
        ref="inlineTextInput"
        v-model="editingTextContent"
        class="inline-text-input"
        :style="inlineTextInputStyle"
        @blur="saveTextEdit"
        @keydown.esc="cancelTextEdit"
        @keydown.enter.ctrl="saveTextEdit"
        @click.stop
      />
    </div>

    <!-- Link Edit Dialog -->
    <a-modal
      v-model:visible="isEditingLink"
      title="Edit Link"
      @ok="saveLinkEdit"
      @cancel="cancelLinkEdit"
      width="500px"
    >
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Link Text:</label>
          <a-input
            v-model="editingLinkText"
            placeholder="Enter link text"
            size="large"
            @keydown.enter="saveLinkEdit"
          />
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">URL:</label>
          <a-input
            v-model="editingLinkUrl"
            placeholder="https://example.com"
            size="large"
            @keydown.enter="saveLinkEdit"
          />
        </div>
      </div>
    </a-modal>

    <!-- Video URL Input Dialog -->
    <a-modal
      v-model:visible="showVideoUrlInput"
      :title="t('slide.visual.video.addVideoTitle')"
      :ok-text="t('common.confirm')"
      :cancel-text="t('common.cancel')"
      @ok="addVideoFromUrl"
      @cancel="() => { showVideoUrlInput = false; videoUrl = '' }"
      width="500px"
    >
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">{{ t('slide.visual.video.videoUrlLabel') }}:</label>
          <a-input
            v-model="videoUrl"
            :placeholder="t('slide.visual.video.videoUrlPlaceholder')"
            size="large"
            @keydown.enter="addVideoFromUrl"
          />
          <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
            {{ t('slide.visual.video.supportedPlatforms') }}
          </div>
        </div>
      </div>
    </a-modal>

    <!-- Chart Editor Dialog -->
    <ChartEditorDialog
      v-model="showChartEditor"
      :chart-type="pendingChartType"
      :edit-mode="!!editingChartId"
      :existing-chart="editingChartId ? charts.find(c => c.id === editingChartId) : null"
      @confirm="handleChartConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { Stage as VStage, Layer as VLayer, Text as VText, Rect as VRect, Circle as VCircle, Image as VImage, Transformer as VTransformer, Line as VLine, Star as VStar, Group as VGroup } from 'vue-konva'
import { Message } from '@arco-design/web-vue'
import { IconDelete, IconPlus, IconMinus, IconCheck } from '@arco-design/web-vue/es/icon'
import EChartsChart from './EChartsChart.vue'
import ChartEditorDialog from './ChartEditorDialog.vue'
import { uploadApi } from '@/api/file'
import { useVideoManagement } from './composables/useVideoManagement'
import { useDragManagement } from './composables/useDragManagement'

const { t } = useI18n()

// Props for receiving slide data from parent
const props = defineProps({
  slideData: {
    type: Object,
    default: () => ({
      texts: [],
      images: [],
      rectangles: [],
      circles: [],
      links: [],
      triangles: [],
      stars: [],
      charts: [],
      tables: []
    })
  },
  themeStyle: {
    type: Object,
    default: () => ({})
  },
  readonly: {
    type: Boolean,
    default: false
  },
  isThumbnail: {
    type: Boolean,
    default: false
  },
  scale: {
    type: Number,
    default: 1
  }
})

// Emit for sending updates back to parent
const emit = defineEmits(['update:slideData'])

// Helper function to emit updates
const emitUpdate = () => {
  // Serialize images: convert Image objects to serializable format
  const serializedImages = images.value.map(img => {
    if (img.isGif) {
      // GIF: already serializable (no Image object)
      console.log('[VisualEditor] Serializing GIF:', { id: img.id, x: img.x, y: img.y, width: img.width, height: img.height })
      return img
    } else if (img.image && img.image.src) {
      // Non-GIF: extract src from Image object
      return {
        ...img,
        image: {
          src: img.image.src
        }
      }
    } else {
      // Fallback
      return img
    }
  })
  
  console.log('[VisualEditor] emitUpdate - serializedImages:', serializedImages.map(img => ({
    id: img.id,
    isGif: img.isGif,
    x: img.x,
    y: img.y
  })))
  
  console.log('[VisualEditor] emitUpdate - tables:', tables.value.map(t => ({
    id: t.id,
    x: t.x,
    y: t.y
  })))
  
  emit('update:slideData', {
    texts: texts.value,
    images: serializedImages,
    rectangles: rectangles.value,
    circles: circles.value,
    links: links.value,
    triangles: triangles.value,
    stars: stars.value,
    hexagons: hexagons.value,
    pentagons: pentagons.value,
    diamonds: diamonds.value,
    rings: rings.value,
    ellipses: ellipses.value,
    arrows: arrows.value,
    parallelograms: parallelograms.value,
    charts: charts.value,
    videos: videos.value,
    tables: tables.value
  })
  
  // Debug: Log saved data
  console.log('[VisualEditor] Saving slide data:', {
    textCount: texts.value.length,
    texts: texts.value.map(t => ({
      id: t.id,
      textPreview: t.text?.substring(0, 30) + (t.text?.length > 30 ? '...' : ''),
      x: t.x,
      y: t.y,
      width: t.width,
      height: t.height,
      lineCount: (t.text || '').split('\n').length
    })),
    tableCount: tables.value.length,
    tables: tables.value.map(t => ({
      id: t.id,
      rows: t.rows,
      cols: t.cols,
      cells: t.cells
    }))
  })
}

// Konva stage configuration - Standard 16:9 HD ratio
const SLIDE_WIDTH = 960   // Standard HD width (half of 1920)
const SLIDE_HEIGHT = 540  // Standard HD height (half of 1080), 16:9 ratio

// Stage ref
const stage = ref(null)
const editorRoot = ref(null)

const stageConfig = computed(() => ({
  width: props.isThumbnail ? SLIDE_WIDTH * props.scale : SLIDE_WIDTH,
  height: props.isThumbnail ? SLIDE_HEIGHT * props.scale : SLIDE_HEIGHT,
  draggable: false,
  scaleX: props.isThumbnail ? props.scale : 1,
  scaleY: props.isThumbnail ? props.scale : 1,
  listening: !props.isThumbnail  // Disable interactions in thumbnail mode
}))

// No scaling needed - canvas is already at display size
// Keep this function for potential future use
const updateStageScale = () => {
  console.log('[VisualEditor] Canvas at native display size:', { 
    width: SLIDE_WIDTH, 
    height: SLIDE_HEIGHT,
    textCount: texts.value.length,
    chartCount: charts.value.length,
    firstTextPos: texts.value.length > 0 ? { x: texts.value[0].x, y: texts.value[0].y } : null,
    firstChartPos: charts.value.length > 0 ? { x: charts.value[0].x, y: charts.value[0].y, type: charts.value[0].type } : null
  })
}

onMounted(() => {
  console.log('[VisualEditor] ========== MOUNTED ==========')
  console.log('[VisualEditor] isThumbnail prop:', props.isThumbnail)
  console.log('[VisualEditor] editorRoot.value:', editorRoot.value)
  
  nextTick(() => {
    updateStageScale()
    window.addEventListener('resize', updateStageScale)
    
    // Auto-focus editor to receive paste events
    if (editorRoot.value && !props.isThumbnail) {
      editorRoot.value.focus()
      console.log('[VisualEditor] Editor focused for paste events')
    }
    
    // Listen for paste events globally (only for main editor, not thumbnails)
    if (!props.isThumbnail) {
      document.addEventListener('paste', handleSystemPaste)
      console.log('[VisualEditor] Paste event listener added')
    } else {
      console.log('[VisualEditor] Skipping paste listener - thumbnail mode')
    }
  })
  
  // Initialize z-indices for existing components
  initializeZIndices()
  // Save initial state
  saveToHistory()
  
  // Add keyboard event listener for shortcuts
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateStageScale)
  
  // Remove paste event listener (only if it was added)
  if (!props.isThumbnail) {
    document.removeEventListener('paste', handleSystemPaste)
    console.log('[VisualEditor] Paste event listener removed')
  }
  
  // Remove keyboard event listener
  document.removeEventListener('keydown', handleKeyDown)
  
  // Clean up chart drag listeners
  document.removeEventListener('mousemove', handleChartMouseMove)
  document.removeEventListener('mouseup', handleChartMouseUp)
  
  // Clean up chart resize listeners
  document.removeEventListener('mousemove', handleChartResizeMove)
  document.removeEventListener('mouseup', handleChartResizeEnd)
  
  // Clean up image drag listeners
  document.removeEventListener('mousemove', handleImageMouseMove)
  document.removeEventListener('mouseup', handleImageMouseUp)
  
  // Clean up video listeners (using composable)
  cleanupVideoListeners()
})

// Shape arrays
const texts = ref([])
const images = ref([])
const rectangles = ref([])
const circles = ref([])
const links = ref([])
const triangles = ref([])
const stars = ref([])
const hexagons = ref([])
const pentagons = ref([])
const diamonds = ref([])
const rings = ref([])
const ellipses = ref([])
const arrows = ref([])
const parallelograms = ref([])
const videos = ref([])
const tables = ref([])

// Computed: separate GIF images for HTML overlay
const gifImages = computed(() => {
  return images.value.filter(img => img.isGif === true)
})

// Computed: non-GIF images for Konva canvas
const canvasImages = computed(() => {
  return images.value.filter(img => img.isGif !== true)
})
const charts = ref([])

// Flag to prevent circular updates
let isUpdatingFromProp = false
let isEmitting = false

// Table editing state (prevent reload during cell edit)
// Must be declared before the watch that uses it
const isEditingTableCell = ref(false)
const editingCellInfo = ref({ tableId: null, rowIndex: null, colIndex: null, content: '' })
// Track last focused cell for context-aware operations
const lastFocusedCell = ref({ tableId: null, rowIndex: null, colIndex: null })
// Store copied cell content (for cross-cell paste)
const copiedCellContent = ref('')

// Initialize unified drag management
const {
  isDraggingTable,
  isDraggingChart,
  isDraggingImage,
  isDraggingKonvaElement,
  isDraggingAny,
  draggingTableId,
  draggingChartId,
  draggingImageId,
  startTableDrag,
  updateTableDrag,
  endTableDrag,
  startChartDrag,
  updateChartDrag,
  endChartDrag,
  startImageDrag,
  updateImageDrag,
  endImageDrag,
  startKonvaDrag,
  endKonvaDrag,
  getDragState
} = useDragManagement()

// Helper function to validate and fix image data
// Must be defined before the watch() that uses it
const validateAndFixImageData = (imageData) => {
  if (!imageData) return null
  
  console.log('[VisualEditor] Validating image data:', {
    id: imageData.id,
    originalImageType: typeof imageData.image,
    hasImageObject: !!imageData.image,
    hasSrc: !!imageData.src,
    imageSrc: imageData.image ? (typeof imageData.image === 'object' ? imageData.image.src : imageData.image) : (imageData.src || 'none'),
    isGif: imageData.isGif
  })
  
  // Ensure basic properties exist
  const fixedImage = { ...imageData }
  
  if (!fixedImage.x) fixedImage.x = 100
  if (!fixedImage.y) fixedImage.y = 100
  if (!fixedImage.width) fixedImage.width = 200
  if (!fixedImage.height) fixedImage.height = 150
  
  // For non-GIF images, ensure we have a valid image source
  // Check both image property and src property
  if (!fixedImage.isGif) {
    let src = null
    
    // Try to get src from image property first
    if (fixedImage.image) {
      src = typeof fixedImage.image === 'object' ? fixedImage.image.src : fixedImage.image
    }
    // Fallback to src property
    else if (fixedImage.src) {
      src = fixedImage.src
    }
    
    if (src) {
      console.log('[VisualEditor] Image source found:', src ? src.substring(0, 100) + '...' : 'NONE')
      
      // Normalize: ensure image property exists for rendering
      if (!fixedImage.image) {
        fixedImage.image = src
      }
      
      // Reconstruct Image object for Konva rendering
      const img = new window.Image()
      img.src = src
      fixedImage.imageObject = img
      console.log('[VisualEditor] Reconstructed image object for:', fixedImage.id)
    } else {
      console.warn('[VisualEditor] No valid image source found for:', fixedImage.id)
    }
  }
  
  return fixedImage
}

// Watch slideData prop and sync to internal state
watch(() => props.slideData, (newData) => {
  // Prevent updating from props during drag operations or editing to avoid conflicts
  const dragState = getDragState()
  const shouldSkip = !newData || isEmitting || isEditingTableCell.value || isDraggingAny.value
  
  console.log('[VisualEditor] Props update attempt:', {
    hasData: !!newData,
    isEmitting,
    isEditingCell: isEditingTableCell.value,
    isDraggingAny: isDraggingAny.value,
    shouldSkip,
    dragState
  })
  
  if (shouldSkip) {
    if (isDraggingAny.value) {
      console.log('[VisualEditor] ⛔ Skipping props update - dragging in progress', dragState)
    } else if (isEmitting) {
      console.log('[VisualEditor] ⛔ Skipping props update - currently emitting')
    }
    return
  }
  
  console.log('[VisualEditor] ✅ Processing props update, tables count:', newData.tables?.length || 0)
  
  if (newData) {
    isUpdatingFromProp = true
    
    // Load texts and fix missing heights for multiline text
    const loadedTexts = JSON.parse(JSON.stringify(newData.texts || []))
    texts.value = loadedTexts.map(text => {
      // Debug: Log loaded text
      console.log('[VisualEditor] Loading text:', {
        id: text.id,
        textPreview: text.text?.substring(0, 50) + (text.text?.length > 50 ? '...' : ''),
        hasHeight: !!text.height,
        originalHeight: text.height,
        x: text.x,
        y: text.y
      })
      
      // If height is missing, calculate it based on line count
      if (!text.height) {
        const lineCount = (text.text || '').split('\n').length
        if (lineCount > 1) {
          text.height = lineCount * (text.fontSize || 24) * 1.5
          console.log(`[VisualEditor] Fixed height for ${text.id}: ${text.height}`)
        }
      }
      return text
    })
    
    // Post-process: Fix arrow list alignment
    console.log('[VisualEditor] Post-process arrow alignment, texts count:', texts.value.length)
    
    // Log all texts to see what we have
    if (texts.value.length > 0) {
      console.log('[VisualEditor] First 5 texts:', texts.value.slice(0, 5).map(t => ({
        text: t.text?.substring(0, 20),
        x: t.x,
        y: t.y,
        fontSize: t.fontSize
      })))
    }
    
    for (let j = 0; j < texts.value.length - 1; j++) {
      const currentText = texts.value[j]
      const nextText = texts.value[j + 1]
      
      // Check if current text is ONLY an arrow icon (→) or starts with arrow
      const isArrowOnly = currentText.text === '→'
      const startsWithArrow = currentText.text?.startsWith('→ ')
      
      if ((isArrowOnly || startsWithArrow) && currentText.fontSize >= 16 && currentText.fontSize <= 24) {
        const yDiff = Math.abs(nextText.y - currentText.y)
        const xDiff = nextText.x - currentText.x
        
        console.log('[VisualEditor] Arrow found at', j, ':', { text: currentText.text, fontSize: currentText.fontSize, yDiff, xDiff })
        
        // For arrow-only icons, check if next text is on the same line
        if (isArrowOnly && yDiff <= 10 && xDiff > 0 && xDiff < 100) {
          const adjustment = 7
          nextText.y = currentText.y + adjustment
          console.log('[VisualEditor] ✓ Adjusted text y:', currentText.y, '→', nextText.y)
        }
      }
    }
    
    // Handle images: GIFs don't need image objects, non-GIFs do
    const rawImages = JSON.parse(JSON.stringify(newData.images || []))
    console.log('[VisualEditor] Loading images:', rawImages.map(img => ({
      id: img.id,
      isGif: img.isGif,
      x: img.x,
      y: img.y,
      width: img.width,
      height: img.height,
      hasSrc: !!img.src,
      hasImageSrc: !!(img.image && img.image.src)
    })))
    
    images.value = rawImages
      .map(img => {
        // Validate and fix image data first
        const fixedImg = validateAndFixImageData(img)
        if (!fixedImg) {
          console.warn('[VisualEditor] Skipping invalid image after validation:', img.id)
          return null
        }
        
        if (fixedImg.isGif) {
          // GIF: keep as-is (will be rendered as HTML overlay)
          console.log('[VisualEditor] Loading GIF:', { 
            id: fixedImg.id, 
            x: fixedImg.x, 
            y: fixedImg.y, 
            src: fixedImg.src,
            width: fixedImg.width,
            height: fixedImg.height
          })
          return fixedImg
        } else {
          // Non-GIF: recreate Image object from saved src
          const imageObj = new window.Image()
          
          // Get src from image property or src property
          let imageSrc = null
          if (fixedImg.image) {
            imageSrc = typeof fixedImg.image === 'object' ? fixedImg.image.src : fixedImg.image
          } else if (fixedImg.src) {
            imageSrc = fixedImg.src
          }
          
          if (!imageSrc) {
            console.warn('[VisualEditor] Skipping non-GIF image without src:', fixedImg.id)
            return null
          }
          
          imageObj.src = imageSrc
          console.log('[VisualEditor] Loading non-GIF:', { 
            id: fixedImg.id, 
            x: fixedImg.x, 
            y: fixedImg.y, 
            src: imageSrc,
            width: fixedImg.width,
            height: fixedImg.height
          })
          return { ...fixedImg, image: imageObj }
        }
      })
      .filter(img => img !== null) // Remove invalid images
    
    rectangles.value = JSON.parse(JSON.stringify(newData.rectangles || []))
    console.log('[VisualEditor] Loading rectangles:', rectangles.value.length)
    circles.value = JSON.parse(JSON.stringify(newData.circles || []))
    console.log('[VisualEditor] Loading circles:', circles.value.length)
    links.value = JSON.parse(JSON.stringify(newData.links || []))
    triangles.value = JSON.parse(JSON.stringify(newData.triangles || []))
    stars.value = JSON.parse(JSON.stringify(newData.stars || []))
    hexagons.value = JSON.parse(JSON.stringify(newData.hexagons || []))
    pentagons.value = JSON.parse(JSON.stringify(newData.pentagons || []))
    diamonds.value = JSON.parse(JSON.stringify(newData.diamonds || []))
    rings.value = JSON.parse(JSON.stringify(newData.rings || []))
    ellipses.value = JSON.parse(JSON.stringify(newData.ellipses || []))
    arrows.value = JSON.parse(JSON.stringify(newData.arrows || []))
    parallelograms.value = JSON.parse(JSON.stringify(newData.parallelograms || []))
    // Handle charts with validation
    const rawCharts = JSON.parse(JSON.stringify(newData.charts || []))
    console.log('[VisualEditor] Loading charts:', rawCharts.map(chart => ({
      id: chart.id,
      type: chart.type,
      x: chart.x,
      y: chart.y,
      width: chart.width,
      height: chart.height,
      hasOption: !!chart.option
    })))
    
    charts.value = rawCharts.filter(chart => {
      // Validate chart data
      if (!chart.id) {
        console.warn('[VisualEditor] Skipping chart without id')
        return false
      }
      if (!chart.type) {
        console.warn('[VisualEditor] Skipping chart without type:', chart.id)
        return false
      }
      if (!chart.option) {
        console.warn('[VisualEditor] Skipping chart without option:', chart.id)
        return false
      }
      return true
    })
    
    console.log('[VisualEditor] Valid charts loaded:', charts.value.map(c => ({
      id: c.id,
      type: c.type,
      x: c.x,
      y: c.y
    })))
    
    // Load videos
    videos.value = JSON.parse(JSON.stringify(newData.videos || []))
    console.log('[VisualEditor] Loading videos:', videos.value.length)
    
    // Load tables
    const oldTablesCount = tables.value.length
    const oldTablesIds = tables.value.map(t => t.id)
    tables.value = JSON.parse(JSON.stringify(newData.tables || []))
    const newTablesIds = tables.value.map(t => t.id)
    console.log('[VisualEditor] Loading tables:', tables.value.length, {
      oldCount: oldTablesCount,
      newCount: tables.value.length,
      oldIds: oldTablesIds,
      newIds: newTablesIds,
      positions: tables.value.map(t => ({ id: t.id, x: t.x, y: t.y }))
    })
    
    // Initialize z-indices for loaded components
    nextTick(() => {
      initializeZIndices()
      updateStageScale() // Update scale when data changes
      isUpdatingFromProp = false
    })
  }
}, { immediate: true, deep: true })

// Watch internal state changes and emit to parent
watch([texts, images, rectangles, circles, links, triangles, stars, hexagons, pentagons, diamonds, rings, ellipses, arrows, parallelograms, charts, videos, tables], () => {
  // Skip auto-emit during drag operations to prevent data loss
  if (isDraggingAny.value) {
    console.log('[VisualEditor] ⛔ Skipping auto-emit during drag')
    return
  }
  
  if (!isUpdatingFromProp) {
    isEmitting = true
    emit('update:slideData', {
      texts: texts.value,
      images: images.value,
      rectangles: rectangles.value,
      circles: circles.value,
      links: links.value,
      triangles: triangles.value,
      stars: stars.value,
      charts: charts.value,
      videos: videos.value,
      tables: tables.value
    })
    nextTick(() => {
      isEmitting = false
    })
  }
}, { deep: true })

// All components in render order (unified for z-index management)
const allComponents = computed(() => {
  // Combine all components with their type info
  // Note: Only non-GIF images are rendered on canvas; GIFs use HTML overlay
  const combined = [
    ...texts.value.map(t => ({ ...t, __type: 'text', __zIndex: t.__zIndex || 0 })),
    ...canvasImages.value.map(i => ({ ...i, __type: 'image', __zIndex: i.__zIndex || 0 })),
    ...rectangles.value.map(r => ({ ...r, __type: 'rect', __zIndex: r.__zIndex || 0 })),
    ...circles.value.map(c => ({ ...c, __type: 'circle', __zIndex: c.__zIndex || 0 })),
    ...links.value.map(l => ({ ...l, __type: 'link', __zIndex: l.__zIndex || 0 })),
    ...triangles.value.map(t => ({ ...t, __type: 'triangle', __zIndex: t.__zIndex || 0 })),
    ...stars.value.map(s => ({ ...s, __type: 'star', __zIndex: s.__zIndex || 0 })),
    ...hexagons.value.map(h => ({ ...h, __type: 'hexagon', __zIndex: h.__zIndex || 0 })),
    ...pentagons.value.map(p => ({ ...p, __type: 'pentagon', __zIndex: p.__zIndex || 0 })),
    ...diamonds.value.map(d => ({ ...d, __type: 'diamond', __zIndex: d.__zIndex || 0 })),
    ...rings.value.map(r => ({ ...r, __type: 'ring', __zIndex: r.__zIndex || 0 })),
    ...ellipses.value.map(e => ({ ...e, __type: 'ellipse', __zIndex: e.__zIndex || 0 })),
    ...arrows.value.map(a => ({ ...a, __type: 'arrow', __zIndex: a.__zIndex || 0 })),
    ...parallelograms.value.map(p => ({ ...p, __type: 'parallelogram', __zIndex: p.__zIndex || 0 })),
    ...charts.value.map(c => ({ ...c, __type: 'chart', __zIndex: c.__zIndex || 0 })),
    ...videos.value.map(v => ({ ...v, __type: 'video', __zIndex: v.__zIndex || 0 })),
    ...tables.value.map(t => ({ ...t, __type: 'table', __zIndex: t.__zIndex || 0 }))
  ]
  // Sort by z-index (lower z-index = rendered first = behind)
  return combined.sort((a, b) => a.__zIndex - b.__zIndex)
})

// Selected shape
const selectedId = ref(null)

// Multi-selection state
const selectedIds = ref(new Set())
const isMultiSelecting = ref(false)
const selectionRect = ref(null)
const selectionStartPos = ref({ x: 0, y: 0 })
const previousPositions = ref(new Map())

// Helper to check if element is selected (for template usage)
const isSelected = (id) => {
  return selectedId.value === id || selectedIds.value.has(id)
}

const transformer = ref(null)
const layer = ref(null)

// Transformer configuration based on selected element type
const transformerConfig = computed(() => {
  if (!selectedId.value) return {}
  
  // Check if selected element is text
  const isText = texts.value.some(t => t.id === selectedId.value)
  
  if (isText) {
    // For text container: allow all anchors for full resize control
    return {
      enabledAnchors: ['top-left', 'top-center', 'top-right', 
                       'middle-left', 'middle-right',
                       'bottom-left', 'bottom-center', 'bottom-right']
    }
  }
  
  // For shapes and images: allow all anchors (normal resizing)
  return {
    enabledAnchors: ['top-left', 'top-center', 'top-right', 
                     'middle-left', 'middle-right',
                     'bottom-left', 'bottom-center', 'bottom-right']
  }
})

// Floating text toolbar state
const showTextToolbar = ref(false)
const textToolbarPosition = ref({ x: 0, y: 0 })

// Floating shape toolbar state
const showShapeToolbar = ref(false)
const shapeToolbarPosition = ref({ x: 0, y: 0 })

// Floating image toolbar state
const showImageToolbar = ref(false)
const imageToolbarPosition = ref({ x: 0, y: 0 })

// Floating chart toolbar state
const showChartToolbar = ref(false)
const chartToolbarPosition = ref({ x: 0, y: 0 })

// Floating video toolbar state
const showVideoToolbar = ref(false)
const videoToolbarPosition = ref({ x: 0, y: 0 })

// Floating table toolbar state
const showTableToolbar = ref(false)
const tableToolbarPosition = ref({ x: 0, y: 0 })

// Table dragging state
// draggingTableId already declared above before watch
const tableDragStart = ref({ x: 0, y: 0 })
const tableInitialPos = ref({ x: 0, y: 0 })
// isDraggingTable already declared above before watch

// Table resizing state
const resizingTableId = ref(null)
const tableResizeHandle = ref(null)
const tableResizeStart = ref({ x: 0, y: 0 })
const tableInitialBounds = ref({ x: 0, y: 0, width: 0, height: 0, rows: 0, cols: 0 })
const isResizingTable = ref(false)

// Chart dragging state
// draggingChartId already declared above in composable
const chartDragStart = ref({ x: 0, y: 0 })
const chartInitialPos = ref({ x: 0, y: 0 })
// Note: isDraggingChart is managed by composable

// Chart resizing state
const resizingChartId = ref(null)
const resizeHandle = ref(null)
const chartResizeStart = ref({ x: 0, y: 0 })
const chartInitialBounds = ref({ x: 0, y: 0, width: 0, height: 0 })
const isResizing = ref(false)

// GIF image dragging state (similar to chart)
// draggingImageId already declared above before watch
const imageDragStart = ref({ x: 0, y: 0 })
const imageInitialPos = ref({ x: 0, y: 0 })

// isDraggingKonvaElement already declared above before watch

// Text editing state
const isEditingText = ref(false)

// Watch table position changes and update toolbar position
watch(
  () => {
    const table = tables.value.find(t => t.id === selectedId.value)
    return table ? { x: table.x, y: table.y, width: table.width, height: table.height, id: table.id } : null
  },
  (tablePos) => {
    if (tablePos && showTableToolbar.value && editorRoot.value) {
      nextTick(() => {
        const canvasRect = editorRoot.value.getBoundingClientRect()
        const toolbarWidth = 400 // Estimated toolbar width
        tableToolbarPosition.value = {
          x: canvasRect.left + tablePos.x + tablePos.width / 2 - toolbarWidth / 2,  // Center horizontally above table
          y: canvasRect.top + tablePos.y - 100  // 60px above table
        }
      })
    }
  },
  { deep: true }
)
const editingTextId = ref(null)
const editingTextContent = ref('')
const inlineTextInput = ref(null)

// Link editing dialog
const isEditingLink = ref(false)
const editingLinkId = ref(null)
const editingLinkUrl = ref('')
const editingLinkText = ref('')

// Chart editor dialog
const showChartEditor = ref(false)
const pendingChartType = ref('bar')
const editingChartId = ref(null)

// History for undo/redo
const history = ref([])
const historyIndex = ref(-1)
const maxHistorySize = 50

// Clipboard for copy/paste
const clipboard = ref(null)
const editingFontSize = ref(24)

// Compute inline editor position and style
const inlineEditorStyle = computed(() => {
  if (!editingTextId.value) return {}
  
  const text = texts.value.find(t => t.id === editingTextId.value)
  if (!text) return {}
  
  // Calculate container dimensions (same as v-rect container)
  const width = getTextWidth(text)
  const height = getTextHeight(text)
  
  return {
    position: 'absolute',
    left: `${text.x}px`,
    top: `${text.y}px`,
    width: `${width}px`,
    height: `${height}px`,
    zIndex: 10000
  }
})

const inlineTextInputStyle = computed(() => {
  if (!editingTextId.value) return {}
  
  const text = texts.value.find(t => t.id === editingTextId.value)
  if (!text) return {}
  
  const fontSize = text.fontSize || 24
  
  return {
    width: '100%',
    height: '100%',
    fontSize: `${fontSize}px`,
    fontWeight: text.fontWeight || '400', // Explicit numeric weight
    fontStyle: text.fontStyle || 'normal',
    textDecoration: text.textDecoration || 'none',
    textAlign: text.align || 'left',
    color: text.fill || '#333',
    lineHeight: '1.5', // Match Konva text lineHeight
    padding: '0',
    margin: '0',
    boxSizing: 'border-box',
    fontFamily: text.fontFamily || 'Arial, sans-serif', // Match canvas default
    verticalAlign: 'top',
    letterSpacing: 'normal'
  }
})

// Apply theme style to canvas background (HTML layer behind Konva)
const canvasBackgroundStyle = computed(() => {
  return {
    background: props.themeStyle?.background || 'white',
    color: props.themeStyle?.color || '#333',
    fontFamily: props.themeStyle?.fontFamily || 'inherit',
    width: `${SLIDE_WIDTH}px`,
    height: `${SLIDE_HEIGHT}px`,
    position: 'absolute',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.08)'
  }
})

// Get default text color from theme
const defaultTextColor = computed(() => {
  return props.themeStyle?.color || '#333'
})

// Watch theme color changes and update texts that use default color
watch(() => props.themeStyle?.color, (newColor, oldColor) => {
  if (!newColor || !oldColor || newColor === oldColor) return
  
  // Update texts that still have the old default color
  texts.value.forEach(text => {
    // Only update if the text is using the old theme color
    if (text.fill === oldColor || text.fill === '#333') {
      text.fill = newColor
    }
  })
})

// File upload ref
// const fileInputRef = ref(null)

// Computed
// const totalObjects = computed(() => {
//   return texts.value.length + images.value.length + rectangles.value.length + circles.value.length + charts.value.length
// })

// Save current state to history
const saveToHistory = () => {
  const state = {
    texts: JSON.parse(JSON.stringify(texts.value)),
    images: JSON.parse(JSON.stringify(images.value)),
    rectangles: JSON.parse(JSON.stringify(rectangles.value)),
    circles: JSON.parse(JSON.stringify(circles.value)),
    charts: JSON.parse(JSON.stringify(charts.value))
  }
  
  // Remove any states after current index
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  
  // Add new state
  history.value.push(state)
  
  // Limit history size
  if (history.value.length > maxHistorySize) {
    history.value.shift()
  } else {
    historyIndex.value++
  }
}

// Video management composable (initialized after saveToHistory is defined)
const videoManagement = useVideoManagement(props, {
  videos,
  saveToHistory,
  emitUpdate,
  t
})

// Destructure video management functions and state
const {
  draggingVideoId,
  isDragging: isVideoDragging,
  isResizingVideo,
  showVideoUrlInput,
  videoUrl,
  selectedVideoData,
  addVideoFromUrl,
  handleVideoFileUpload,
  handleVideoReplaceUrl: videoReplaceUrl,
  extractVideoId,
  handleVideoClick: videoClick,
  handleVideoMouseDown: videoMouseDown,
  handleVideoResizeStart: videoResizeStart,
  cleanupVideoListeners
} = videoManagement

// Restore state from history
const restoreFromHistory = (state) => {
  texts.value = JSON.parse(JSON.stringify(state.texts))
  images.value = JSON.parse(JSON.stringify(state.images))
  rectangles.value = JSON.parse(JSON.stringify(state.rectangles))
  circles.value = JSON.parse(JSON.stringify(state.circles))
  charts.value = JSON.parse(JSON.stringify(state.charts || []))
  
  // Initialize z-indices for components that don't have them
  initializeZIndices()
  
  selectedId.value = null
  showTextToolbar.value = false
  showShapeToolbar.value = false
  nextTick(() => {
    updateTransformer()
  })
}

// Undo function
const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    restoreFromHistory(history.value[historyIndex.value])
    Message.success(t('slide.visual.messages.undo'))
  }
}

// Redo function
const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    restoreFromHistory(history.value[historyIndex.value])
    Message.success(t('slide.visual.messages.redo'))
  }
}

// Copy function
const copySelected = () => {
  if (!selectedId.value) {
    console.log('[VisualEditor] No element selected for copying')
    return
  }
  
  console.log('[VisualEditor] Copying element:', selectedId.value)
  
  const text = texts.value.find(t => t.id === selectedId.value)
  if (text) {
    clipboard.value = { type: 'text', data: JSON.parse(JSON.stringify(text)) }
    console.log('[VisualEditor] Copied text:', text.id)
    Message.success(t('slide.visual.messages.copied'))
    return
  }
  
  const rect = rectangles.value.find(r => r.id === selectedId.value)
  if (rect) {
    clipboard.value = { type: 'rectangle', data: JSON.parse(JSON.stringify(rect)) }
    console.log('[VisualEditor] Copied rectangle:', rect.id)
    Message.success(t('slide.visual.messages.copied'))
    return
  }
  
  const circle = circles.value.find(c => c.id === selectedId.value)
  if (circle) {
    clipboard.value = { type: 'circle', data: JSON.parse(JSON.stringify(circle)) }
    console.log('[VisualEditor] Copied circle:', circle.id)
    Message.success(t('slide.visual.messages.copied'))
    return
  }
  
  const image = images.value.find(i => i.id === selectedId.value)
  if (image) {
    // Extract image source properly
    const imageSrc = extractImageSource(image.image)
    
    console.log('[VisualEditor] Copying image - src length:', imageSrc.length, 'preview:', imageSrc.substring(0, 50) + '...')
    
    // Create clean copy with preserved image source
    const cleanImageData = {
      id: image.id,
      x: image.x,
      y: image.y,
      width: image.width,
      height: image.height,
      isGif: image.isGif,
      draggable: image.draggable,
      name: image.name,
      __zIndex: image.__zIndex,
      image: imageSrc ? { src: imageSrc } : null
    }
    
    clipboard.value = { type: 'image', data: cleanImageData }
    Message.success(t('slide.visual.messages.copied'))
    return
  }
  
  // Handle charts
  const chart = charts.value.find(c => c.id === selectedId.value)
  if (chart) {
    clipboard.value = { type: 'chart', data: JSON.parse(JSON.stringify(chart)) }
    console.log('[VisualEditor] Copied chart:', chart.id)
    Message.success(t('slide.visual.messages.copied'))
    return
  }
  
  // Handle links
  const link = links.value.find(l => l.id === selectedId.value)
  if (link) {
    clipboard.value = { type: 'link', data: JSON.parse(JSON.stringify(link)) }
    console.log('[VisualEditor] Copied link:', link.id)
    Message.success(t('slide.visual.messages.copied'))
    return
  }
  
  // Handle triangles
  const triangle = triangles.value.find(t => t.id === selectedId.value)
  if (triangle) {
    clipboard.value = { type: 'triangle', data: JSON.parse(JSON.stringify(triangle)) }
    console.log('[VisualEditor] Copied triangle:', triangle.id)
    Message.success(t('slide.visual.messages.copied'))
    return
  }
  
  // Handle stars
  const star = stars.value.find(s => s.id === selectedId.value)
  if (star) {
    clipboard.value = { type: 'star', data: JSON.parse(JSON.stringify(star)) }
    console.log('[VisualEditor] Copied star:', star.id)
    Message.success(t('slide.visual.messages.copied'))
    return
  }
  
  // Handle videos
  const video = videos.value.find(v => v.id === selectedId.value)
  if (video) {
    clipboard.value = { type: 'video', data: JSON.parse(JSON.stringify(video)) }
    console.log('[VisualEditor] Copied video:', video.id)
    Message.success(t('slide.visual.messages.copied'))
    return
  }
  
  console.warn('[VisualEditor] No element found for copying:', selectedId.value)
}

// Duplicate function - copy and immediately paste
const duplicateSelected = () => {
  if (!selectedId.value) return
  
  console.log('[VisualEditor] Duplicating element:', selectedId.value)
  
  // First copy the element
  copySelected()
  
  // Then paste it immediately
  // Small delay to ensure clipboard is updated
  setTimeout(() => {
    paste()
    console.log('[VisualEditor] Duplicated element')
    // Force update transformer to show selection on new element
    nextTick(() => {
      updateTransformer()
    })
  }, 10)
}

// Paste function
const paste = () => {
  if (!clipboard.value) {
    console.log('[VisualEditor] Nothing to paste - clipboard is empty')
    Message.warning(t('slide.visual.messages.nothingToPaste'))
    return
  }
  
  console.log('[VisualEditor] Pasting:', clipboard.value.type, clipboard.value.data.id)
  console.log('[VisualEditor] Before paste - images count:', images.value.length)
  
  const data = JSON.parse(JSON.stringify(clipboard.value.data))
  const newId = `${clipboard.value.type}-${Date.now()}`
  data.id = newId
  data.x += 20 // Offset pasted item
  data.y += 20
  
  saveToHistory()
  
  switch (clipboard.value.type) {
    case 'text':
      texts.value.push(data)
      console.log('[VisualEditor] Pasted text:', newId)
      // Use double nextTick to ensure Konva has rendered the node
      nextTick(() => {
        nextTick(() => updateTransformer())
      })
      break
    case 'rectangle':
      rectangles.value.push(data)
      console.log('[VisualEditor] Pasted rectangle:', newId)
      // Use double nextTick to ensure Konva has rendered the node
      nextTick(() => {
        nextTick(() => updateTransformer())
      })
      break
    case 'circle':
      circles.value.push(data)
      console.log('[VisualEditor] Pasted circle:', newId)
      // Use double nextTick to ensure Konva has rendered the node
      nextTick(() => {
        nextTick(() => updateTransformer())
      })
      break
    case 'image': {
      const imageSrc = extractImageSource(data.image)
      
      console.log('[VisualEditor] Pasting image - src length:', imageSrc.length)
      
      if (data.isGif) {
        // GIF images don't need Image object reconstruction
        images.value.push(data)
        console.log('[VisualEditor] Pasted GIF image:', newId)
        // Use double nextTick to ensure Konva has rendered the node
        nextTick(() => {
          nextTick(() => updateTransformer())
        })
      } else if (imageSrc) {
        // Non-GIF images need Image object reconstruction
        const imageObj = createImageObject(imageSrc)
        
        // Wait for image to load before adding to canvas
        imageObj.onload = () => {
          console.log('[VisualEditor] Image loaded successfully:', newId)
          const reconstructedImage = { ...data, image: imageObj }
          images.value.push(reconstructedImage)
          // Use double nextTick to ensure Konva has rendered the node
          nextTick(() => {
            nextTick(() => updateTransformer())
          })
        }
        
        imageObj.onerror = (err) => {
          console.error('[VisualEditor] Failed to load image:', newId, err)
          images.value.push(data)
          // Use double nextTick to ensure Konva has rendered the node
          nextTick(() => {
            nextTick(() => updateTransformer())
          })
        }
      } else {
        console.warn('[VisualEditor] Pasting image without valid source:', newId)
        images.value.push(data)
        // Use double nextTick to ensure Konva has rendered the node
        nextTick(() => {
          nextTick(() => updateTransformer())
        })
      }
      break
    }
    case 'chart':
      charts.value.push(data)
      console.log('[VisualEditor] Pasted chart:', newId)
      // Use double nextTick to ensure Konva has rendered the node
      nextTick(() => {
        nextTick(() => updateTransformer())
      })
      break
    case 'link':
      links.value.push(data)
      console.log('[VisualEditor] Pasted link:', newId)
      // Use double nextTick to ensure Konva has rendered the node
      nextTick(() => {
        nextTick(() => updateTransformer())
      })
      break
    case 'triangle':
      triangles.value.push(data)
      console.log('[VisualEditor] Pasted triangle:', newId)
      // Use double nextTick to ensure Konva has rendered the node
      nextTick(() => {
        nextTick(() => updateTransformer())
      })
      break
    case 'star':
      stars.value.push(data)
      console.log('[VisualEditor] Pasted star:', newId)
      // Use double nextTick to ensure Konva has rendered the node
      nextTick(() => {
        nextTick(() => updateTransformer())
      })
      break
    case 'video':
      videos.value.push(data)
      console.log('[VisualEditor] Pasted video:', newId)
      emitUpdate()
      break
    default:
      console.warn('[VisualEditor] Unknown clipboard type:', clipboard.value.type)
      Message.warning(t('slide.visual.messages.unsupportedElementType', { type: clipboard.value.type }))
      return
  }
  
  selectedId.value = newId
  Message.success(t('slide.visual.messages.pasted'))
  
  console.log('[VisualEditor] After paste - images count:', images.value.length)
  console.log('[VisualEditor] New element ID:', newId)
  
  // Log all images for debugging
  console.log('[VisualEditor] Current images state:', images.value.map(img => ({
    id: img.id,
    isGif: img.isGif,
    hasImageObject: !!img.image,
    x: img.x,
    y: img.y,
    width: img.width,
    height: img.height
  })))
  
  nextTick(() => {
    updateTransformer()
  })
}

// Handle system clipboard paste (external images/text)
// Global flag to prevent multiple instances from handling the same paste
let isPasteBeingHandled = false

const handleSystemPaste = async (e) => {
  console.log('[VisualEditor] ============ PASTE EVENT FIRED ============')
  console.log('[VisualEditor] Is thumbnail:', props.isThumbnail)
  
  // Skip if this is a thumbnail preview
  if (props.isThumbnail) {
    console.log('[VisualEditor] Skipping paste - thumbnail mode')
    return
  }
  
  // Check if we're pasting into an editable element (like table cell)
  const activeElement = document.activeElement
  const isTextInput = activeElement?.tagName === 'INPUT' || 
                      activeElement?.tagName === 'TEXTAREA' ||
                      activeElement?.isContentEditable
  
  // If pasting into a text input/contenteditable, allow it even in readonly mode
  if (isTextInput) {
    console.log('[VisualEditor] Allowing paste - contenteditable element is active')
    return // Let the element's own paste handler take over
  }
  
  // Only block paste for canvas elements if in readonly mode
  if (props.readonly) {
    console.log('[VisualEditor] Skipping paste - readonly mode (not in text input)')
    return
  }
  
  // Check if another instance is already handling this paste
  if (isPasteBeingHandled) {
    console.log('[VisualEditor] Skipping paste - already being handled by another instance')
    return
  }
  
  // PRIORITY 1: Check internal clipboard first (for copied components)
  if (clipboard.value) {
    console.log('[VisualEditor] Internal clipboard has content, using internal paste')
    e.preventDefault()
    e.stopImmediatePropagation()
    paste() // Use internal paste function
    return
  }
  
  // PRIORITY 2: If no internal clipboard, handle system clipboard (external content)
  console.log('[VisualEditor] No internal clipboard, checking system clipboard')
  
  // Prevent default and stop propagation to prevent other handlers
  e.preventDefault()
  e.stopImmediatePropagation()
  
  // Set flag to prevent other instances from handling
  isPasteBeingHandled = true
  
  const items = e.clipboardData?.items
  if (!items) {
    console.log('[VisualEditor] No clipboard items found')
    isPasteBeingHandled = false
    return
  }
  
  console.log('[VisualEditor] Clipboard items count:', items.length)
  
  // Try to find an image first
  let imageHandled = false
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    console.log('[VisualEditor] Item', i, '- type:', item.type, 'kind:', item.kind)
    
    if (item.type.indexOf('image') !== -1) {
      console.log('[VisualEditor] Found image in clipboard')
      const blob = item.getAsFile()
      
      if (blob) {
        console.log('[VisualEditor] Image blob size:', blob.size, 'bytes')
        
        // Upload image to server instead of using base64
        try {
          console.log('[VisualEditor] Uploading pasted image to server...')
          
          // Create FormData for upload
          const formData = new FormData()
          formData.append('file', blob, `pasted-image-${Date.now()}.png`)
          formData.append('source', 'clipboard')
          
          // Upload to server using API wrapper
          const result = await uploadApi(formData)
          
          if (!result || !result.data || !result.data.url) {
            throw new Error('Upload failed: Invalid response')
          }
          
          console.log('[VisualEditor] Image uploaded successfully:', result.data.url)
          
          // Use the server URL instead of base64
          const imageUrl = result.data.url
          
          // Create a new image object with the URL
          const imageObj = createImageObject(imageUrl)
          
          imageObj.onload = () => {
            console.log('[VisualEditor] Image loaded - dimensions:', imageObj.width, 'x', imageObj.height)
            
            saveToHistory()
            
            // Calculate scaled dimensions to fit on slide
            const maxWidth = SLIDE_WIDTH * 0.4 // 40% of slide width
            const maxHeight = SLIDE_HEIGHT * 0.4 // 40% of slide height
            
            let width = imageObj.width
            let height = imageObj.height
            
            // Scale down if needed
            if (width > maxWidth || height > maxHeight) {
              const widthRatio = maxWidth / width
              const heightRatio = maxHeight / height
              const ratio = Math.min(widthRatio, heightRatio)
              
              width = width * ratio
              height = height * ratio
              console.log('[VisualEditor] Image scaled to:', width, 'x', height)
            }
            
            // Add image to center of slide
            const imageId = `image-${Date.now()}`
            const newImage = {
              id: imageId,
              name: imageId, // Konva needs 'name' property for findOne() to work
              x: (SLIDE_WIDTH - width) / 2,
              y: (SLIDE_HEIGHT - height) / 2,
              width,
              height,
              image: imageObj,
              rotation: 0,
              opacity: 1,
              draggable: true
            }
            
            images.value.push(newImage)
            selectedId.value = newImage.id
            
            console.log('[VisualEditor] Image added to slide:', newImage.id)
            Message.success(t('slide.visual.messages.imagePasted'))
            
            // Reset flag after successful paste
            isPasteBeingHandled = false
            
            // Use double nextTick to ensure Konva has rendered the node
            nextTick(() => {
              nextTick(() => {
                updateTransformer()
              })
            })
          }
          
          imageObj.onerror = (err) => {
            console.error('[VisualEditor] Failed to load pasted image:', err)
            Message.error(t('slide.visual.messages.imageLoadFailed'))
            // Reset flag after error
            isPasteBeingHandled = false
          }
        } catch (error) {
          console.error('[VisualEditor] Failed to upload pasted image:', error)
          Message.error(t('slide.visual.messages.failedToUploadImage', { error: error.message }))
          // Reset flag after error
          isPasteBeingHandled = false
        }
        imageHandled = true
        break
      }
    }
  }
  
  // If no image was handled, try to get text
  if (!imageHandled) {
    const text = e.clipboardData.getData('text/plain')
    console.log('[VisualEditor] Clipboard text length:', text?.length || 0)
    
    if (text && text.trim()) {
      console.log('[VisualEditor] Adding text from clipboard')
      
      saveToHistory()
      
      // Add text to center of slide
      const textId = `text-${Date.now()}`
      const newText = {
        id: textId,
        name: textId, // Konva needs 'name' property for findOne() to work
        text: text.trim(),
        x: SLIDE_WIDTH / 2 - 100,
        y: SLIDE_HEIGHT / 2 - 20,
        width: 200,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: '#000000',
        align: 'left',
        rotation: 0,
        opacity: 1,
        draggable: true,
        __zIndex: getNextZIndex()
      }
      
      texts.value.push(newText)
      selectedId.value = newText.id
      
      console.log('[VisualEditor] Text added to slide:', newText.id)
      Message.success(t('slide.visual.messages.textPasted'))
      
      // Reset flag after successful paste
      isPasteBeingHandled = false
      
      // Use double nextTick to ensure Konva has rendered the node
      nextTick(() => {
        nextTick(() => {
          updateTransformer()
        })
      })
    } else {
      console.log('[VisualEditor] No valid content in clipboard')
      // Reset flag if no valid content
      isPasteBeingHandled = false
    }
  }
}


const selectedComponentData = computed(() => {
  if (!selectedId.value) return null
  
  // Find the component in all arrays
  let component = null
  let type = null
  
  component = texts.value.find(t => t.id === selectedId.value)
  if (component) {
    type = 'text'
  } else {
    component = images.value.find(i => i.id === selectedId.value)
    if (component) {
      type = 'image'
    } else {
      component = rectangles.value.find(r => r.id === selectedId.value)
      if (component) {
        type = 'rect'
      } else {
        component = circles.value.find(c => c.id === selectedId.value)
        if (component) {
          type = 'circle'
        }
      }
    }
  }
  
  return component ? { ...component, type } : null
})


// Get selected text data for floating toolbar
const selectedTextData = computed(() => {
  if (!selectedId.value) return null
  const text = texts.value.find(t => t.id === selectedId.value)
  const link = links.value.find(l => l.id === selectedId.value)
  return text || link || null
})

// Computed property for selected shape
const selectedShapeData = computed(() => {
  if (!selectedId.value) return null
  const rect = rectangles.value.find(r => r.id === selectedId.value)
  if (rect) return rect
  const circle = circles.value.find(c => c.id === selectedId.value)
  if (circle) return circle
  const triangle = triangles.value.find(t => t.id === selectedId.value)
  if (triangle) return triangle
  const star = stars.value.find(s => s.id === selectedId.value)
  return star || null
})

// Get selected image data
const selectedImageData = computed(() => {
  if (!selectedId.value) return null
  return images.value.find(i => i.id === selectedId.value) || null
})

// Get selected chart data
const selectedChartData = computed(() => {
  if (!selectedId.value) return null
  return charts.value.find(c => c.id === selectedId.value) || null
})

// Helper to get next z-index
const getNextZIndex = () => {
  const allComps = [
    ...texts.value,
    ...images.value,
    ...rectangles.value,
    ...circles.value,
    ...links.value,
    ...triangles.value,
    ...stars.value,
    ...charts.value,
    ...videos.value,
    ...tables.value
  ]
  const maxZ = allComps.length > 0 ? Math.max(...allComps.map(c => c.__zIndex || 0)) : 0
  return maxZ + 1
}

// Layer control functions
const moveToTop = () => {
  if (!selectedId.value) return
  
  const allArrays = [
    { arr: texts, name: 'text' },
    { arr: images, name: 'image' },
    { arr: rectangles, name: 'rect' },
    { arr: circles, name: 'circle' },
    { arr: links, name: 'link' },
    { arr: triangles, name: 'triangle' },
    { arr: stars, name: 'star' },
    { arr: charts, name: 'chart' },
    { arr: videos, name: 'video' },
    { arr: tables, name: 'table' }
  ]
  
  for (const { arr } of allArrays) {
    const item = arr.value.find(i => i.id === selectedId.value)
    if (item) {
      item.__zIndex = getNextZIndex()
      emitUpdate()
      saveToHistory()
      return
    }
  }
}

const moveForward = () => {
  if (!selectedId.value) return
  
  const allComps = [
    ...texts.value,
    ...images.value,
    ...rectangles.value,
    ...circles.value,
    ...links.value,
    ...triangles.value,
    ...stars.value,
    ...charts.value,
    ...videos.value,
    ...tables.value
  ]
  
  const currentItem = allComps.find(c => c.id === selectedId.value)
  if (!currentItem) return
  
  const currentZ = currentItem.__zIndex || 0
  const higherItems = allComps.filter(c => (c.__zIndex || 0) > currentZ)
  
  if (higherItems.length > 0) {
    const nextZ = Math.min(...higherItems.map(c => c.__zIndex || 0))
    currentItem.__zIndex = nextZ + 0.5
    emitUpdate()
    saveToHistory()
  }
}

const moveBackward = () => {
  if (!selectedId.value) return
  
  const allComps = [
    ...texts.value,
    ...images.value,
    ...rectangles.value,
    ...circles.value,
    ...links.value,
    ...triangles.value,
    ...stars.value,
    ...charts.value,
    ...videos.value,
    ...tables.value
  ]
  
  const currentItem = allComps.find(c => c.id === selectedId.value)
  if (!currentItem) return
  
  const currentZ = currentItem.__zIndex || 0
  const lowerItems = allComps.filter(c => (c.__zIndex || 0) < currentZ)
  
  if (lowerItems.length > 0) {
    const prevZ = Math.max(...lowerItems.map(c => c.__zIndex || 0))
    currentItem.__zIndex = prevZ - 0.5
    emitUpdate()
    saveToHistory()
  }
}

const moveToBottom = () => {
  if (!selectedId.value) return
  
  const allComps = [
    ...texts.value,
    ...images.value,
    ...rectangles.value,
    ...circles.value,
    ...links.value,
    ...triangles.value,
    ...stars.value,
    ...charts.value,
    ...videos.value,
    ...tables.value
  ]
  
  const currentItem = allComps.find(c => c.id === selectedId.value)
  if (!currentItem) return
  
  const allZIndices = allComps.map(c => c.__zIndex || 0)
  const minZ = allZIndices.length > 0 ? Math.min(...allZIndices) : 0
  currentItem.__zIndex = minZ - 1
  emitUpdate()
  saveToHistory()
}

// Helper to calculate proper text height based on line count
const getTextHeight = (comp) => {
  if (comp.height) return comp.height // Use explicit height if set
  
  const fontSize = comp.fontSize || 24
  const text = comp.text || ''
  const lineCount = text.split('\n').length
  
  // For multiline text (with newlines), calculate height based on line count
  if (lineCount > 1) {
    return lineCount * fontSize * 1.5
  }
  
  // For single line text, use simple calculation
  return fontSize * 1.5
}

// Helper to generate ellipse points
const generateEllipsePoints = (radiusX, radiusY, segments = 64) => {
  const points = []
  for (let i = 0; i < segments; i++) {
    const angle = (Math.PI * 2 / segments) * i
    points.push(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY)
  }
  return points
}

// Helper to generate ring (donut) points using two circles
const generateRingPoints = (innerRadius, outerRadius, segments = 64) => {
  const points = []
  // Outer circle (clockwise)
  for (let i = 0; i <= segments; i++) {  // Include last point to close
    const angle = (Math.PI * 2 / segments) * i
    points.push(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius)
  }
  // Inner circle (counter-clockwise to create hole)
  for (let i = segments; i >= 0; i--) {  // Include first point to close
    const angle = (Math.PI * 2 / segments) * i
    points.push(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius)
  }
  return points
}

// Helper to calculate accurate text width using Konva's text measurement
const getTextWidth = (comp) => {
  if (comp.width) return comp.width // Use explicit width if set
  
  const text = comp.text || ''
  const fontSize = comp.fontSize || 24
  const fontFamily = comp.fontFamily || 'Arial, sans-serif'
  
  // Create a temporary Konva.Text object to measure width
  const tempText = new window.Konva.Text({
    text: text,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontStyle: comp.fontStyle || 'normal',
    lineHeight: comp.lineHeight || 1.5,
    wrap: comp.wrap || 'word'
  })
  
  // Get the measured width
  const measuredWidth = tempText.getTextWidth()
  
  // Clean up the temporary object
  tempText.destroy()
  
  // Return measured width with minimum size to ensure usability
  return Math.max(measuredWidth, 50) // Minimum 50px width
}

// Helper function to extract image source safely
const extractImageSource = (imageData) => {
  if (!imageData) return ''
  
  if (typeof imageData === 'string') {
    return imageData
  }
  
  if (typeof imageData === 'object') {
    if (imageData.src) {
      return imageData.src
    }
    if (imageData.image) {
      return typeof imageData.image === 'string' ? imageData.image : imageData.image.src || ''
    }
  }
  
  return ''
}

// Helper function to create image data object
const createImageObject = (src) => {
  if (!src) return null
  
  const img = new window.Image()
  img.src = src
  return img
}

// Initialize z-index for all components (for existing components without __zIndex)
const initializeZIndices = () => {
  let zIndex = 0
  
  // Assign z-index to texts
  texts.value.forEach(t => {
    if (t.__zIndex === undefined) {
      t.__zIndex = zIndex++
    }
  })
  
  // Assign z-index to images  
  images.value.forEach(i => {
    if (i.__zIndex === undefined) {
      i.__zIndex = zIndex++
    }
  })
  
  // Assign z-index to rectangles
  rectangles.value.forEach(r => {
    if (r.__zIndex === undefined) {
      r.__zIndex = zIndex++
    }
  })
  
  // Assign z-index to circles
  circles.value.forEach(c => {
    if (c.__zIndex === undefined) {
      c.__zIndex = zIndex++
    }
  })
  
  // Assign z-index to links
  links.value.forEach(l => {
    if (l.__zIndex === undefined) {
      l.__zIndex = zIndex++
    }
  })
  
  // Assign z-index to triangles
  triangles.value.forEach(t => {
    if (t.__zIndex === undefined) {
      t.__zIndex = zIndex++
    }
  })
  
  // Assign z-index to stars
  stars.value.forEach(s => {
    if (s.__zIndex === undefined) {
      s.__zIndex = zIndex++
    }
  })

  // Assign z-index to charts
  charts.value.forEach(c => {
    if (c.__zIndex === undefined) {
      c.__zIndex = zIndex++
    }
  })

  // Assign z-index to videos
  videos.value.forEach(v => {
    if (v.__zIndex === undefined) {
      v.__zIndex = zIndex++
    }
  })
}

// Add text
const addText = (props = {}) => {
  const id = `text-${Date.now()}`
  const text = props.text || 'Double-click to edit'
  const fontSize = props.fontSize || 18
  
  // Calculate dimensions for multiline text
  const lineCount = text.split('\n').length
  const lineHeight = fontSize * 1.5 // Line height multiplier
  const estimatedWidth = props.width || 400 // Default width for text wrapping
  const estimatedHeight = props.height || (lineCount * lineHeight)
  
  texts.value.push({
    id,
    x: 480 - estimatedWidth/2, // Center horizontally (canvas center: 480px)
    y: 270 - estimatedHeight/2, // Center vertically (canvas center: 270px)
    text,
    fontSize,
    fontWeight: props.fontWeight || '400', // Numeric weight for consistency
    fontFamily: props.fontFamily || 'Arial, sans-serif', // Explicit font family
    fill: props.color || defaultTextColor.value, // Use theme color
    width: estimatedWidth, // Set width to enable wrapping
    height: estimatedHeight, // Set height based on line count
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  
  // Debug: Log the created text object
  console.log('[addText] Created text object:', {
    id,
    textPreview: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
    lineCount,
    x: texts.value[texts.value.length - 1].x,
    y: texts.value[texts.value.length - 1].y,
    width: estimatedWidth,
    height: estimatedHeight
  })
  
  saveToHistory()
  Message.success(t('slide.visual.messages.textAdded'))
}

// Add link component
const addLink = (props = {}) => {
  const id = `link-${Date.now()}`
  links.value.push({
    id,
    x: Math.random() * 500 + 230, // Center area of 960px canvas
    y: Math.random() * 250 + 145, // Center area of 540px canvas
    text: props.text || 'Click to edit link',
    url: props.url || 'https://example.com',
    fontSize: props.fontSize || 18,
    fontWeight: props.fontWeight || '400', // Numeric weight for consistency
    fontFamily: props.fontFamily || 'Arial, sans-serif', // Explicit font family
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.linkAdded'))
}

// Add layout component
const addLayout = (layoutTemplate) => {
  const id = `layout-${Date.now()}`
  
  console.log('[addLayout] Applying layout template:', layoutTemplate.id, layoutTemplate.name)
  
  // Clear existing content first (recommended for layout application)
  clearAllContent()
  
  // Process layout based on its type
  if (layoutTemplate.structure?.type === 'boxes') {
    addBoxLayout(layoutTemplate.structure.boxes, id)
  } else if (layoutTemplate.structure?.type === 'columns') {
    addColumnLayout(layoutTemplate.structure.columns, id)
  } else if (layoutTemplate.structure?.type === 'bullets') {
    addBulletLayout(layoutTemplate.structure.items, id)
  } else {
    console.warn('[addLayout] Unsupported layout type:', layoutTemplate.structure?.type)
    Message.warning(t('slide.visual.messages.unsupportedLayoutType'))
    return
  }
  
  saveToHistory()
  
  const layoutName = t(layoutTemplate.name) || layoutTemplate.name || layoutTemplate.id
  Message.success(t('slide.visual.messages.layoutApplied', { name: layoutName }))
}

// Clear all content from the canvas
const clearAllContent = () => {
  console.log('[clearAllContent] Clearing all canvas content')
  
  // Clear all component arrays
  texts.value = []
  images.value = []
  rectangles.value = []
  circles.value = []
  links.value = []
  triangles.value = []
  stars.value = []
  charts.value = []
  
  // Clear selection
  selectedId.value = null
  
  // Hide all floating toolbars
  showTextToolbar.value = false
  showShapeToolbar.value = false
  showImageToolbar.value = false
  showChartToolbar.value = false
  
  // Update transformer to reflect cleared state
  nextTick(() => {
    updateTransformer()
  })
  
  console.log('[clearAllContent] Canvas cleared successfully')
}

// Add box-based layout
const addBoxLayout = (boxes, parentId) => {
  boxes.forEach((box, index) => {
    const boxId = `${parentId}-box-${index}`
    
    // For boxes with fill/stroke, use rectangles
    if (box.fill !== 'transparent' || (box.stroke && box.stroke !== 'none')) {
      rectangles.value.push({
        id: boxId,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        fill: box.fill || 'transparent',
        stroke: box.stroke !== 'none' ? (box.stroke || '#000000') : undefined,
        strokeWidth: box.strokeWidth || (box.stroke !== 'none' ? 1 : 0),
        cornerRadius: box.cornerRadius || 0,
        draggable: true,
        name: boxId,
        __zIndex: getNextZIndex(),
        // Handle special borders as separate shapes
        ...(box.leftBorder && { leftBorder: box.leftBorder }),
        ...(box.topBorder && { topBorder: box.topBorder })
      })
    }
    
    // Handle circles inside boxes
    if (box.circle) {
      const circleId = `${boxId}-circle`
      circles.value.push({
        id: circleId,
        x: box.circle.x,
        y: box.circle.y,
        radius: box.circle.radius,
        fill: box.circle.fill || '#000000',
        stroke: 'none',
        strokeWidth: 0,
        draggable: true,
        name: circleId,
        __zIndex: getNextZIndex()
      })
    }
    
    console.log(`[addBoxLayout] Added box ${index}:`, boxId, box)
  })
}

// Add column-based layout
const addColumnLayout = (columns, parentId) => {
  columns.forEach((column, index) => {
    const colId = `${parentId}-col-${index}`
    
    // Create a placeholder rectangle for the column
    rectangles.value.push({
      id: colId,
      x: column.x,
      y: column.y,
      width: column.width?.replace('%', '') * 9.6 || column.width, // Convert % to px (960px canvas)
      height: column.height || 300,
      fill: '#f0f0f0',
      stroke: '#cccccc',
      strokeWidth: 1,
      dash: [5, 5], // Dashed line to indicate placeholder
      draggable: true,
      name: colId,
      __zIndex: getNextZIndex()
    })
    
    console.log(`[addColumnLayout] Added column ${index}:`, colId, column)
  })
}

// Add bullet-based layout
const addBulletLayout = (items, parentId) => {
  items.forEach((item, index) => {
    const itemId = `${parentId}-bullet-${index}`
    
    // Add bullet icon as text
    texts.value.push({
      id: `${itemId}-icon`,
      x: item.x,
      y: item.y,
      text: item.icon || '•',
      fontSize: item.iconSize || 24,
      fill: item.iconColor || '#000000',
      fontFamily: 'Arial, sans-serif',
      draggable: true,
      name: `${itemId}-icon`,
      __zIndex: getNextZIndex()
    })
    
    // Add placeholder text
    texts.value.push({
      id: `${itemId}-text`,
      x: item.textX || item.x + 30,
      y: item.y + 7,  // Align with arrow center (arrow fontSize 24, text fontSize 16)
      text: 'Double-click to edit',
      fontSize: 16,
      fill: defaultTextColor.value,
      fontFamily: 'Arial, sans-serif',
      draggable: true,
      name: `${itemId}-text`,
      __zIndex: getNextZIndex()
    })
    
    console.log(`[addBulletLayout] Added bullet ${index}:`, itemId, item)
  })
}

// Handle image upload
const handleImageUpload = (option) => {
  const { file, replaceId } = option
  const reader = new FileReader()
  
  reader.onload = (e) => {
    const img = new window.Image()
    img.src = e.target.result
    
    img.onload = () => {
      const maxWidth = 300
      const maxHeight = 300
      
      let width = img.width
      let height = img.height
      
      // Scale down if too large
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio
      }
      
      const imageObj = new window.Image()
      imageObj.src = e.target.result
      
      if (replaceId) {
        // Replace existing image
        saveToHistory()
        const imageIndex = images.value.findIndex(i => i.id === replaceId)
        if (imageIndex !== -1) {
          const existingImage = images.value[imageIndex]
          images.value[imageIndex] = {
            ...existingImage,
            width,
            height,
            image: imageObj,
            // Preserve filter properties
            filters: existingImage.filters || [],
            blurRadius: existingImage.blurRadius,
            brightness: existingImage.brightness,
            filterType: existingImage.filterType || 'none'
          }
          Message.success(t('slide.visual.images.replaced'))
        }
      } else {
        // Add new image
        const id = `image-${Date.now()}`
        images.value.push({
          id,
          x: 480 - width/2, // Center horizontally
          y: 270 - height/2, // Center vertically,
          width,
          height,
          image: imageObj,
          draggable: true,
          name: id,
          filter: 'none',
          __zIndex: getNextZIndex()
        })
        saveToHistory()
        Message.success(t('slide.visual.images.addedSuccess'))
      }
    }
  }
  
  reader.readAsDataURL(file)
}

// Add image from URL (for API images like GIPHY, Pexels, etc.)
const addImageFromUrl = (imageData) => {
  const { src, title, photographer, source } = imageData
  
  // Detect if this is a GIF (animated image)
  const isGif = src.toLowerCase().endsWith('.gif') || source === 'giphy'
  
  // For GIFs, we don't need to create Image object for Konva
  // Just add metadata to images array
  if (isGif) {
    const id = `image-${Date.now()}`
    
    // Create a temporary image to get dimensions
    const tempImg = new window.Image()
    tempImg.crossOrigin = 'anonymous'
    
    tempImg.onload = () => {
      const maxWidth = 400
      const maxHeight = 400
      
      let scaledWidth = tempImg.width
      let scaledHeight = tempImg.height
      
      if (scaledWidth > maxWidth || scaledHeight > maxHeight) {
        const ratio = Math.min(maxWidth / scaledWidth, maxHeight / scaledHeight)
        scaledWidth = scaledWidth * ratio
        scaledHeight = scaledHeight * ratio
      }
      
      images.value.push({
        id,
        x: 480 - scaledWidth/2, // Center horizontally
        y: 270 - scaledHeight/2, // Center vertically,
        width: scaledWidth,
        height: scaledHeight,
        src: src, // Store URL for HTML rendering
        isGif: true, // Mark as GIF for HTML overlay
        draggable: true,
        name: id,
        __zIndex: getNextZIndex(),
        metadata: {
          originalUrl: src,
          title: title || '',
          photographer: photographer || '',
          source: source || ''
        }
      })
      
      saveToHistory()
      
      if (photographer && source) {
        Message.success(t('slide.visual.images.gifAddedWithSource', { source, photographer }))
      } else {
        Message.success(t('slide.visual.images.gifAdded'))
      }
    }
    
    tempImg.onerror = () => {
      Message.error(t('slide.visual.images.gifLoadFailed'))
    }
    
    tempImg.src = src
    return
  }
  
  // For non-GIF images, use Konva Image object (original logic)
  const imageObj = new window.Image()
  imageObj.crossOrigin = 'anonymous'
  
  imageObj.onload = () => {
    const maxWidth = 400
    const maxHeight = 400
    
    let scaledWidth = imageObj.width
    let scaledHeight = imageObj.height
    
    if (scaledWidth > maxWidth || scaledHeight > maxHeight) {
      const ratio = Math.min(maxWidth / scaledWidth, maxHeight / scaledHeight)
      scaledWidth = scaledWidth * ratio
      scaledHeight = scaledHeight * ratio
    }
    
    const id = `image-${Date.now()}`
    images.value.push({
      id,
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 100,
      width: scaledWidth,
      height: scaledHeight,
      image: imageObj,
      isGif: false,
      draggable: true,
      name: id,
      filter: 'none',
      __zIndex: getNextZIndex(),
      metadata: {
        originalUrl: src,
        title: title || '',
        photographer: photographer || '',
        source: source || ''
      }
    })
    
    saveToHistory()
    
    if (photographer && source) {
      Message.success(t('slide.visual.images.addedWithSource', { source, photographer }))
    } else {
      Message.success(t('slide.visual.images.addedSuccess'))
    }
  }
  
  imageObj.onerror = () => {
    Message.error(t('slide.visual.images.loadFailed'))
  }
  
  imageObj.src = src
}

// Add rectangle
const addRect = (props = {}) => {
  const id = `rect-${Date.now()}`
  rectangles.value.push({
    id,
    x: 480 - (props.width || 150)/2, // Center horizontally
    y: 270 - (props.height || 80)/2, // Center vertically
    width: props.width || 150,
    height: props.height || 80,
    fill: props.fill || '#4285f4',
    stroke: props.stroke || '#3367d6',
    strokeWidth: props.strokeWidth || 2,
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.rectangleAdded'))
}

// Add circle
const addCircle = (props = {}) => {
  const id = `circle-${Date.now()}`
  circles.value.push({
    id,
    x: 480 - (props.radius || 40), // Center horizontally (x is center for circles)
    y: 270 - (props.radius || 40), // Center vertically (y is center for circles)
    radius: props.radius || 40,
    fill: props.fill || '#34a853',
    stroke: props.stroke || '#2d8e47',
    strokeWidth: props.strokeWidth || 2,
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.circleAdded'))
}

// Add triangle shape
const addTriangle = (props = {}) => {
  const id = `triangle-${Date.now()} `
  const centerX = 480  // Center horizontally
  const centerY = 270  // Center vertically
  const size = props.size || 80
  
  // Triangle points: top, bottom-right, bottom-left
  triangles.value.push({
    id,
    x: centerX,
    y: centerY,
    points: [
      0, -size / 2,        // Top point
      size / 2, size / 2,  // Bottom-right point
      -size / 2, size / 2  // Bottom-left point
    ],
    fill: props.fill || '#fbbc04',
    stroke: props.stroke || '#f9a825',
    strokeWidth: props.strokeWidth || 2,
    closed: true,
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.triangleAdded'))
}

// Add star shape
const addStar = (props = {}) => {
  const id = `star-${Date.now()}`
  stars.value.push({
    id,
    x: 480, // Center horizontally (x is center for stars)
    y: 270, // Center vertically (y is center for stars)
    numPoints: props.numPoints || 5,
    innerRadius: props.innerRadius || 20,
    outerRadius: props.outerRadius || 50,
    fill: props.fill || '#ff6d00',
    stroke: props.stroke || '#e65100',
    strokeWidth: props.strokeWidth || 2,
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.starAdded'))
}

// Add hexagon shape
const addHexagon = (props = {}) => {
  const id = `hexagon-${Date.now()}`
  const centerX = 480
  const centerY = 270
  const radiusX = props.radiusX || 70  // Wider horizontally
  const radiusY = props.radiusY || 40  // Shorter vertically for flatter look
  
  // Hexagon points (6 sides) - adjusted for horizontal orientation
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i  // Start from right side (no offset)
    points.push(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY)
  }
  
  hexagons.value.push({
    id,
    x: centerX,
    y: centerY,
    points,
    fill: props.fill || '#2563eb',
    stroke: props.stroke || '#1e40af',
    strokeWidth: props.strokeWidth || 2,
    closed: true,
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.hexagonAdded') || 'Hexagon added')
}

// Add pentagon shape
const addPentagon = (props = {}) => {
  const id = `pentagon-${Date.now()}`
  const centerX = 480
  const centerY = 270
  const size = props.size || 60
  
  // Pentagon points (5 sides) - inverted (point at bottom)
  const points = []
  for (let i = 0; i < 5; i++) {
    // Start from top and go clockwise, with point at bottom
    const angle = (Math.PI * 2 / 5) * i + Math.PI / 2  // Start from top
    points.push(Math.cos(angle) * size, Math.sin(angle) * size)
  }
  
  pentagons.value.push({
    id,
    x: centerX,
    y: centerY,
    points,
    fill: props.fill || '#2563eb',
    stroke: props.stroke || '#1e40af',
    strokeWidth: props.strokeWidth || 2,
    closed: true,
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.pentagonAdded') || 'Pentagon added')
}

// Add diamond shape
const addDiamond = (props = {}) => {
  const id = `diamond-${Date.now()}`
  const centerX = 480
  const centerY = 270
  const size = props.size || 60
  
  // Diamond points (rotated square)
  diamonds.value.push({
    id,
    x: centerX,
    y: centerY,
    points: [
      0, -size,      // Top
      size, 0,       // Right
      0, size,       // Bottom
      -size, 0       // Left
    ],
    fill: props.fill || '#2563eb',
    stroke: props.stroke || '#1e40af',
    strokeWidth: props.strokeWidth || 2,
    closed: true,
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.diamondAdded') || 'Diamond added')
}

// Add ring shape (donut) - using stroke on circle instead of filled path
const addRing = (props = {}) => {
  const id = `ring-${Date.now()}`
  const innerRadius = props.innerRadius || 35
  const outerRadius = props.outerRadius || 50
  const strokeWidth = outerRadius - innerRadius
  const radius = (innerRadius + outerRadius) / 2
  
  // Generate a single circle and use thick stroke to create ring effect
  rings.value.push({
    id,
    x: 480,
    y: 270,
    points: generateEllipsePoints(radius, radius),  // Use circle
    fill: 'transparent',  // No fill
    stroke: props.stroke || '#2563eb',
    strokeWidth: strokeWidth,
    closed: true,
    draggable: true,
    name: id,
    innerRadius,  // Store for reference
    outerRadius,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.ringAdded') || 'Ring added')
}

// Add ellipse shape (oval)
const addEllipse = (props = {}) => {
  const id = `ellipse-${Date.now()}`
  const radiusX = props.radiusX || 70  // Slightly less elliptical
  const radiusY = props.radiusY || 50  // More circular
  
  ellipses.value.push({
    id,
    x: 480,
    y: 270,
    points: generateEllipsePoints(radiusX, radiusY),
    fill: props.fill || '#2563eb',
    stroke: props.stroke || '#1e40af',
    strokeWidth: props.strokeWidth || 2,
    closed: true,
    draggable: true,
    name: id,
    radiusX,  // Store for reference
    radiusY,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.ellipseAdded') || 'Ellipse added')
}

// Add arrow shape - solid filled arrows matching prototype
const addArrow = (props = {}) => {
  const id = `arrow-${Date.now()}`
  const arrowType = props.arrowType || 'right'
  
  let points
  let fill = props.fill || '#2563eb'
  let stroke = props.stroke || '#2563eb'
  let strokeWidth = 0  // Solid filled arrows
  let closed = true
  
  switch (arrowType) {
    case 'up':
      // Up arrow: Solid filled arrow pointing up with line shaft
      points = [
        // Arrow head (triangle at top)
        -25, -20,    // Top left of arrow head
        0, -40,      // Arrow tip
        25, -20,     // Top right of arrow head
        // Shaft
        10, -20,     // Right side of shaft top
        10, 40,      // Right side of shaft bottom
        -10, 40,     // Left side of shaft bottom
        -10, -20,    // Left side of shaft top
      ]
      break
    
    case 'restart':
      // Circular arrow - counterclockwise with arrow head at top-left
      fill = undefined
      stroke = props.stroke || '#2563eb'
      strokeWidth = 4
      closed = false
      
      const segments = 64
      points = []
      // Draw circle counterclockwise, starting from bottom and going left
      // Start angle at bottom (90 degrees), go counterclockwise for about 300 degrees
      for (let i = 0; i <= segments * 0.83; i++) {
        const angle = Math.PI / 2 - (Math.PI * 2 * i / segments)  // Start at bottom, go counterclockwise
        points.push(Math.cos(angle) * 50, Math.sin(angle) * 50)
      }
      // Add arrow head at the end (top-left area) - pointing counterclockwise (along the tangent)
      const endAngle = Math.PI / 2 - (Math.PI * 2 * 0.83)  // End position
      const tipX = Math.cos(endAngle) * 50
      const tipY = Math.sin(endAngle) * 50
      // Calculate tangent direction for counterclockwise rotation
      // Tangent should point in the direction the circle is going (counterclockwise)
      // Add a slight inward bias to make arrow head point more towards the inside
      const tangentAngle = endAngle + Math.PI / 2 + 0.15  // Add 90 degrees + slight inward tilt
      const headSize = 12
      // Arrow head along the tangent (pointing in the direction of motion, slightly inward)
      points.push(
        tipX + Math.cos(tangentAngle - 0.4) * headSize, 
        tipY + Math.sin(tangentAngle - 0.4) * headSize,
        tipX, 
        tipY,
        tipX + Math.cos(tangentAngle + 0.4) * headSize, 
        tipY + Math.sin(tangentAngle + 0.4) * headSize
      )
      break
    
    case 'double-right':
      // Double right arrow - create two separate V-shaped chevrons (line style)
      // First chevron (left one)
      const firstArrowId = `arrow-${Date.now()}-1`
      arrows.value.push({
        id: firstArrowId,
        x: 450,  // Position left
        y: 270,
        points: [
          // V-shape pointing right (only outline)
          0, -30,     // Top left of V
          30, 0,      // Tip at right
          0, 30,      // Bottom left of V
        ],
        fill: undefined,  // No fill - just outline
        stroke: props.stroke || '#2563eb',
        strokeWidth: 4,
        closed: false,  // Open path for line style
        lineCap: 'round',
        lineJoin: 'round',
        draggable: true,
        name: firstArrowId,
        __zIndex: getNextZIndex()
      })
      
      // Second chevron (right one) 
      const secondArrowId = `arrow-${Date.now()}-2`
      arrows.value.push({
        id: secondArrowId,
        x: 510,  // Position right
        y: 270,
        points: [
          // V-shape pointing right (only outline)
          0, -30,     // Top left of V
          30, 0,      // Tip at right
          0, 30,      // Bottom left of V
        ],
        fill: undefined,  // No fill - just outline
        stroke: props.stroke || '#2563eb',
        strokeWidth: 4,
        closed: false,  // Open path for line style
        lineCap: 'round',
        lineJoin: 'round',
        draggable: true,
        name: secondArrowId,
        __zIndex: getNextZIndex()
      })
      
      saveToHistory()
      Message.success(t('slide.visual.messages.arrowAdded') || 'Double arrow added')
      return  // Early return since we already added to arrays and saved
      break
    
    case 'right':
    default:
      // Right arrow: Solid filled arrow pointing right with line shaft
      points = [
        // Arrow head (triangle at right)
        20, -25,     // Top left of arrow head
        40, 0,       // Arrow tip at right
        20, 25,      // Bottom left of arrow head
        // Shaft
        20, 10,      // Bottom right of shaft
        -40, 10,     // Bottom left of shaft
        -40, -10,    // Top left of shaft
        20, -10,     // Top right of shaft
      ]
      break
  }
  
  arrows.value.push({
    id,
    x: 480,
    y: 270,
    points,
    fill,
    stroke,
    strokeWidth,
    lineCap: 'round',
    lineJoin: 'round',
    closed,
    draggable: true,
    name: id,
    arrowType,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.arrowAdded') || 'Arrow added')
}

// Add parallelogram shape (skewed rectangle)
const addParallelogram = (props = {}) => {
  const id = `parallelogram-${Date.now()}`
  const centerX = 480
  const centerY = 270
  const width = props.width || 100
  const height = props.height || 60
  const skew = props.skew || 25  // Horizontal skew amount
  
  // Parallelogram points (all sides parallel, opposite sides equal)
  const points = [
    -width/2 + skew, -height/2,  // Top left (skewed right)
    width/2 + skew, -height/2,   // Top right (skewed right)
    width/2 - skew, height/2,    // Bottom right (skewed left)
    -width/2 - skew, height/2,   // Bottom left (skewed left)
  ]
  
  parallelograms.value.push({
    id,
    x: centerX,
    y: centerY,
    points,
    fill: props.fill || '#2563eb',
    stroke: props.stroke || '#1e40af',
    strokeWidth: props.strokeWidth || 2,
    closed: true,
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.parallelogramAdded') || 'Parallelogram added')
}

// Add trapezoid shape (top narrower than bottom)
const addTrapezoid = (props = {}) => {
  const id = `trapezoid-${Date.now()}`
  const centerX = 480
  const centerY = 270
  const bottomWidth = props.bottomWidth || 100
  const topWidth = props.topWidth || 60
  const height = props.height || 60
  
  // Trapezoid points (top narrower, bottom wider)
  const points = [
    -topWidth/2, -height/2,      // Top left
    topWidth/2, -height/2,       // Top right
    bottomWidth/2, height/2,     // Bottom right
    -bottomWidth/2, height/2,    // Bottom left
  ]
  
  parallelograms.value.push({  // Use same array for simplicity
    id,
    x: centerX,
    y: centerY,
    points,
    fill: props.fill || '#2563eb',
    stroke: props.stroke || '#1e40af',
    strokeWidth: props.strokeWidth || 2,
    closed: true,
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  })
  saveToHistory()
  Message.success(t('slide.visual.messages.trapezoidAdded') || 'Trapezoid added')
}

// Add decorative line
const addDecorativeLine = (props = {}) => {
  const id = `line-${Date.now()}`
  
  // Calculate default position (centered below existing content)
  let defaultY = 320
  if (texts.value.length > 0) {
    const sorted = [...texts.value].sort((a, b) => a.y - b.y)
    const lastText = sorted[sorted.length - 1]
    defaultY = lastText.y + (lastText.fontSize || 28) + 40
  }
  
  const line = {
    id,
    x: props.x !== undefined ? props.x : (960 - (props.width || 300)) / 2,
    y: props.y !== undefined ? props.y : defaultY,
    width: props.width || 300,
    height: props.height || 3,
    fill: props.fill || '#3b82f6',
    stroke: props.stroke,
    strokeWidth: props.strokeWidth || 0,
    cornerRadius: props.cornerRadius || 0,
    dash: props.dash || undefined,
    draggable: true,
    name: id,
    __zIndex: getNextZIndex()
  }
  
  // Handle gradient lines
  if (props.fillLinearGradientColorStops) {
    line.fillLinearGradientStartPoint = props.fillLinearGradientStartPoint || { x: 0, y: 0 }
    line.fillLinearGradientEndPoint = props.fillLinearGradientEndPoint || { x: line.width, y: 0 }
    line.fillLinearGradientColorStops = props.fillLinearGradientColorStops
    delete line.fill  // Remove solid fill when using gradient
  }
  
  rectangles.value.push(line)
  saveToHistory()
  Message.success(t('slide.visual.messages.lineAdded') || 'Decorative line added')
}

// Add table
const addTable = (props = {}) => {
  const id = `table-${Date.now()}`
  const rows = props.rows || 3
  const cols = props.cols || 3
  
  // Initialize cells with empty strings
  const cells = []
  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++) {
      // First row is header by default
      row.push(i === 0 ? `Header ${j + 1}` : '')
    }
    cells.push(row)
  }
  
  // Table dimensions
  const cellWidth = 120
  const cellHeight = 40
  const totalWidth = cols * cellWidth
  const totalHeight = rows * cellHeight
  
  // Center position
  const x = (SLIDE_WIDTH - totalWidth) / 2
  const y = (SLIDE_HEIGHT - totalHeight) / 2
  
  tables.value.push({
    id,
    x,
    y,
    rows,
    cols,
    cells,  // 2D array of cell content
    cellWidth,
    cellHeight,
    width: totalWidth,
    height: totalHeight,
    hasHeader: true,  // First row is header
    headerBg: '#f3f4f6',
    borderColor: '#e5e7eb',
    alternateRows: true,
    draggable: true,
    name: id,
    __type: 'table',
    __zIndex: getNextZIndex()
  })
  
  emitUpdate()
  saveToHistory()
  Message.success(t('slide.visual.messages.tableAdded'))
}

// Update table cell content
const updateTableCell = (tableId, rowIndex, colIndex, content) => {
  const table = tables.value.find(t => t.id === tableId)
  if (table && table.cells && table.cells[rowIndex]) {
    table.cells[rowIndex][colIndex] = content
    // Force update by creating a new array reference (for Vue reactivity)
    tables.value = [...tables.value]
    saveToHistory()
  }
}

// Handle table cell blur (update and clear editing flag)
const handleTableCellBlur = (tableId, rowIndex, colIndex, event) => {
  const content = event.target.innerText
  updateTableCell(tableId, rowIndex, colIndex, content)
  
  // Use setTimeout to ensure the update completes before clearing the flag
  setTimeout(() => {
    isEditingTableCell.value = false
  }, 100)
}

// Handle table cell Enter key (move to next cell)
const handleTableCellEnter = (event) => {
  event.preventDefault()
  event.target.blur() // Exit editing
}

// Update table toolbar position
const updateTableToolbarPosition = (tableId) => {
  const table = tables.value.find(t => t.id === tableId)
  if (table && editorRoot.value) {
    nextTick(() => {
      const canvasRect = editorRoot.value.getBoundingClientRect()
      const toolbarWidth = 400 // Estimated toolbar width
      const toolbarHeight = 60 // Estimated toolbar height
      const gap = 15 // Gap between toolbar and table
      
      // Calculate horizontal position (centered above table)
      const x = canvasRect.left + table.x + table.width / 2 - toolbarWidth / 2
      
      // Calculate vertical position
      // Try to place above the table, but if not enough space, place below
      const tableTop = canvasRect.top + table.y
      const spaceAbove = tableTop - canvasRect.top
      
      let y
      if (spaceAbove >= toolbarHeight + gap) {
        // Enough space above, place toolbar above table
        y = tableTop - toolbarHeight - gap
      } else {
        // Not enough space above, place below table
        y = canvasRect.top + table.y + table.height + gap
      }
      
      tableToolbarPosition.value = { x, y }
    })
  }
}

// Handle table click (supports multi-selection with Ctrl/Cmd)
const handleTableClick = (tableId, event = null) => {
  if (props.readonly || props.isThumbnail) return
  
  // Check for Ctrl/Cmd key for multi-selection
  const isCtrlOrCmd = event?.ctrlKey || event?.metaKey
  const isShift = event?.shiftKey
  
  if (isCtrlOrCmd || isShift) {
    // Multi-selection: toggle table in selection
    const newSelection = new Set(selectedIds.value)
    
    if (newSelection.has(tableId)) {
      newSelection.delete(tableId)
      console.log('[Table] Removed from multi-selection:', tableId)
    } else {
      newSelection.add(tableId)
      console.log('[Table] Added to multi-selection:', tableId)
    }
    
    selectedIds.value = newSelection
    
    // Update selectedId for single-element case
    if (newSelection.size === 1) {
      selectedId.value = Array.from(newSelection)[0]
      // Show toolbar for single table
      showTableToolbar.value = true
      updateTableToolbarPosition(tableId)
    } else if (newSelection.size === 0) {
      selectedId.value = null
      showTableToolbar.value = false
    } else {
      selectedId.value = null
      // Hide toolbar for multi-selection
      showTableToolbar.value = false
    }
    
    updateMultiTransformer()
  } else {
    // Single selection: use handleShapeClick for consistent behavior
    handleShapeClick(tableId, event)
  }
}

// Handle table mouse down (start dragging or selection)
const handleTableMouseDown = (table, event) => {
  console.log('[Table] Mouse down on table:', table.id)
  
  if (props.readonly || props.isThumbnail) return
  
  const target = event.target
  const isCell = target.tagName === 'TD' || target.tagName === 'TH'
  const isResizeHandle = target.classList.contains('resize-handle')
  
  // Don't start dragging if clicking on resize handles
  if (isResizeHandle) {
    return
  }
  
  // Check for multi-selection keys
  const isCtrlOrCmd = event.ctrlKey || event.metaKey
  const isShift = event.shiftKey
  
  // Prevent the click event from firing (we'll handle selection here)
  event.stopPropagation()
  
  // Handle selection (single or multi)
  if (isCtrlOrCmd || isShift) {
    // Multi-selection toggle
    handleTableClick(table.id, event)
  } else {
    // Single selection (only if not already selected)
    if (!selectedIds.value.has(table.id) || selectedIds.value.size > 1) {
      selectedId.value = table.id
      selectedIds.value.clear()
      selectedIds.value.add(table.id)
      
      // Show table toolbar for single selection
      showTableToolbar.value = true
      updateTableToolbarPosition(table.id)
      
      // Hide other toolbars
      showTextToolbar.value = false
      showShapeToolbar.value = false
      showImageToolbar.value = false
      showChartToolbar.value = false
      showVideoToolbar.value = false
    }
    // If clicking on an already selected table in single-selection, keep the selection
  }
  
  // For cells: allow dragging but prevent text selection
  // User can double-click to edit the cell
  if (isCell) {
    // Prevent text selection when dragging from cells
    event.preventDefault()
  }
  
  // Start dragging (supports multi-selection)
  console.log('[Table] Starting drag setup for:', table.id, 'selected count:', selectedIds.value.size)
  console.log('[Table] Table current position:', { x: table.x, y: table.y })
  console.log('[Table] All tables before drag:', tables.value.map(t => ({ id: t.id, x: t.x, y: t.y })))
  
  // Use composable for unified drag management
  startTableDrag(table.id, event.clientX, event.clientY, table.x, table.y)
  console.log('[Table] Drag state:', getDragState())
  
  // Store initial positions for all selected tables
  if (selectedIds.value.size > 1) {
    storePreviousPositions()
  }
  
  window.addEventListener('mousemove', handleTableMouseMove)
  window.addEventListener('mouseup', handleTableMouseUp)
}

// Handle table cell click (track context for add/delete operations)
const handleTableCellClick = (tableId, rowIndex, colIndex, event) => {
  // Track which cell was clicked for context-aware operations
  lastFocusedCell.value = { tableId, rowIndex, colIndex }
  console.log('[Table] Cell clicked - context set:', lastFocusedCell.value)
}

// Handle table cell double click (start editing)
const handleTableCellDblClick = (tableId, rowIndex, colIndex, event) => {
  if (props.readonly || props.isThumbnail) return
  
  event.preventDefault()
  event.stopPropagation()
  
  const table = tables.value.find(t => t.id === tableId)
  if (!table || !table.cells || !table.cells[rowIndex]) return
  
  // Track last focused cell for context-aware operations
  lastFocusedCell.value = { tableId, rowIndex, colIndex }
  console.log('[Table] Last focused cell:', lastFocusedCell.value)
  
  // Store editing info
  editingCellInfo.value = {
    tableId,
    rowIndex,
    colIndex,
    content: table.cells[rowIndex][colIndex] || ''
  }
  isEditingTableCell.value = true
  
  // Make the cell contenteditable
  const cell = event.target
  cell.contentEditable = true
  cell.focus()
  
  // Select all text in the cell
  const range = document.createRange()
  range.selectNodeContents(cell)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  
  // Add blur listener to save changes
  const handleBlur = () => {
    cell.contentEditable = false
    const newContent = cell.textContent || ''
    
    console.log('[Table Cell] Saving cell edit:', { tableId, rowIndex, colIndex, oldContent: editingCellInfo.value.content, newContent })
    
    // Update table data
    if (table.cells[rowIndex]) {
      table.cells[rowIndex][colIndex] = newContent
      console.log('[Table Cell] Updated table cells:', table.cells)
      emitUpdate()
      saveToHistory()
    }
    
    isEditingTableCell.value = false
    cell.removeEventListener('blur', handleBlur)
    cell.removeEventListener('paste', handlePaste)
    cell.removeEventListener('copy', handleCopy)
  }
  
  cell.addEventListener('blur', handleBlur)
  
  // Add paste event listener to handle pasted content
  const handlePaste = (e) => {
    console.log('[Table Cell] Paste event detected')
    
    // If we have copied content from another cell, use that instead
    if (copiedCellContent.value) {
      e.preventDefault()
      
      // Insert the copied cell content
      const selection = window.getSelection()
      if (!selection.rangeCount) return
      
      // Delete any selected content first
      selection.deleteFromDocument()
      
      // Insert the copied content
      const range = selection.getRangeAt(0)
      const textNode = document.createTextNode(copiedCellContent.value)
      range.insertNode(textNode)
      
      // Move cursor to end of inserted text
      range.setStartAfter(textNode)
      range.setEndAfter(textNode)
      selection.removeAllRanges()
      selection.addRange(range)
      
      console.log('[Table Cell] Pasted from internal clipboard:', copiedCellContent.value)
      
      // Clear the internal clipboard after use
      copiedCellContent.value = ''
      return
    }
    
    // Otherwise allow default browser paste
    console.log('[Table Cell] Using browser clipboard')
  }
  
  cell.addEventListener('paste', handlePaste)
  
  // Add copy event listener to store content in internal clipboard
  const handleCopy = (e) => {
    const selection = window.getSelection()
    const selectedText = selection.toString()
    
    if (selectedText) {
      // Store in our internal clipboard
      copiedCellContent.value = selectedText
      console.log('[Table Cell] Copied to internal clipboard:', selectedText)
      
      // Also let browser handle the copy (so system clipboard works too)
      // The browser's default copy behavior will still work
    }
  }
  
  cell.addEventListener('copy', handleCopy)
  
  // Add enter key listener
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      cell.blur()
      cell.removeEventListener('keydown', handleKeyDown)
      cell.removeEventListener('paste', handlePaste)
      cell.removeEventListener('copy', handleCopy)
    }
    if (e.key === 'Escape') {
      // Cancel editing, restore original content
      cell.textContent = editingCellInfo.value.content
      cell.blur()
      cell.removeEventListener('keydown', handleKeyDown)
      cell.removeEventListener('paste', handlePaste)
      cell.removeEventListener('copy', handleCopy)
    }
    // Allow Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X for copy/paste/cut
    if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())) {
      // Allow default browser behavior for copy/paste/cut/select-all
      console.log('[Table Cell] Allowing clipboard operation:', e.key)
      return
    }
  }
  
  cell.addEventListener('keydown', handleKeyDown)
}

// Handle table mouse move (dragging with multi-selection support)
const handleTableMouseMove = (event) => {
  if (!draggingTableId.value) return
  
  // Use composable to calculate drag delta
  const dragDelta = updateTableDrag(event.clientX, event.clientY)
  
  if (!dragDelta) return // Haven't moved threshold yet
  
  // Extract delta and new position values from composable
  const { dx, dy, newX, newY } = dragDelta
  
  if (isDraggingTable.value) {
    // Multi-selection: move all selected tables together
    if (selectedIds.value.size > 1) {
      selectedIds.value.forEach(id => {
        const table = tables.value.find(t => t.id === id)
        if (table) {
          const prevPos = previousPositions.value.get(id)
          if (prevPos) {
            // Directly mutate table properties for smooth dragging
            table.x = prevPos.x + dx
            table.y = prevPos.y + dy
          } else {
            console.warn('[Table] No previous position for multi-select table:', id)
          }
        } else {
          console.warn('[Table] Table not found in multi-select:', id)
        }
      })
    } else {
      // Single table drag - use position from composable
      const table = tables.value.find(t => t.id === draggingTableId.value)
      if (table) {
        console.log('[Table] Moving table:', {
          id: table.id,
          oldPos: { x: table.x, y: table.y },
          newPos: { x: newX, y: newY },
          delta: { dx, dy }
        })
        
        // Directly mutate table properties for smooth dragging
        table.x = newX
        table.y = newY
        
        // Update toolbar position to follow table
        if (showTableToolbar.value) {
          const canvasRect = editorRoot.value.getBoundingClientRect()
          const toolbarWidth = 400 // Estimated toolbar width
          const toolbarHeight = 60 // Estimated toolbar height
          const gap = 15 // Gap between toolbar and table
          
          // Calculate horizontal position (centered above table)
          const x = canvasRect.left + newX + table.width / 2 - toolbarWidth / 2
          
          // Calculate vertical position
          const tableTop = canvasRect.top + newY
          const spaceAbove = tableTop - canvasRect.top
          
          let y
          if (spaceAbove >= toolbarHeight + gap) {
            // Enough space above, place toolbar above table
            y = tableTop - toolbarHeight - gap
          } else {
            // Not enough space above, place below table
            y = canvasRect.top + newY + table.height + gap
          }
          
          tableToolbarPosition.value = { x, y }
        }
      } else {
        console.error('[Table] Table not found for dragging:', draggingTableId.value)
        console.error('[Table] Available tables:', tables.value.map(t => t.id))
      }
    }
  }
}

// Handle table mouse up (end dragging, preserves multi-selection)
const handleTableMouseUp = () => {
  console.log('[Table] Mouse up, drag state:', getDragState())
  
  // Use composable to end drag and check if was actually dragging
  const wasDragging = endTableDrag()
  
  if (wasDragging) {
    console.log('[Table] Drag completed for', selectedIds.value.size, 'table(s)')
    console.log('[Table] Current tables:', tables.value.map(t => ({ id: t.id, x: t.x, y: t.y })))
    emitUpdate()
    saveToHistory()
  }
  
  // Clear previous positions
  previousPositions.value.clear()
  
  // Preserve multi-selection state
  if (selectedIds.value.size > 1) {
    nextTick(() => {
      updateMultiTransformer()
    })
  }
  
  window.removeEventListener('mousemove', handleTableMouseMove)
  window.removeEventListener('mouseup', handleTableMouseUp)
}

// Handle table resize start
const handleTableResizeStart = (table, handle, event) => {
  event.preventDefault()
  event.stopPropagation()
  
  resizingTableId.value = table.id
  tableResizeHandle.value = handle
  tableResizeStart.value = { x: event.clientX, y: event.clientY }
  tableInitialBounds.value = {
    x: table.x,
    y: table.y,
    width: table.width,
    height: table.height,
    rows: table.rows,
    cols: table.cols
  }
  isResizingTable.value = false
  
  window.addEventListener('mousemove', handleTableResizeMove)
  window.addEventListener('mouseup', handleTableResizeEnd)
}

// Handle table resize move
const handleTableResizeMove = (event) => {
  if (!resizingTableId.value) return
  
  const dx = event.clientX - tableResizeStart.value.x
  const dy = event.clientY - tableResizeStart.value.y
  
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    isResizingTable.value = true
  }
  
  if (isResizingTable.value) {
    const table = tables.value.find(t => t.id === resizingTableId.value)
    if (!table) return
    
    const handle = tableResizeHandle.value
    const initial = tableInitialBounds.value
    
    // Calculate new dimensions based on handle
    let newWidth = initial.width
    let newHeight = initial.height
    let newX = initial.x
    let newY = initial.y
    
    // Horizontal resize
    if (handle.includes('right')) {
      newWidth = Math.max(100, initial.width + dx)
    } else if (handle.includes('left')) {
      newWidth = Math.max(100, initial.width - dx)
      newX = initial.x + dx
      if (newWidth === 100) newX = initial.x + initial.width - 100
    }
    
    // Vertical resize
    if (handle.includes('bottom')) {
      newHeight = Math.max(60, initial.height + dy)
    } else if (handle.includes('top')) {
      newHeight = Math.max(60, initial.height - dy)
      newY = initial.y + dy
      if (newHeight === 60) newY = initial.y + initial.height - 60
    }
    
    // Update table
    table.width = newWidth
    table.height = newHeight
    table.x = newX
    table.y = newY
    
    // Recalculate cell dimensions
    table.cellWidth = newWidth / table.cols
    table.cellHeight = newHeight / table.rows
    
    // Update toolbar position to follow table
    if (showTableToolbar.value) {
      const canvasRect = editorRoot.value.getBoundingClientRect()
      const toolbarWidth = 400 // Estimated toolbar width
      tableToolbarPosition.value = {
        x: canvasRect.left + table.x + table.width / 2 - toolbarWidth / 2,  // Center horizontally
        y: canvasRect.top + table.y - 100  // 60px above table
      }
    }
  }
}

// Handle table resize end
const handleTableResizeEnd = () => {
  if (isResizingTable.value) {
    emitUpdate()
    saveToHistory()
  }
  
  resizingTableId.value = null
  tableResizeHandle.value = null
  isResizingTable.value = false
  
  window.removeEventListener('mousemove', handleTableResizeMove)
  window.removeEventListener('mouseup', handleTableResizeEnd)
}

// Add table row (after the last focused row, or at the end if no cell is focused)
const addTableRow = () => {
  const table = tables.value.find(t => t.id === selectedId.value)
  if (!table || !table.cells) return
  
  // Determine insert position
  let insertIndex = table.rows // Default: append at end
  if (lastFocusedCell.value.tableId === table.id && lastFocusedCell.value.rowIndex !== null) {
    insertIndex = lastFocusedCell.value.rowIndex + 1 // Insert after focused row
    console.log('[Table] Adding row after row', lastFocusedCell.value.rowIndex)
  }
  
  // Create new empty row
  const newRow = Array(table.cols).fill('')
  table.cells.splice(insertIndex, 0, newRow)
  table.rows++
  
  // Update table height
  table.height = table.rows * table.cellHeight
  
  emitUpdate()
  saveToHistory()
  Message.success(t('slide.visual.messages.rowAdded'))
}

// Delete table row (the last focused row, or last row if no cell is focused)
const deleteTableRow = () => {
  const table = tables.value.find(t => t.id === selectedId.value)
  if (!table || !table.cells || table.rows <= 1) {
    Message.warning(t('slide.visual.messages.cannotDeleteRow'))
    return
  }
  
  // Determine delete position
  let deleteIndex = table.rows - 1 // Default: delete last row
  if (lastFocusedCell.value.tableId === table.id && lastFocusedCell.value.rowIndex !== null) {
    deleteIndex = lastFocusedCell.value.rowIndex // Delete focused row
    console.log('[Table] Deleting row', deleteIndex)
  }
  
  // Remove row
  table.cells.splice(deleteIndex, 1)
  table.rows--
  
  // Update table height
  table.height = table.rows * table.cellHeight
  
  // Clear last focused cell if it was in the deleted row
  if (lastFocusedCell.value.rowIndex === deleteIndex) {
    lastFocusedCell.value = { tableId: null, rowIndex: null, colIndex: null }
  } else if (lastFocusedCell.value.rowIndex > deleteIndex) {
    // Adjust row index if focused cell is after deleted row
    lastFocusedCell.value.rowIndex--
  }
  
  emitUpdate()
  saveToHistory()
  Message.success(t('slide.visual.messages.rowDeleted'))
}

// Add table column (after the last focused column, or at the end if no cell is focused)
const addTableColumn = () => {
  const table = tables.value.find(t => t.id === selectedId.value)
  if (!table || !table.cells) return
  
  // Determine insert position
  let insertIndex = table.cols // Default: append at end
  if (lastFocusedCell.value.tableId === table.id && lastFocusedCell.value.colIndex !== null) {
    insertIndex = lastFocusedCell.value.colIndex + 1 // Insert after focused column
    console.log('[Table] Adding column after column', lastFocusedCell.value.colIndex)
  }
  
  // Add empty cell to each row at the specified position
  table.cells.forEach(row => {
    row.splice(insertIndex, 0, '')
  })
  table.cols++
  
  // Recalculate cell width and update table width
  table.cellWidth = table.width / table.cols
  
  emitUpdate()
  saveToHistory()
  Message.success(t('slide.visual.messages.columnAdded'))
}

// Delete table column (the last focused column, or last column if no cell is focused)
const deleteTableColumn = () => {
  const table = tables.value.find(t => t.id === selectedId.value)
  if (!table || !table.cells || table.cols <= 1) {
    Message.warning(t('slide.visual.messages.cannotDeleteColumn'))
    return
  }
  
  // Determine delete position
  let deleteIndex = table.cols - 1 // Default: delete last column
  if (lastFocusedCell.value.tableId === table.id && lastFocusedCell.value.colIndex !== null) {
    deleteIndex = lastFocusedCell.value.colIndex // Delete focused column
    console.log('[Table] Deleting column', deleteIndex)
  }
  
  // Remove cell from each row at the specified position
  table.cells.forEach(row => {
    row.splice(deleteIndex, 1)
  })
  table.cols--
  
  // Recalculate cell width
  table.cellWidth = table.width / table.cols
  
  // Clear last focused cell if it was in the deleted column
  if (lastFocusedCell.value.colIndex === deleteIndex) {
    lastFocusedCell.value = { tableId: null, rowIndex: null, colIndex: null }
  } else if (lastFocusedCell.value.colIndex > deleteIndex) {
    // Adjust column index if focused cell is after deleted column
    lastFocusedCell.value.colIndex--
  }
  
  emitUpdate()
  saveToHistory()
  Message.success(t('slide.visual.messages.columnDeleted'))
}

// Clear canvas
// const clearCanvas = () => {
//   texts.value = []
//   images.value = []
//   rectangles.value = []
//   circles.value = []
//   links.value = []
//   triangles.value = []
//   stars.value = []
//   selectedId.value = null
// }

// Delete selected component
const deleteSelected = () => {
  if (!selectedId.value) return
  
  console.log('[VisualEditor] Deleting component:', selectedId.value)
  
  saveToHistory()
  
  texts.value = texts.value.filter(t => t.id !== selectedId.value)
  images.value = images.value.filter(i => i.id !== selectedId.value)
  rectangles.value = rectangles.value.filter(r => r.id !== selectedId.value)
  circles.value = circles.value.filter(c => c.id !== selectedId.value)
  links.value = links.value.filter(l => l.id !== selectedId.value)
  triangles.value = triangles.value.filter(t => t.id !== selectedId.value)
  stars.value = stars.value.filter(s => s.id !== selectedId.value)
  hexagons.value = hexagons.value.filter(h => h.id !== selectedId.value)
  pentagons.value = pentagons.value.filter(p => p.id !== selectedId.value)
  diamonds.value = diamonds.value.filter(d => d.id !== selectedId.value)
  rings.value = rings.value.filter(r => r.id !== selectedId.value)
  ellipses.value = ellipses.value.filter(e => e.id !== selectedId.value)
  arrows.value = arrows.value.filter(a => a.id !== selectedId.value)
  parallelograms.value = parallelograms.value.filter(p => p.id !== selectedId.value)
  charts.value = charts.value.filter(c => c.id !== selectedId.value)
  videos.value = videos.value.filter(v => v.id !== selectedId.value)
  tables.value = tables.value.filter(t => t.id !== selectedId.value)
  
  console.log('[VisualEditor] After deletion - charts:', charts.value.length)
  
  selectedId.value = null
  
  // Hide all floating toolbars after deletion
  showTextToolbar.value = false
  showShapeToolbar.value = false
  showImageToolbar.value = false
  showChartToolbar.value = false
  showVideoToolbar.value = false
  showTableToolbar.value = false
  
  updateTransformer()
  emitUpdate()
  Message.success(t('slide.visual.messages.componentDeleted'))
}

// Layer management functions (using global z-index)
const findComponent = (id) => {
  return texts.value.find(t => t.id === id) ||
         images.value.find(i => i.id === id) ||
         rectangles.value.find(r => r.id === id) ||
         circles.value.find(c => c.id === id) ||
         links.value.find(l => l.id === id) ||
         triangles.value.find(t => t.id === id) ||
         stars.value.find(s => s.id === id) ||
         hexagons.value.find(h => h.id === id) ||
         pentagons.value.find(p => p.id === id) ||
         diamonds.value.find(d => d.id === id) ||
         rings.value.find(r => r.id === id) ||
         ellipses.value.find(e => e.id === id) ||
         arrows.value.find(a => a.id === id) ||
         parallelograms.value.find(p => p.id === id) ||
         charts.value.find(c => c.id === id) ||
         videos.value.find(v => v.id === id) ||
         tables.value.find(t => t.id === id)
}

const moveLayerUp = () => {
  if (!selectedId.value) return
  
  saveToHistory()
  
  const comp = findComponent(selectedId.value)
  if (!comp) return
  
  // const currentZ = comp.__zIndex || 0
  const allComps = allComponents.value
  const currentIndex = allComps.findIndex(c => c.id === selectedId.value)
  
  if (currentIndex < allComps.length - 1) {
    const nextZ = allComps[currentIndex + 1].__zIndex || 0
    comp.__zIndex = nextZ + 1
    saveToHistory()
    emitUpdate()
    Message.success(t('slide.visual.messages.movedForward'))
  }
}

const moveLayerDown = () => {
  if (!selectedId.value) return
  
  saveToHistory()
  
  const comp = findComponent(selectedId.value)
  if (!comp) return
  
  // const currentZ = comp.__zIndex || 0
  const allComps = allComponents.value
  const currentIndex = allComps.findIndex(c => c.id === selectedId.value)
  
  if (currentIndex > 0) {
    const prevZ = allComps[currentIndex - 1].__zIndex || 0
    comp.__zIndex = prevZ - 1
    emitUpdate()
    Message.success(t('slide.visual.messages.movedBackward'))
  }
}

const moveLayerToTop = () => {
  if (!selectedId.value) return
  
  saveToHistory()
  
  const comp = findComponent(selectedId.value)
  if (!comp) return
  
  const allComps = allComponents.value
  const maxZ = Math.max(...allComps.map(c => c.__zIndex || 0), 0)
  comp.__zIndex = maxZ + 1
  emitUpdate()
  Message.success(t('slide.visual.messages.broughtToFront'))
}

const moveLayerToBottom = () => {
  if (!selectedId.value) return
  
  saveToHistory()
  
  const comp = findComponent(selectedId.value)
  if (!comp) return
  
  const allComps = allComponents.value
  const minZ = Math.min(...allComps.map(c => c.__zIndex || 0), 0)
  comp.__zIndex = minZ - 1
  emitUpdate()
  Message.success(t('slide.visual.messages.sentToBack'))
}

// Handle stage click (deselect or start marquee selection)
const handleStageMouseDown = (e) => {
  if (props.readonly) return
  
  const clickedOnEmpty = e.target === e.target.getStage()
  
  if (clickedOnEmpty) {
    const isCtrlOrCmd = e.evt.ctrlKey || e.evt.metaKey
    
    if (!isCtrlOrCmd) {
      // Start marquee selection if not holding Ctrl/Cmd
      const stage = e.target.getStage()
      const pointerPos = stage.getPointerPosition()
      
      selectionStartPos.value = { x: pointerPos.x, y: pointerPos.y }
      selectionRect.value = {
        x: pointerPos.x,
        y: pointerPos.y,
        width: 0,
        height: 0
      }
      isMultiSelecting.value = true
      
      console.log('[VisualEditor] Starting marquee selection at:', selectionStartPos.value)
      
      // Clear previous selection
      selectedId.value = null
      selectedIds.value.clear()
      showTextToolbar.value = false
      showShapeToolbar.value = false
      showImageToolbar.value = false
      showChartToolbar.value = false
      showVideoToolbar.value = false
      showTableToolbar.value = false
      updateTransformer()
    }
  }
}

// Handle stage mouse move (marquee selection)
const handleStageMouseMove = (e) => {
  if (!isMultiSelecting.value) return
  
  const stage = e.target.getStage()
  const pointerPos = stage.getPointerPosition()
  
  // Update selection rectangle dimensions
  const startX = selectionStartPos.value.x
  const startY = selectionStartPos.value.y
  const width = pointerPos.x - startX
  const height = pointerPos.y - startY
  
  // Normalize rectangle (handle negative width/height for reverse dragging)
  selectionRect.value = {
    x: width < 0 ? pointerPos.x : startX,
    y: height < 0 ? pointerPos.y : startY,
    width: Math.abs(width),
    height: Math.abs(height)
  }
}

// Handle stage mouse up (finalize marquee selection)
const handleStageMouseUp = (e) => {
  if (!isMultiSelecting.value) return
  
  // Find all elements within selection rectangle
  if (selectionRect.value) {
    const rect = selectionRect.value
    const selected = new Set()
    
    // Check all components for intersection with selection rect
    allComponents.value.forEach(comp => {
      if (isElementInRect(comp, rect)) {
        selected.add(comp.id)
      }
    })
    
    console.log('[VisualEditor] Marquee selection completed:', selected.size, 'elements selected')
    
    // Update selection
    if (selected.size > 0) {
      selectedIds.value = selected
      // If only one element selected, also set selectedId for toolbar compatibility
      if (selected.size === 1) {
        selectedId.value = Array.from(selected)[0]
      } else {
        selectedId.value = null
      }
      updateMultiTransformer()
    }
  }
  
  // Reset marquee selection state
  isMultiSelecting.value = false
  selectionRect.value = null
}

// Helper: Check if element intersects with selection rectangle
const isElementInRect = (comp, rect) => {
  // Get element bounds
  let elemX = comp.x || 0
  let elemY = comp.y || 0
  let elemWidth = comp.width || 0
  let elemHeight = comp.height || 0
  
  // Handle special cases
  if (comp.__type === 'circle') {
    const radius = comp.radius || 50
    elemWidth = radius * 2
    elemHeight = radius * 2
    elemX = elemX - radius
    elemY = elemY - radius
  } else if (comp.__type === 'text' || comp.__type === 'link') {
    elemWidth = getTextWidth(comp)
    elemHeight = getTextHeight(comp)
  }
  
  // Check for intersection (AABB collision detection)
  const intersects = (
    elemX < rect.x + rect.width &&
    elemX + elemWidth > rect.x &&
    elemY < rect.y + rect.height &&
    elemY + elemHeight > rect.y
  )
  
  return intersects
}

// Handle drag end
// Handle drag move (real-time position update with multi-selection support)
const handleDragMove = (e) => {
  if (props.readonly) return
  
  // Use composable to track Konva element dragging
  startKonvaDrag()
  
  const id = e.target.name()
  const node = e.target
  
  // Multi-selection group drag
  if (selectedIds.value.size > 1 && selectedIds.value.has(id)) {
    // Calculate drag delta
    const prevPos = previousPositions.value.get(id)
    if (!prevPos) {
      // First drag move - store initial positions
      storePreviousPositions()
      return
    }
    
    const dx = node.x() - prevPos.x
    const dy = node.y() - prevPos.y
    
    // Move all selected elements by the same delta
    selectedIds.value.forEach(selectedId => {
      if (selectedId === id) return // Skip the dragged element (already moved by Konva)
      
      const updatePosition = (items) => {
        const item = items.find(i => i.id === selectedId)
        if (item) {
          item.x += dx
          item.y += dy
        }
      }
      
      updatePosition(texts.value)
      updatePosition(links.value)
      updatePosition(images.value)
      updatePosition(rectangles.value)
      updatePosition(circles.value)
      updatePosition(triangles.value)
      updatePosition(stars.value)
      updatePosition(tables.value)
      updatePosition(charts.value)
      updatePosition(videos.value)
    })
    
    // Update previous positions
    storePreviousPositions()
  }
  
  // Update position in real-time during drag
  const updatePosition = (items) => {
    const item = items.find(i => i.id === id)
    if (item) {
      item.x = node.x()
      item.y = node.y()
    }
  }
  
  updatePosition(texts.value)
  updatePosition(links.value)
  updatePosition(images.value)
  updatePosition(rectangles.value)
  updatePosition(circles.value)
  updatePosition(triangles.value)
  updatePosition(stars.value)
  updatePosition(tables.value)
  updatePosition(charts.value)
  updatePosition(videos.value)
}

// Store current positions of all selected elements
const storePreviousPositions = () => {
  const positions = new Map()
  
  selectedIds.value.forEach(id => {
    const comp = findComponent(id)
    if (comp) {
      positions.set(id, { x: comp.x, y: comp.y })
    }
  })
  
  previousPositions.value = positions
}

// Handle drag end (preserves multi-selection)
const handleDragEnd = (e) => {
  if (props.readonly) return
  const id = e.target.name()
  const node = e.target
  
  // Use composable to end Konva drag
  endKonvaDrag()
  
  // Update position in data
  const updatePosition = (items) => {
    const item = items.find(i => i.id === id)
    if (item) {
      item.x = node.x()
      item.y = node.y()
    }
  }
  
  updatePosition(texts.value)
  updatePosition(images.value)
  updatePosition(rectangles.value)
  updatePosition(circles.value)
  updatePosition(links.value)
  updatePosition(triangles.value)
  updatePosition(stars.value)
  updatePosition(tables.value)
  updatePosition(charts.value)
  updatePosition(videos.value)
  
  // Preserve multi-selection or set single selection
  if (selectedIds.value.size > 1) {
    // Keep multi-selection active
    nextTick(() => {
      updateMultiTransformer()
    })
  } else {
    // Single element drag - select the dragged object
    selectedId.value = id
    nextTick(() => {
      updateTransformer()
    })
  }
  
  // Clear previous positions
  previousPositions.value.clear()
}

// Handle transform end
const handleTransformEnd = (e) => {
  if (props.readonly) return
  const id = e.target.name()
  const node = e.target
  
  // Check if it's a text node
  const isTextNode = texts.value.some(t => t.id === id)
  const isLinkNode = links.value.some(l => l.id === id)
  const isTableNode = tables.value.some(t => t.id === id)
  
  // Update transform in data
  const updateTransform = (items) => {
    const item = items.find(i => i.id === id)
    if (item) {
      item.x = node.x()
      item.y = node.y()
      item.rotation = node.rotation()
      
      // Handle text nodes and link nodes - update container dimensions
      if (isTextNode || isLinkNode) {
        // Update container width and height
        if (node.width) {
          item.width = node.width() * node.scaleX()
        }
        if (node.height) {
          item.height = node.height() * node.scaleY()
        }
        // Reset scales
        node.scaleX(1)
        node.scaleY(1)
      }
      // Handle tables - update dimensions and cell sizes
      else if (isTableNode && item.rows !== undefined && item.cols !== undefined) {
        const newWidth = node.width() * node.scaleX()
        const newHeight = node.height() * node.scaleY()
        item.width = newWidth
        item.height = newHeight
        item.cellWidth = newWidth / item.cols
        item.cellHeight = newHeight / item.rows
        node.scaleX(1)
        node.scaleY(1)
      }
      // Handle rectangles (excluding text containers)
      else if (item.width !== undefined && item.height !== undefined && item.radius === undefined && !item.points && !item.innerRadius) {
        item.width = node.width() * node.scaleX()
        item.height = node.height() * node.scaleY()
        node.scaleX(1)
        node.scaleY(1)
      }
      // Handle circles
      else if (item.radius !== undefined && item.innerRadius === undefined) {
        item.radius = node.radius() * node.scaleX()
        node.scaleX(1)
        node.scaleY(1)
      }
      // Handle triangles (have points array)
      else if (item.points !== undefined) {
        // Scale the points array
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        item.points = item.points.map((coord, index) => {
          return index % 2 === 0 ? coord * scaleX : coord * scaleY
        })
        node.scaleX(1)
        node.scaleY(1)
      }
      // Handle stars (have innerRadius and outerRadius)
      else if (item.innerRadius !== undefined && item.outerRadius !== undefined) {
        const scale = (node.scaleX() + node.scaleY()) / 2 // Average scale
        item.innerRadius = item.innerRadius * scale
        item.outerRadius = item.outerRadius * scale
        node.scaleX(1)
        node.scaleY(1)
      }
      // Handle images and other shapes
      else {
        item.scaleX = node.scaleX()
        item.scaleY = node.scaleY()
      }
    }
  }
  
  updateTransform(texts.value)
  updateTransform(images.value)
  updateTransform(rectangles.value)
  updateTransform(circles.value)
  updateTransform(links.value)
  updateTransform(triangles.value)
  updateTransform(stars.value)
  updateTransform(tables.value)
}

// Handle text double-click (edit text inline)
const handleTextDoubleClick = (id) => {
  console.log('[VisualEditor] handleTextDoubleClick triggered for id:', id)
  if (props.readonly) {
    console.log('[VisualEditor] Readonly mode, ignoring double click')
    return
  }
  const text = texts.value.find(t => t.id === id)
  console.log('[VisualEditor] Found text:', text)
  if (!text) {
    // Check if it's actually a link but misidentified or passed here
    const link = links.value.find(l => l.id === id)
    if (link) {
      console.log('[VisualEditor] It is a link! Redirecting to handleLinkDoubleClick')
      handleLinkDoubleClick(id)
      return
    }
    return
  }
  
  editingTextId.value = id
  editingTextContent.value = text.text
  editingFontSize.value = text.fontSize || 24
  isEditingText.value = true
  
  // Auto-focus the input after rendering
  nextTick(() => {
    if (inlineTextInput.value) {
      inlineTextInput.value.focus()
      inlineTextInput.value.select() // Select all text for easy editing
    }
  })
}

// Handle link double click - edit URL
const handleLinkDoubleClick = async (id) => {
  console.log('[VisualEditor] handleLinkDoubleClick triggered for id:', id)
  if (props.readonly) {
    console.log('[VisualEditor] Readonly mode, ignoring double click')
    return
  }
  const link = links.value.find(l => l.id === id)
  console.log('[VisualEditor] Found link:', link)
  if (!link) return
  
  // Open link editing dialog
  editingLinkId.value = id
  editingLinkUrl.value = link.url || 'https://example.com'
  editingLinkText.value = link.text || 'Link'
  isEditingLink.value = true
  console.log('[VisualEditor] isEditingLink set to true')
}

// Open link in new tab (unused but kept for reference if needed, commented out to satisfy linter)
// const openLink = (url) => {
//   if (url && url !== '#') {
//     window.open(url, '_blank')
//     Message.info(t('slide.visual.messages.openingLink'))
//   }
// }

// Save link edit
const saveLinkEdit = () => {
  const link = links.value.find(l => l.id === editingLinkId.value)
  if (link) {
    link.url = editingLinkUrl.value || 'https://example.com'
    link.text = editingLinkText.value || 'Link'
    Message.success(t('slide.visual.messages.linkUpdated'))
    saveToHistory()
  }
  isEditingLink.value = false
}

// Cancel link edit
const cancelLinkEdit = () => {
  isEditingLink.value = false
  editingLinkId.value = null
  editingLinkUrl.value = ''
  editingLinkText.value = ''
}

// Handle edit link from toolbar
const handleEditLink = () => {
  if (selectedId.value && selectedId.value.startsWith('link-')) {
    handleLinkDoubleClick(selectedId.value)
  }
}

// Handle video replace URL from toolbar (wrapper for composable)
const handleVideoReplaceUrl = () => {
  videoReplaceUrl(selectedId.value)
}

// Save text edit
const saveTextEdit = () => {
  const text = texts.value.find(t => t.id === editingTextId.value)
  if (text) {
    text.text = editingTextContent.value
    text.fontSize = editingFontSize.value
  }
  isEditingText.value = false
  editingTextId.value = null
  Message.success(t('slide.visual.messages.textUpdated'))
}

// Cancel text edit
const cancelTextEdit = () => {
  isEditingText.value = false
  editingTextId.value = null
}

// Update transformer (supports single and multi-selection)
const updateTransformer = () => {
  if (!transformer.value || !layer.value) return
  
  const transformerNode = transformer.value.getNode()
  const stage = transformerNode.getStage()
  
  // Handle multi-selection
  if (selectedIds.value.size > 0) {
    const selectedNodes = []
    selectedIds.value.forEach(id => {
      const node = stage.findOne(`.${id}`)
      if (node) selectedNodes.push(node)
    })
    
    if (selectedNodes.length > 0) {
      transformerNode.nodes(selectedNodes)
      console.log('[VisualEditor] Multi-transformer updated for:', selectedNodes.length, 'elements')
      return
    }
  }
  
  // Handle single selection (legacy behavior)
  if (!selectedId.value) {
    transformerNode.nodes([])
    return
  }
  
  // Skip transformer for HTML overlay elements (tables, charts, videos)
  // These elements have their own resize handles and don't use Konva transformer
  if (selectedId.value.startsWith('table-') || 
      selectedId.value.startsWith('chart-') || 
      selectedId.value.startsWith('video-')) {
    transformerNode.nodes([])
    console.log('[VisualEditor] Skipping transformer for HTML overlay element:', selectedId.value)
    return
  }
  
  const selectedNode = stage.findOne(`.${selectedId.value}`)
  if (selectedNode) {
    transformerNode.nodes([selectedNode])
    console.log('[VisualEditor] Transformer updated for:', selectedId.value, 'node found:', !!selectedNode)
  } else {
    console.warn('[VisualEditor] Could not find node for transformer:', selectedId.value)
    transformerNode.nodes([])
  }
}

// Multi-element transformer (dedicated function for clarity)
const updateMultiTransformer = () => {
  if (!transformer.value || !layer.value) return
  
  const transformerNode = transformer.value.getNode()
  const stage = transformerNode.getStage()
  
  if (selectedIds.value.size === 0) {
    transformerNode.nodes([])
    return
  }
  
  const selectedNodes = []
  selectedIds.value.forEach(id => {
    const node = stage.findOne(`.${id}`)
    if (node) selectedNodes.push(node)
  })
  
  transformerNode.nodes(selectedNodes)
  console.log('[VisualEditor] Multi-transformer updated for:', selectedNodes.length, 'elements')
}

// Handle shape click (supports Ctrl/Cmd+Click for multi-selection)
const handleShapeClick = (id, e) => {
  if (props.readonly) return
  
  const isCtrlOrCmd = e?.evt?.ctrlKey || e?.evt?.metaKey
  const isShift = e?.evt?.shiftKey
  
  // Multi-selection logic
  if (isCtrlOrCmd || isShift) {
    // Toggle element in multi-selection
    const newSelection = new Set(selectedIds.value)
    
    if (newSelection.has(id)) {
      // Remove from selection
      newSelection.delete(id)
      console.log('[VisualEditor] Removed from multi-selection:', id)
    } else {
      // Add to selection
      newSelection.add(id)
      console.log('[VisualEditor] Added to multi-selection:', id)
    }
    
    selectedIds.value = newSelection
    
    // Update selectedId for single-element case
    if (newSelection.size === 1) {
      selectedId.value = Array.from(newSelection)[0]
    } else if (newSelection.size === 0) {
      selectedId.value = null
    } else {
      selectedId.value = null // Multiple elements selected
    }
    
    updateMultiTransformer()
    
    // Hide toolbars for multi-selection (show multi-selection toolbar instead)
    if (newSelection.size > 1) {
      showTextToolbar.value = false
      showShapeToolbar.value = false
      showImageToolbar.value = false
      showChartToolbar.value = false
      showVideoToolbar.value = false
      showTableToolbar.value = false
    }
    
    return
  }
  
  // Single selection (clear multi-selection)
  selectedIds.value.clear()
  selectedId.value = id
  
  // Check what type of component is selected
  const text = texts.value.find(t => t.id === id)
  const link = links.value.find(l => l.id === id)
  const rect = rectangles.value.find(r => r.id === id)
  const circle = circles.value.find(c => c.id === id)
  const triangle = triangles.value.find(t => t.id === id)
  const star = stars.value.find(s => s.id === id)
  const image = images.value.find(i => i.id === id)
  const chart = charts.value.find(c => c.id === id)
  const video = videos.value.find(v => v.id === id)
  const table = tables.value.find(t => t.id === id)
  
  // Get canvas offset (convert canvas coordinates to page coordinates)
  // vue-konva: stage.value is the component, getNode() gets the Konva Stage instance
  let canvasRect = { left: 0, top: 0 }
  if (stage.value) {
    try {
      const stageNode = stage.value.getNode()
      const stageContainer = stageNode?.container()
      if (stageContainer) {
        canvasRect = stageContainer.getBoundingClientRect()
      }
    } catch (e) {
      console.warn('[VisualEditor] Failed to get canvas position:', e)
    }
  }
  
  console.log('[VisualEditor] Canvas position:', canvasRect)
  
  // Show appropriate toolbar based on selection
  if (text || link) {
    // Text or Link selected - show text toolbar
    showTextToolbar.value = true
    showShapeToolbar.value = false
    showImageToolbar.value = false
    
    const textOrLink = text || link
    // Calculate toolbar position: center horizontally, position based on text location
    const textWidth = getTextWidth(textOrLink)
    const textHeight = getTextHeight(textOrLink)
    
    // Position toolbar below text if near top, otherwise above
    const toolbarY = textOrLink.y < 80 
      ? textOrLink.y + textHeight + 20  // Below text (when near top) - increased spacing
      : textOrLink.y - 80                // Above text (normal case) - increased spacing
    
    // Convert canvas coordinates to page coordinates
    textToolbarPosition.value = {
      x: canvasRect.left + textOrLink.x + textWidth / 2 - 200, // Add canvas offset
      y: canvasRect.top + toolbarY // Add canvas offset
    }
  } else if (rect || circle || triangle || star) {
    // Shape selected - show shape toolbar
    showTextToolbar.value = false
    showShapeToolbar.value = true
    showImageToolbar.value = false
    const shape = rect || circle || triangle || star
    // Calculate shape dimensions for positioning
    const shapeWidth = shape.width || shape.radius * 2 || shape.outerRadius * 2 || 100
    const shapeHeight = shape.height || shape.radius * 2 || shape.outerRadius * 2 || 100
    shapeToolbarPosition.value = {
      x: canvasRect.left + shape.x + shapeWidth / 2 - 120, // Add canvas offset
      y: canvasRect.top + shape.y + shapeHeight  // Add canvas offset - increased spacing
    }
  } else if (image) {
    // Image selected - show image toolbar
    showTextToolbar.value = false
    showShapeToolbar.value = false
    showImageToolbar.value = true
    showChartToolbar.value = false
    imageToolbarPosition.value = {
      x: canvasRect.left + image.x + (image.width || 150) / 2 - 150, // Add canvas offset
      y: canvasRect.top + image.y - 90 // Add canvas offset - increased spacing
    }
  } else if (chart) {
    // Chart selected - show chart toolbar
    console.log('[VisualEditor] Chart found in handleShapeClick:', chart)
    showTextToolbar.value = false
    showShapeToolbar.value = false
    showImageToolbar.value = false
    showChartToolbar.value = true
    console.log('[VisualEditor] showChartToolbar set to:', showChartToolbar.value)
    chartToolbarPosition.value = {
      x: canvasRect.left + chart.x + (chart.width || 600) / 2 - 200, // Add canvas offset
      y: canvasRect.top + chart.y - 70 // Add canvas offset - increased spacing
    }
    console.log('[VisualEditor] chartToolbarPosition:', chartToolbarPosition.value)
  } else if (video) {
    // Video selected - show video toolbar
    console.log('[VisualEditor] Video found in handleShapeClick:', video)
    showTextToolbar.value = false
    showShapeToolbar.value = false
    showImageToolbar.value = false
    showChartToolbar.value = false
    showVideoToolbar.value = true
    showTableToolbar.value = false
    console.log('[VisualEditor] showVideoToolbar set to:', showVideoToolbar.value)
    videoToolbarPosition.value = {
      x: canvasRect.left + video.x + (video.width || 480) / 2 - 150,
      y: canvasRect.top + video.y - 70
    }
    console.log('[VisualEditor] videoToolbarPosition:', videoToolbarPosition.value)
  } else if (table) {
    // Table selected - show table toolbar
    console.log('[VisualEditor] Table found in handleShapeClick:', table)
    showTextToolbar.value = false
    showShapeToolbar.value = false
    showImageToolbar.value = false
    showChartToolbar.value = false
    showVideoToolbar.value = false
    showTableToolbar.value = true
    // Position toolbar relative to table's top-center
    const toolbarWidth = 400 // Estimated toolbar width
    tableToolbarPosition.value = {
      x: canvasRect.left + table.x + table.width / 2 - toolbarWidth / 2,  // Center horizontally above table
      y: canvasRect.top + table.y - 100  // 60px above table top edge
    }
    console.log('[VisualEditor] tableToolbarPosition:', tableToolbarPosition.value)
  } else {
    // Unknown type - hide all toolbars
    console.log('[VisualEditor] No matching component found for id:', id)
    showTextToolbar.value = false
    showShapeToolbar.value = false
    showImageToolbar.value = false
    showChartToolbar.value = false
    showVideoToolbar.value = false
    showTableToolbar.value = false
  }
  
  // Use double nextTick to ensure Konva has rendered the node before transformer update
  nextTick(() => {
    nextTick(() => {
      updateTransformer()
    })
  })
}

// Handle add component from right toolbar
const handleAddComponent = (comp) => {
  console.log('Adding component:', comp)
  
  if (comp.type === 'text') {
    // Handle different text types
    if (comp.id === 'heading1') {
      addText({ fontSize: 48, fontWeight: '700', text: 'Heading 1' })
    } else if (comp.id === 'heading2') {
      addText({ fontSize: 36, fontWeight: '700', text: 'Heading 2' })
    } else if (comp.id === 'heading3') {
      addText({ fontSize: 28, fontWeight: '700', text: 'Heading 3' })
    } else if (comp.id === 'paragraph') {
      addText({ fontSize: 18, text: 'Click to edit paragraph text' })
    } else if (comp.id === 'bulletList') {
      addText({ fontSize: 18, text: '• List item 1\n• List item 2\n• List item 3' })
    } else if (comp.id === 'numberedList') {
      addText({ fontSize: 18, text: '1. List item 1\n2. List item 2\n3. List item 3' })
    } else {
      addText(comp.props || {})
    }
  } else if (comp.type === 'image') {
    // Check if image URL is provided (from API search)
    if (comp.props && comp.props.src) {
      // Direct insert for images from API (GIPHY, Pexels, etc.)
      addImageFromUrl({
        src: comp.props.src,
        width: comp.props.width,
        height: comp.props.height,
        title: comp.props.title,
        photographer: comp.props.photographer,
        source: comp.props.source
      })
    } else {
      // Trigger file input for local image upload
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          handleImageUpload({ file })
        }
      }
      input.click()
    }
  } else if (comp.type === 'shape') {
    // Handle different shape types based on originalShape ID
    const originalShape = comp.props?.originalShape || comp.id
    
    console.log('[VisualEditor] Adding shape:', { originalShape, compId: comp.id, props: comp.props })
    
    // Map original shape IDs to add functions
    if (originalShape === 'rectangle') {
      addRect(comp.props)
    } else if (originalShape === 'circle') {
      addCircle(comp.props)
    } else if (originalShape === 'triangle') {
      addTriangle(comp.props)
    } else if (originalShape === 'star') {
      addStar(comp.props)
    } else if (originalShape === 'hexagon' || originalShape === 'hexagon-flow') {
      addHexagon(comp.props)
    } else if (originalShape === 'pentagon') {
      addPentagon(comp.props)
    } else if (originalShape === 'diamond' || originalShape === 'diamond-flow') {
      addDiamond(comp.props)
    } else if (originalShape === 'ring') {
      addRing(comp.props)
    } else if (originalShape === 'arrow-right' || originalShape === 'arrow-up' || 
               originalShape === 'arrow-restart' || originalShape === 'arrow-double-right') {
      const arrowTypeMap = {
        'arrow-right': 'right',
        'arrow-up': 'up',
        'arrow-restart': 'restart',
        'arrow-double-right': 'double-right'
      }
      addArrow({ ...comp.props, arrowType: arrowTypeMap[originalShape] })
    } else if (originalShape === 'oval') {
      // Oval is an ellipse
      addEllipse(comp.props)
    } else if (originalShape === 'trapezoid') {
      // Trapezoid (top narrow, bottom wide)
      addTrapezoid(comp.props)
    } else if (originalShape === 'parallelogram') {
      // Parallelogram (skewed rectangle)
      addParallelogram(comp.props)
    } else {
      // Fallback to rectangle
      console.warn('[VisualEditor] Unknown shape type:', originalShape, '- using rectangle')
      addRect(comp.props || {})
    }
  } else if (comp.type === 'chart') {
    // Directly insert chart with sample data (no dialog)
    const chartType = comp.props?.chartType || 'bar'
    const chartOption = generateSampleChartOption(chartType)
    
    const chartId = `chart-${Date.now()}`
    const newChart = {
      id: chartId,
      x: 480 - 300, // Center horizontally (600px width -> 300px offset)
      y: 270 - 200, // Center vertically (400px height -> 200px offset)
      width: 600,
      height: 400,
      type: chartType,
      option: chartOption,
      draggable: true,
      name: chartId,
      __zIndex: charts.value.length
    }
    
    charts.value.push(newChart)
    emitUpdate()
    Message.success(t('slide.visual.messages.chartAdded', { type: chartType.charAt(0).toUpperCase() + chartType.slice(1) }))
  } else if (comp.type === 'video') {
    // Check if this is the generic video embed (should open file picker)
    if (comp.id === 'videoEmbed') {
      // Trigger file input for local video/audio upload
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'video/*,audio/*'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          handleVideoFileUpload(file)
        }
      }
      input.click()
    } else {
      // Show video URL input dialog for platform-specific embeds (Bilibili, YouTube, etc.)
      showVideoUrlInput.value = true
      videoUrl.value = ''
    }
  } else if (comp.type === 'link') {
    // Add link with default URL
    addLink({ 
      text: 'Click to edit link', 
      url: 'https://example.com',
      fontSize: 18 
    })
  } else if (comp.type === 'layout') {
    // Handle smart layout components
    // Layout can be passed either as comp.layout or comp.props.layout
    const layout = comp.layout || comp.props?.layout
    
    if (layout && layout.id) {
      // Apply the layout using our new addLayout method
      addLayout(layout)
    } else {
      console.warn('[VisualEditor] Invalid layout data:', comp)
      Message.warning(t('slide.visual.messages.invalidLayout') || 'Invalid layout data')
    }
  } else if (comp.type === 'table') {
    // Handle table component
    const rows = comp.props?.rows || 3
    const cols = comp.props?.cols || 3
    addTable({ rows, cols })
  } else {
    Message.warning(t('slide.visual.messages.unknownComponentType', { type: comp.type }))
  }
}

// Handle chart editor confirmation
const handleChartConfirm = (chartData) => {
  console.log('[VisualEditor] Chart confirmed:', chartData)
  
  // Check if we're editing an existing chart
  if (editingChartId.value) {
    // Update existing chart
    const chartIndex = charts.value.findIndex(c => c.id === editingChartId.value)
    if (chartIndex !== -1) {
      charts.value[chartIndex] = {
        ...charts.value[chartIndex],
        type: chartData.type,
        option: chartData.option
      }
      Message.success(t('slide.visual.chart.updated'))
    }
    editingChartId.value = null
  } else {
    // Add new chart
    const chartId = `chart-${Date.now()}`
    const newChart = {
      id: chartId,
      x: 100,
      y: 100,
      width: 600,
      height: 400,
      type: chartData.type,
      option: chartData.option,
      draggable: true,
      name: chartId,
      __zIndex: charts.value.length
    }
    
    charts.value.push(newChart)
    Message.success(t('slide.visual.chart.added', { type: chartData.type.charAt(0).toUpperCase() + chartData.type.slice(1) }))
  }
  
  emitUpdate()
}

// Handle chart edit data (from toolbar)
const handleChartEditData = () => {
  console.log('[VisualEditor] handleChartEditData called, selectedId:', selectedId.value)
  if (!selectedId.value) return
  
  const chart = charts.value.find(c => c.id === selectedId.value)
  console.log('[VisualEditor] Found chart:', chart)
  if (chart) {
    editingChartId.value = chart.id
    pendingChartType.value = chart.type
    showChartEditor.value = true
    console.log('[VisualEditor] Opening chart editor, showChartEditor:', showChartEditor.value)
  }
}

// Handle chart type change (from toolbar)
const handleChartChangeType = (newType) => {
  if (!selectedId.value) return
  
  const chartIndex = charts.value.findIndex(c => c.id === selectedId.value)
  if (chartIndex !== -1) {
    const chart = charts.value[chartIndex]
    // Generate new option for the new type with existing data
    const newOption = generateSampleChartOption(newType)
    charts.value[chartIndex] = {
      ...chart,
      type: newType,
      option: newOption
    }
    emitUpdate()
    Message.success(t('slide.visual.chart.typeChanged', { type: newType }))
  }
}

// Handle chart click
const handleChartClick = (chartId) => {
  console.log('[VisualEditor] Chart clicked:', chartId)
  console.log('[VisualEditor] Charts:', charts.value)
  if (props.readonly) return
  selectedId.value = chartId
  console.log('[VisualEditor] selectedId set to:', selectedId.value)
  handleShapeClick(chartId)
}

// Handle chart mouse down (start dragging)
const handleChartMouseDown = (chart, event) => {
  if (props.readonly) return
  
  console.log('[Chart Drag] Mouse down:', {
    chartId: chart.id,
    chartPos: { x: chart.x, y: chart.y },
    mousePos: { clientX: event.clientX, clientY: event.clientY }
  })
  
  // Don't prevent default or stop propagation - let click work
  // Use composable to start chart drag
  startChartDrag(chart.id, event.clientX, event.clientY, chart.x, chart.y)
  
  // Add global mouse move and up listeners
  document.addEventListener('mousemove', handleChartMouseMove)
  document.addEventListener('mouseup', handleChartMouseUp)
}

// Handle chart mouse move (dragging)
const handleChartMouseMove = (event) => {
  if (!draggingChartId.value) return
  
  // Use composable to calculate drag delta
  const dragDelta = updateChartDrag(event.clientX, event.clientY, 5)
  
  if (!dragDelta) return // Haven't moved threshold yet
  
  // Update chart position
  const chartIndex = charts.value.findIndex(c => c.id === draggingChartId.value)
  if (chartIndex !== -1) {
    console.log('[Chart Drag] Moving:', {
      delta: { x: dragDelta.dx, y: dragDelta.dy },
      newPos: { x: dragDelta.newX, y: dragDelta.newY }
    })
    
    charts.value[chartIndex].x = dragDelta.newX
    charts.value[chartIndex].y = dragDelta.newY
  }
}

// Handle chart mouse up (end dragging)
const handleChartMouseUp = () => {
  if (draggingChartId.value) {
    console.log('[Chart Drag] Mouse up')
    
    // Use composable to end drag and check if was actually dragging
    const wasDragging = endChartDrag()
    
    // Only emit update if actually dragged
    if (wasDragging) {
      emitUpdate()
    }
    
    // Remove global listeners
    document.removeEventListener('mousemove', handleChartMouseMove)
    document.removeEventListener('mouseup', handleChartMouseUp)
  }
}

// Handle chart resize start
const handleChartResizeStart = (chart, handle, event) => {
  if (props.readonly) return
  
  event.preventDefault()
  event.stopPropagation()
  
  console.log('[Chart Resize] Resize start:', { chartId: chart.id, handle })
  
  resizingChartId.value = chart.id
  resizeHandle.value = handle
  isResizing.value = false
  chartResizeStart.value = {
    x: event.clientX,
    y: event.clientY
  }
  chartInitialBounds.value = {
    x: chart.x,
    y: chart.y,
    width: chart.width || 600,
    height: chart.height || 400
  }
  
  // Add global mouse listeners
  document.addEventListener('mousemove', handleChartResizeMove)
  document.addEventListener('mouseup', handleChartResizeEnd)
}

// Handle chart resize move
const handleChartResizeMove = (event) => {
  if (!resizingChartId.value) return
  
  const deltaX = event.clientX - chartResizeStart.value.x
  const deltaY = event.clientY - chartResizeStart.value.y
  
  // Only start resizing if moved more than 3px
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  if (distance > 3) {
    isResizing.value = true
  }
  
  if (isResizing.value) {
    const chartIndex = charts.value.findIndex(c => c.id === resizingChartId.value)
    if (chartIndex !== -1) {
      const chart = charts.value[chartIndex]
      const bounds = chartInitialBounds.value
      
      let newWidth = bounds.width
      let newHeight = bounds.height
      let newX = bounds.x
      let newY = bounds.y
      
      // Handle different resize handles
      switch (resizeHandle.value) {
        case 'top-left':
          newWidth = Math.max(100, bounds.width - deltaX)
          newHeight = Math.max(80, bounds.height - deltaY)
          newX = bounds.x + (bounds.width - newWidth)
          newY = bounds.y + (bounds.height - newHeight)
          break
        case 'top-right':
          newWidth = Math.max(100, bounds.width + deltaX)
          newHeight = Math.max(80, bounds.height - deltaY)
          newY = bounds.y + (bounds.height - newHeight)
          break
        case 'bottom-left':
          newWidth = Math.max(100, bounds.width - deltaX)
          newHeight = Math.max(80, bounds.height + deltaY)
          newX = bounds.x + (bounds.width - newWidth)
          break
        case 'bottom-right':
          newWidth = Math.max(100, bounds.width + deltaX)
          newHeight = Math.max(80, bounds.height + deltaY)
          break
        case 'top-center':
          newHeight = Math.max(80, bounds.height - deltaY)
          newY = bounds.y + (bounds.height - newHeight)
          break
        case 'bottom-center':
          newHeight = Math.max(80, bounds.height + deltaY)
          break
        case 'middle-left':
          newWidth = Math.max(100, bounds.width - deltaX)
          newX = bounds.x + (bounds.width - newWidth)
          break
        case 'middle-right':
          newWidth = Math.max(100, bounds.width + deltaX)
          break
      }
      
      // Maintain aspect ratio for corner handles
      if (resizeHandle.value.includes('top') || resizeHandle.value.includes('bottom')) {
        if (resizeHandle.value.includes('left') || resizeHandle.value.includes('right')) {
          // Corner handles - maintain aspect ratio
          const aspectRatio = bounds.width / bounds.height
          if (newWidth / newHeight > aspectRatio) {
            newWidth = newHeight * aspectRatio
          } else {
            newHeight = newWidth / aspectRatio
          }
          // Adjust position to maintain anchor point
          if (resizeHandle.value.includes('left')) {
            newX = bounds.x + (bounds.width - newWidth)
          }
          if (resizeHandle.value.includes('top')) {
            newY = bounds.y + (bounds.height - newHeight)
          }
        }
      }
      
      console.log('[Chart Resize] Resizing:', {
        handle: resizeHandle.value,
        delta: { x: deltaX, y: deltaY },
        newSize: { width: newWidth, height: newHeight },
        newPos: { x: newX, y: newY }
      })
      
      chart.x = newX
      chart.y = newY
      chart.width = newWidth
      chart.height = newHeight
    }
  }
}

// Handle chart resize end
const handleChartResizeEnd = () => {
  if (resizingChartId.value) {
    console.log('[Chart Resize] Resize end, was resizing:', isResizing.value)
    
    if (isResizing.value) {
      emitUpdate()
    }
    
    resizingChartId.value = null
    resizeHandle.value = null
    isResizing.value = false
    
    // Remove global listeners
    document.removeEventListener('mousemove', handleChartResizeMove)
    document.removeEventListener('mouseup', handleChartResizeEnd)
  }
}

// GIF Image drag handlers (similar to chart drag)
const handleImageClick = (imageId) => {
  if (props.readonly) return
  selectedId.value = imageId
}

const handleImageMouseDown = (image, event) => {
  if (props.readonly) return
  
  // Use composable to start image drag
  startImageDrag(image.id, event.clientX, event.clientY, image.x, image.y)
  
  document.addEventListener('mousemove', handleImageMouseMove)
  document.addEventListener('mouseup', handleImageMouseUp)
}

const handleImageMouseMove = (event) => {
  if (!draggingImageId.value) return
  
  // Use composable to calculate drag delta
  const dragDelta = updateImageDrag(event.clientX, event.clientY, 5)
  
  if (!dragDelta) return // Haven't moved threshold yet
  
  // Update image position
  const imageIndex = images.value.findIndex(i => i.id === draggingImageId.value)
  if (imageIndex !== -1) {
    images.value[imageIndex].x = dragDelta.newX
    images.value[imageIndex].y = dragDelta.newY
  }
}

const handleImageMouseUp = () => {
  if (draggingImageId.value) {
    // Use composable to end drag and check if was actually dragging
    const wasDragging = endImageDrag()
    
    if (wasDragging) {
      emitUpdate()
    }
    
    document.removeEventListener('mousemove', handleImageMouseMove)
    document.removeEventListener('mouseup', handleImageMouseUp)
  }
}



// Generate sample chart option for different chart types
const generateSampleChartOption = (chartType) => {
  if (chartType === 'bar') {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'Value',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: { color: '#4285f4' },
        barWidth: '60%'
      }]
    }
  } else if (chartType === 'line') {
    return {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        boundaryGap: false
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'Value',
        type: 'line',
        data: [120, 200, 150, 80, 70, 110, 130],
        smooth: true,
        itemStyle: { color: '#34a853' },
        areaStyle: { color: 'rgba(52, 168, 83, 0.2)' }
      }]
    }
  } else if (chartType === 'pie') {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: '10%',
        top: 'center'
      },
      series: [{
        name: 'Data',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {d}%'
        },
        data: [
          { name: 'Product A', value: 335 },
          { name: 'Product B', value: 310 },
          { name: 'Product C', value: 234 },
          { name: 'Product D', value: 135 },
          { name: 'Product E', value: 148 }
        ]
      }]
    }
  } else if (chartType === 'area') {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'Value',
        type: 'line',
        data: [120, 200, 150, 80, 70, 110, 130],
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.5)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
            ]
          }
        },
        itemStyle: { color: '#6366f1' },
        lineStyle: { width: 2 }
      }]
    }
  } else if (chartType === 'scatter') {
    return {
      tooltip: {
        trigger: 'item',
        formatter: 'X: {c0}<br/>Y: {c1}'
      },
      grid: {
        left: '3%',
        right: '7%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'X Axis',
        splitLine: { lineStyle: { type: 'dashed' } }
      },
      yAxis: {
        type: 'value',
        name: 'Y Axis',
        splitLine: { lineStyle: { type: 'dashed' } }
      },
      series: [{
        name: 'Data Points',
        type: 'scatter',
        symbolSize: 10,
        data: [
          [10, 8.2], [15, 7.5], [20, 9.1], [25, 8.5], [30, 9.8],
          [35, 7.8], [40, 8.9], [45, 9.5], [50, 8.1], [55, 9.3]
        ],
        itemStyle: {
          color: '#f59e0b',
          opacity: 0.8
        },
        emphasis: {
          itemStyle: { opacity: 1 }
        }
      }]
    }
  } else if (chartType === 'radar') {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '5%',
        left: 'center'
      },
      radar: {
        indicator: [
          { name: 'Sales', max: 100 },
          { name: 'Marketing', max: 100 },
          { name: 'Development', max: 100 },
          { name: 'Support', max: 100 },
          { name: 'Technology', max: 100 },
          { name: 'Administration', max: 100 }
        ],
        radius: '65%'
      },
      series: [{
        name: 'Performance',
        type: 'radar',
        data: [
          {
            value: [85, 70, 90, 75, 88, 65],
            name: 'Team A',
            itemStyle: { color: '#8b5cf6' },
            areaStyle: { opacity: 0.3 }
          },
          {
            value: [65, 85, 70, 90, 75, 80],
            name: 'Team B',
            itemStyle: { color: '#06b6d4' },
            areaStyle: { opacity: 0.3 }
          }
        ]
      }]
    }
  } else if (chartType === 'funnel') {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        bottom: '5%',
        left: 'center'
      },
      series: [{
        name: 'Conversion',
        type: 'funnel',
        left: '10%',
        width: '80%',
        label: {
          formatter: '{b}: {c}'
        },
        labelLine: {
          show: true
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        data: [
          { value: 1000, name: 'Visits' },
          { value: 750, name: 'Sign-ups' },
          { value: 500, name: 'Active Users' },
          { value: 250, name: 'Paying Users' },
          { value: 100, name: 'Loyal Customers' }
        ]
      }]
    }
  } else if (chartType === 'gauge') {
    return {
      tooltip: {
        formatter: '{b}: {c}%'
      },
      series: [{
        name: 'Progress',
        type: 'gauge',
        radius: '80%',
        startAngle: 200,
        endAngle: -20,
        progress: {
          show: true,
          width: 18,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#34d399' },
                { offset: 1, color: '#10b981' }
              ]
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, '#e5e7eb']]
          }
        },
        axisTick: { show: false },
        splitLine: {
          length: 12,
          lineStyle: { width: 2, color: '#999' }
        },
        axisLabel: {
          distance: 25,
          color: '#999',
          fontSize: 14
        },
        pointer: {
          itemStyle: { color: '#10b981' },
          width: 4
        },
        title: {
          offsetCenter: [0, '80%'],
          fontSize: 16,
          color: '#464646'
        },
        detail: {
          fontSize: 40,
          offsetCenter: [0, '50%'],
          valueAnimation: true,
          formatter: '{value}%',
          color: '#10b981'
        },
        data: [{ value: 75, name: 'Completion' }]
      }]
    }
  }
  return {}
}

// Handle property update from property panel
/*
const handlePropertyUpdate = (updatedComponent) => {
  if (!updatedComponent) return
  
  // Update the component in the appropriate array
  if (updatedComponent.type === 'text') {
    const index = texts.value.findIndex(t => t.id === updatedComponent.id)
    if (index !== -1) {
      texts.value[index] = { ...texts.value[index], ...updatedComponent }
    }
  } else if (updatedComponent.type === 'image') {
    const index = images.value.findIndex(i => i.id === updatedComponent.id)
    if (index !== -1) {
      images.value[index] = { ...images.value[index], ...updatedComponent }
    }
  } else if (updatedComponent.type === 'rect') {
    const index = rectangles.value.findIndex(r => r.id === updatedComponent.id)
    if (index !== -1) {
      rectangles.value[index] = { ...rectangles.value[index], ...updatedComponent }
    }
  } else if (updatedComponent.type === 'circle') {
    const index = circles.value.findIndex(c => c.id === updatedComponent.id)
    if (index !== -1) {
      circles.value[index] = { ...circles.value[index], ...updatedComponent }
    }
  } else if (updatedComponent.type === 'link') {
    const index = links.value.findIndex(l => l.id === updatedComponent.id)
    if (index !== -1) {
      links.value[index] = { ...links.value[index], ...updatedComponent }
    }
  } else if (updatedComponent.type === 'triangle') {
    const index = triangles.value.findIndex(t => t.id === updatedComponent.id)
    if (index !== -1) {
      triangles.value[index] = { ...triangles.value[index], ...updatedComponent }
    }
  } else if (updatedComponent.type === 'star') {
    const index = stars.value.findIndex(s => s.id === updatedComponent.id)
    if (index !== -1) {
      stars.value[index] = { ...stars.value[index], ...updatedComponent }
    }
  }
  
  // Force Konva to redraw
  nextTick(() => {
    updateTransformer()
  })
}
*/

// Handle text style update from floating toolbar
const handleTextStyleUpdate = (styles) => {
  if (!selectedId.value) return
  
  const text = texts.value.find(t => t.id === selectedId.value)
  if (text) {
    // If align is being set, ensure text has a reasonable width
    if (styles.align && (!text.width || text.width === 'auto')) {
      // Calculate accurate width using Konva's text measurement
      text.width = getTextWidth(text)
    }
    
    Object.assign(text, styles)
    nextTick(() => {
      updateTransformer()
    })
  }
}

// Handle shape style update from floating toolbar
const handleShapeStyleUpdate = (styles) => {
  if (!selectedId.value) return
  
  const rect = rectangles.value.find(r => r.id === selectedId.value)
  if (rect) {
    Object.assign(rect, styles)
    nextTick(() => {
      updateTransformer()
    })
    return
  }
  
  const circle = circles.value.find(c => c.id === selectedId.value)
  if (circle) {
    Object.assign(circle, styles)
    nextTick(() => {
      updateTransformer()
    })
    return
  }
  
  const triangle = triangles.value.find(t => t.id === selectedId.value)
  if (triangle) {
    Object.assign(triangle, styles)
    nextTick(() => {
      updateTransformer()
    })
    return
  }
  
  const star = stars.value.find(s => s.id === selectedId.value)
  if (star) {
    Object.assign(star, styles)
    nextTick(() => {
      updateTransformer()
    })
  }
}

// Handle image operations
const handleImageReplace = () => {
  console.log('[VisualEditor] handleImageReplace called, selectedId:', selectedId.value)
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file && selectedId.value) {
      console.log('[VisualEditor] Replacing image with file:', file.name)
      handleImageUpload({ file, replaceId: selectedId.value })
    }
  }
  input.click()
}

// Validate image object before using it in Konva
const isValidImageObject = (imgObj) => {
  if (!imgObj) return false
  
  // Check if it's an Image object
  if (!(imgObj instanceof window.Image)) {
    console.warn('[VisualEditor] Invalid image object type:', typeof imgObj)
    return false
  }
  
  // Check if image is loaded
  if (!imgObj.complete) {
    console.warn('[VisualEditor] Image not loaded yet')
    return false
  }
  
  // Check if image has valid dimensions
  if (imgObj.naturalWidth === 0 || imgObj.naturalHeight === 0) {
    console.warn('[VisualEditor] Image has invalid dimensions:', imgObj.naturalWidth, 'x', imgObj.naturalHeight)
    return false
  }
  
  // Check if image has valid src
  if (!imgObj.src || imgObj.src === '') {
    console.warn('[VisualEditor] Image has no src')
    return false
  }
  
  return true
}

// Safe image getter for Konva
const getSafeImageForKonva = (imageData) => {
  if (!imageData) {
    console.log('[getSafeImageForKonva] No imageData provided')
    return null
  }
  
  console.log('[getSafeImageForKonva] Checking image:', imageData.id, 'isGif:', imageData.isGif)
  
  // For GIF images, they should not be rendered in Konva canvas
  if (imageData.isGif) {
    console.log('[VisualEditor] Skipping GIF for Konva:', imageData.id)
    return null
  }
  
  // For non-GIF images, validate the Image object
  const isValid = imageData.image && isValidImageObject(imageData.image)
  console.log('[getSafeImageForKonva] Image valid:', isValid, 'hasImage:', !!imageData.image)
  
  if (isValid) {
    return imageData.image
  }
  
  console.warn('[VisualEditor] Invalid image for Konva:', imageData.id)
  return null
}

// Validate and fix image data
const handleImageCrop = () => {
  Message.info(t('slide.visual.image.cropComingSoon'))
}

const handleImageFilter = (filterType) => {
  if (!selectedId.value) return
  
  saveToHistory()
  
  const image = images.value.find(i => i.id === selectedId.value)
  if (image) {
    console.log('[VisualEditor] Applying filter:', filterType, 'to image:', image.id)
    
    // Import Konva filters
    const Konva = window.Konva
    
    // Validate Konva is available
    if (!Konva || !Konva.Filters) {
      console.error('[VisualEditor] Konva filters not available')
      Message.error(t('slide.visual.messages.imageFiltersNotSupported'))
      return
    }
    
    // Clear existing filters
    image.filters = []
    
    // Apply filter based on type
    switch (filterType) {
      case 'grayscale':
        image.filters = [Konva.Filters.Grayscale]
        console.log('[VisualEditor] Applied Grayscale filter')
        break
      case 'sepia':
        image.filters = [Konva.Filters.Sepia]
        console.log('[VisualEditor] Applied Sepia filter')
        break
      case 'blur':
        image.filters = [Konva.Filters.Blur]
        image.blurRadius = 10  // Blur intensity
        console.log('[VisualEditor] Applied Blur filter with radius:', image.blurRadius)
        break
      case 'brightness':
        image.filters = [Konva.Filters.Brighten]
        image.brightness = 0.3  // Increase brightness by 30%
        console.log('[VisualEditor] Applied Brightness filter with value:', image.brightness)
        break
      case 'none':
      default:
        image.filters = []
        image.blurRadius = undefined
        image.brightness = undefined
        console.log('[VisualEditor] Removed all filters')
        break
    }
    
    // Store filter type for toolbar state
    image.filterType = filterType
    
    console.log('[VisualEditor] Image filters after apply:', image.filters, 'filterType:', image.filterType)
    
    // Force update
    nextTick(() => {
      updateTransformer()
    })
    
    // Show appropriate success message
    // let messageKey = 'slide.visual.image.filterApplied'
    // if (filterType === 'none') {
    //   messageKey = 'slide.visual.image.filterRemoved'
    // }
    
    const filterName = t(`slide.visual.image.filter${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`)
    Message.success(`${t('slide.visual.image.filter')}: ${filterName}`)
  }
}


// Keyboard event handler (simplified)
const handleKeyDown = (e) => {
  // Ignore if editing text
  if (isEditingText.value) {
    return
  }
  
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const ctrlKey = isMac ? e.metaKey : e.ctrlKey
  
  // Ctrl+C - Copy (only if something is selected)
  if (ctrlKey && e.key === 'c') {
    // Check if we're in a contenteditable element (like table cell editing)
    const activeElement = document.activeElement
    const isContentEditable = activeElement?.isContentEditable
    
    // If editing a cell, let the cell's copy handler take over
    if (isContentEditable) {
      console.log('[VisualEditor] Allowing copy - contenteditable element is active')
      return // Let browser and cell handler handle it
    }
    
    // Only prevent default if we have something to copy
    if (selectedId.value || selectedIds.value.size > 0) {
      e.preventDefault()
      e.stopPropagation()
      copySelected()
    }
    // Otherwise, let browser handle default copy behavior (for external content)
    return
  }
  
  // Ctrl+V - Let paste event bubble to document listener (for external clipboard support)
  // The handleSystemPaste function will handle both internal and external clipboard
  
  // Ctrl+Z - Undo
  if (ctrlKey && e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    undo()
    return
  }
  
  // Ctrl+Y or Ctrl+Shift+Z - Redo
  if ((ctrlKey && e.key === 'y') || (ctrlKey && e.shiftKey && e.key === 'z')) {
    e.preventDefault()
    e.stopPropagation()
    redo()
    return
  }
  
  // Delete key (only if something is selected)
  if (e.key === 'Delete' || e.key === 'Backspace') {
    // Only prevent default if we have something selected to delete
    if (selectedId.value || selectedIds.value.size > 0) {
      e.preventDefault()
      e.stopPropagation()
      deleteSelected()
    }
    // Otherwise, let browser handle default behavior
    return
  }
  
  // Arrow keys for moving selected elements (including charts)
  if (selectedId.value && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault()
    e.stopPropagation()
    
    const moveStep = e.shiftKey ? 10 : 1 // Shift for bigger steps
    const chart = charts.value.find(c => c.id === selectedId.value)
    
    if (chart) {
      saveToHistory()
      switch (e.key) {
        case 'ArrowUp':
          chart.y -= moveStep
          break
        case 'ArrowDown':
          chart.y += moveStep
          break
        case 'ArrowLeft':
          chart.x -= moveStep
          break
        case 'ArrowRight':
          chart.x += moveStep
          break
      }
      emitUpdate()
      return
    }
  }
}
  


// Expose methods and state to parent component
// Select all elements on canvas
const selectAll = () => {
  const allIds = new Set()
  
  // Add all component IDs to selection
  texts.value.forEach(t => allIds.add(t.id))
  links.value.forEach(l => allIds.add(l.id))
  images.value.forEach(i => allIds.add(i.id))
  rectangles.value.forEach(r => allIds.add(r.id))
  circles.value.forEach(c => allIds.add(c.id))
  triangles.value.forEach(t => allIds.add(t.id))
  stars.value.forEach(s => allIds.add(s.id))
  charts.value.forEach(c => allIds.add(c.id))
  videos.value.forEach(v => allIds.add(v.id))
  tables.value.forEach(t => allIds.add(t.id))
  
  selectedIds.value = allIds
  selectedId.value = null // Multiple elements selected
  
  console.log('[VisualEditor] Select All:', allIds.size, 'elements selected')
  
  // Update transformer to show all selected
  nextTick(() => {
    updateMultiTransformer()
  })
  
  Message.success(t('slide.visual.messages.selectedElements', { count: allIds.size }))
}

defineExpose({
  // State for toolbars
  showTextToolbar,
  textToolbarPosition,
  selectedTextData,
  showShapeToolbar,
  shapeToolbarPosition,
  selectedShapeData,
  showImageToolbar,
  imageToolbarPosition,
  selectedImageData,
  showChartToolbar,
  chartToolbarPosition,
  selectedChartData,
  showVideoToolbar,
  videoToolbarPosition,
  selectedVideoData,
  showTableToolbar,
  tableToolbarPosition,
  selectedId, // Expose selectedId to check if something is selected
  selectedIds, // Expose multi-selection state
  
  // Methods
  selectAll,         // Select all elements
  handleAddComponent,
  handleTextStyleUpdate,
  handleShapeStyleUpdate,
  deleteSelected,
  copySelected,      // Add copy method
  paste,             // Add paste method
  duplicateSelected, // Add duplicate method
  undo,              // Add undo method
  redo,              // Add redo method
  moveLayerUp,
  moveLayerDown,
  moveLayerToTop,
  moveLayerToBottom,
  handleEditLink,
  
  // Add method to safely hide all toolbars
  hideAllToolbars: () => {
    showTextToolbar.value = false
    showShapeToolbar.value = false
    showImageToolbar.value = false
    showChartToolbar.value = false
    showVideoToolbar.value = false
    showTableToolbar.value = false
    selectedId.value = null
  },
  handleImageReplace,
  handleImageCrop,
  handleImageFilter,
  handleChartEditData,
  handleChartChangeType,
  handleVideoReplaceUrl,
  addTableRow,
  deleteTableRow,
  addTableColumn,
  deleteTableColumn
})
</script>

<style scoped>
.visual-editor-proto {
  width: 100%;
  height: 100%;
  display: flex;
  background: transparent;
}

.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: transparent;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 0;
  min-width: 0;
  background: transparent;
  position: relative;
}

/* Theme background layer (HTML div behind Konva) */
.canvas-background {
  position: absolute;
  pointer-events: none; /* Let clicks pass through to Konva */
  z-index: 0;
}

/* Ensure Konva container is above background and transparent */
.canvas-wrapper :deep(.konvajs-content) {
  position: relative !important;
  margin: 0 auto;
  display: block;
  z-index: 1;
  /* Remove background styles - let HTML background show through */
  background: transparent !important;
  border-radius: 8px;
  overflow: visible;
}

.canvas-wrapper :deep(canvas) {
  box-shadow: none;
  border-radius: 0;
}

/* Inline text editor - positioned to match text container exactly */
.inline-text-editor {
  pointer-events: auto;
  overflow: visible;
  background: transparent !important;
}

.inline-text-input {
  display: block;
  width: 100%;
  height: 100%;
  border: none !important;
  border-bottom: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  outline: none !important;
  resize: none;
  box-shadow: none !important;
  font-family: inherit;
  overflow: hidden;
  margin: 0;
  padding: 0;
  line-height: 1.5;
  box-sizing: border-box;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  -webkit-tap-highlight-color: transparent !important;
  /* Ensure font weight is not artificially bolded */
  font-weight: inherit !important;
  font-synthesis: none;
  /* Font smoothing - match default browser rendering to avoid bold appearance */
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: auto;
  text-rendering: auto;
  /* Additional resets to prevent bold rendering */
  text-shadow: none;
  -webkit-text-stroke: 0;
}

.inline-text-input:hover,
.inline-text-input:active,
.inline-text-input:focus,
.inline-text-input:focus-visible,
.inline-text-input:focus-within {
  border: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  outline: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

.inline-text-input::selection {
  background: rgba(64, 128, 255, 0.3);
}

/* Chart container styles (wrapper with resize handles) */
.chart-container {
  position: absolute;
  pointer-events: auto;
  user-select: none;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Chart overlay styles (inner content) */
.chart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: box-shadow 0.2s, border 0.2s, transform 0.05s;
  border-radius: 0;
  background: transparent;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px dashed transparent;
  cursor: move;
  box-shadow: none;
}

.chart-overlay:hover {
  border-color: #4080ff;
}

.chart-overlay.selected {
  border-color: #4080ff;
  outline: none;
}

.chart-container.dragging .chart-overlay {
  opacity: 0.9;
  transform: scale(1.01);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  cursor: grabbing;
}

/* Resize handles */
.resize-handle {
  position: absolute;
  width: 12px;  /* Increased from 10px */
  height: 12px;  /* Increased from 10px */
  background: white;
  border: 2px solid #3b82f6;  /* Thicker border, brighter blue */
  border-radius: 2px;  /* Slightly rounded for better visibility */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);  /* Stronger shadow */
  z-index: 1000;
  pointer-events: auto;
  transition: all 0.2s ease;  /* Smooth hover effect */
}

.resize-handle:hover {
  background: #3b82f6;  /* Blue background on hover */
  border-color: #2563eb;  /* Darker blue border on hover */
  transform: scale(1.3);  /* More noticeable scale */
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.5);  /* Blue glow */
}

.resize-handle.top-left {
  top: -6px;
  left: -6px;
  cursor: nw-resize;
}

.resize-handle.top-right {
  top: -6px;
  right: -6px;
  cursor: ne-resize;
}

.resize-handle.bottom-left {
  bottom: -6px;
  left: -6px;
  cursor: sw-resize;
}

.resize-handle.bottom-right {
  bottom: -6px;
  right: -6px;
  cursor: se-resize;
}

.resize-handle.top-center {
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
}

.resize-handle.top-center:hover {
  transform: translateX(-50%) scale(1.3);  /* Keep centered while scaling */
}

.resize-handle.bottom-center {
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
}

.resize-handle.bottom-center:hover {
  transform: translateX(-50%) scale(1.3);  /* Keep centered while scaling */
}

.resize-handle.middle-left {
  top: 50%;
  left: -6px;
  transform: translateY(-50%);
  cursor: w-resize;
}

.resize-handle.middle-left:hover {
  transform: translateY(-50%) scale(1.3);  /* Keep centered while scaling */
}

.resize-handle.middle-right {
  top: 50%;
  right: -6px;
  transform: translateY(-50%);
  cursor: e-resize;
}

.resize-handle.middle-right:hover {
  transform: translateY(-50%) scale(1.3);  /* Keep centered while scaling */
}

/* Chart type badge - subtle indicator in top-right */
.chart-type-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #5f6368;
  letter-spacing: 0.5px;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.chart-overlay:hover .chart-type-badge,
.chart-overlay.selected .chart-type-badge {
  opacity: 1;
}

/* Chart content area */
.chart-content {
  flex: 1;
  overflow: hidden;
  pointer-events: auto;
  position: relative;
}

.chart-content :deep(canvas) {
  pointer-events: none !important;
}

/* GIF/Animated Image overlays (similar to chart overlays) */
.gif-overlay {
  position: absolute;
  pointer-events: auto;
  transition: box-shadow 0.2s, border 0.2s, transform 0.05s;
  border-radius: 8px;
  user-select: none;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: move;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.gif-overlay:hover {
  border-color: rgba(66, 133, 244, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(66, 133, 244, 0.2);
}

.gif-overlay.selected {
  border-color: #4285f4;
  box-shadow: 0 0 0 2px #4285f4, 0 4px 12px rgba(66, 133, 244, 0.3);
  outline: none;
}

.gif-overlay.dragging {
  opacity: 0.9;
  transform: scale(1.01);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  cursor: grabbing;
}

.gif-content {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  display: block;
}

/* Video container styles (similar to chart container) */
.video-container {
  position: absolute;
  pointer-events: auto;
  user-select: none;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Video overlay styles (inner content) */
.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: box-shadow 0.2s, border 0.2s, transform 0.05s;
  border-radius: 0;
  background: transparent;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px dashed transparent;
  cursor: move;
  box-shadow: none;
}

.video-overlay:hover {
  border-color: #4080ff;
}

.video-overlay.selected {
  border-color: #4080ff;
  outline: none;
}

.video-container.dragging .video-overlay {
  opacity: 0.9;
  transform: scale(1.01);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  cursor: grabbing;
}

.video-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  flex: 1;
  pointer-events: auto;
  background: #000;
}

.video-container:not(.selected) .video-iframe {
  pointer-events: none;
}

/* Video provider badge */
.video-provider-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
}

.video-filename-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 4px;
  font-size: 11px;
  color: white;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.video-container:hover .video-provider-badge,
.video-container.selected .video-provider-badge,
.video-container:hover .video-filename-badge,
.video-container.selected .video-filename-badge {
  opacity: 1;
}

/* Floating Table Toolbar */
.floating-table-toolbar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 8px;
  display: flex;
  gap: 8px;
  z-index: 10000;
}

.floating-table-toolbar .toolbar-content {
  display: flex;
  gap: 8px;
  align-items: center;
}

.floating-table-toolbar .toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
  transition: all 0.2s;
}

.floating-table-toolbar .toolbar-btn:hover {
  background: #f3f4f6;
}

.floating-table-toolbar .delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.floating-table-toolbar .toolbar-divider {
  width: 1px;
  height: 24px;
  background: #e5e7eb;
  margin: 0 4px;
}

/* Table Container (HTML overlay) */
.table-container {
  position: absolute;
  user-select: none;
  pointer-events: auto;
  overflow: visible;  /* Important: Allow resize handles to overflow */
  cursor: move;  /* Show move cursor by default */
}

.table-container.selected {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;  /* Inside the container */
}

/* Multi-selection visual indicator */
.table-container.multi-selected {
  outline: 3px solid #3b82f6;
  outline-offset: -3px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2),
              0 4px 12px rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
}

/* Add a badge indicator for multi-selected tables */
.table-container.multi-selected::before {
  content: '✓';
  position: absolute;
  top: -12px;
  right: -12px;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  border: 2px solid white;
}

/* Multi-selection count badge */
.multi-selection-badge {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4),
              0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  z-index: 2000;
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.table-container.dragging {
  opacity: 0.8;
  cursor: grabbing;
}

.table-container.editing-cell {
  cursor: default;
}

.table-container.editing-cell .editable-table th,
.table-container.editing-cell .editable-table td {
  cursor: text;
}

.table-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;  /* Ensure handles are visible outside */
}

/* Drag handle bar */
.table-drag-bar {
  position: absolute;
  top: -28px;  /* Position above the table */
  left: 50%;
  transform: translateX(-50%);
  height: 24px;
  padding: 0 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  z-index: 1002;  /* Above resize handles */
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
  pointer-events: auto;
  user-select: none;
}

.table-drag-bar:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transform: translateX(-50%) translateY(-2px);
}

.table-drag-bar .drag-icon {
  color: white;
  opacity: 0.9;
}

.table-drag-bar:hover .drag-icon {
  opacity: 1;
}

/* Editable table styles */
.editable-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  position: relative;
  z-index: 1;  /* Below resize handles */
  table-layout: fixed;  /* Force fixed table layout to respect width/height */
}

.editable-table th,
.editable-table td {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  text-align: left;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: move;  /* Show move cursor on cells for dragging */
  box-sizing: border-box;  /* Include padding in width/height calculation */
  transition: background-color 0.15s ease;
  pointer-events: auto;  /* Allow cells to receive events */
}

/* Hover effect when not editing */
.editable-table th:hover,
.editable-table td:hover {
  background-color: rgba(59, 130, 246, 0.05) !important;
}

/* Selected cell highlight */
.editable-table th.selected-cell,
.editable-table td.selected-cell {
  background-color: rgba(59, 130, 246, 0.15) !important;
  box-shadow: inset 0 0 0 2px #3b82f6;
}

.editable-table th {
  font-weight: 600;
  background: #f3f4f6;
  color: #1f2937;
}

.editable-table td {
  background: white;
  color: #374151;
}

.editable-table tr.alternate-row td {
  background: #f9fafb;
}

.editable-table th:focus,
.editable-table td:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
  background: #eff6ff;
}

.editable-table th[contenteditable="true"],
.editable-table td[contenteditable="true"] {
  cursor: text;
  white-space: normal;
  overflow: visible;
  background-color: #eff6ff !important;
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
  z-index: 10;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.editable-table th[contenteditable="false"],
.editable-table td[contenteditable="false"] {
  user-select: none;
}
</style>
