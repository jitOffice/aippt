<template>
  <a-drawer
    v-model:visible="visible"
    :placement="placement"
    :width="computedWidth"
    class="mobile-docs-drawer"
    :mask-closable="true"
    :closable="true"
    :footer="false"
  >
    <template #header>
      <div class="flex items-center">
        <span
          v-html="icon['documents'].body"
          class="flex items-center justify-center mr-2 text-[var(--color-text-2)]"
        ></span>
        {{ t('doc.listTitle') }}
      </div>
    </template>

    <a-spin :loading="loading" :tip="t('doc.loadingList')" class="drawer-loading">
      <div class="drawer-content">
        <div class="mb-2 flex items-center justify-between">
          <a-button type="text" size="small" @click="emit('toggle-trash')">
            {{ isTrashView ? t('doc.backToDocs') : t('doc.viewTrash') }}
          </a-button>
          <a-button
            v-if="!isTrashView"
            type="text"
            size="small"
            @click="toggleBatchMode"
          >
            {{ batchMode ? t('doc.cancelSelect') : t('doc.batchDelete') }}
          </a-button>
        </div>
        <a-input
          v-model="searchText"
          size="small"
          allow-clear
          :placeholder="t('doc.searchPlaceholder')"
          class="mb-2"
        />

        <!-- 批量操作提示栏 -->
        <div v-if="batchMode && !isTrashView" class="batch-mode-bar mb-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <a-checkbox
                :model-value="isAllSelected"
                :indeterminate="isSomeSelected && !isAllSelected"
                @change="toggleSelectAll"
              >
                {{ t('doc.selectAll') }}
              </a-checkbox>
              <span class="text-[var(--color-text-3)] text-xs">
                {{ selectedIds.size > 0 ? t('doc.selected', { count: selectedIds.size }) : '' }}
              </span>
            </div>
            <a-button
              type="primary"
              status="danger"
              size="mini"
              :disabled="selectedIds.size === 0"
              @click="handleBatchDelete"
            >
              {{ t('doc.delete') }}
            </a-button>
          </div>
        </div>

        <div class="scope-switch" v-if="!isTrashView">
          <a-tabs
            size="small"
            type="capsule"
            class="scope-container"
            :class="{ 'scope-container-admin': isAdmin }"
            :active-key="scope"
            @change="key => emit('change-scope', key)"
          >
            <a-tab-pane key="mine">
              <template #title>
                {{ t('doc.scope.mine') }} ({{ stats?.mine ?? 0 }})
              </template>
            </a-tab-pane>
            <a-tab-pane key="shared">
              <template #title>
                {{ t('doc.scope.shared') }} ({{ stats?.shared ?? 0 }})
              </template>
            </a-tab-pane>
            <!-- 仅管理员可见：全部文档 -->
            <a-tab-pane v-if="isAdmin" key="all">
              <template #title>
                {{ t('doc.scope.all') }} ({{ stats?.all ?? 0 }})
              </template>
            </a-tab-pane>
          </a-tabs>
        </div>

        <!-- 列表区域，独立滚动 -->
        <div class="docs-list-scroll">
          <div v-if="filteredDocuments.length === 0" class="empty-state">
            <a-empty :description="t('doc.noMatchingDocuments')" />
          </div>

          <div
            v-for="group in groupedDocuments"
            :key="group.label"
            class="doc-group"
          >
            <div class="doc-group-title">{{ group.label }}</div>

            <div
              v-for="doc in group.items"
              :key="doc.id"
              class="doc-item"
              :class="{
                'doc-item-active': doc.id === currentDocumentId,
                'doc-item-selected': selectedIds.has(doc.id)
              }"
              @click="handleDocClick(doc.id,doc?.type)"
            >
            <!-- Checkbox for batch mode -->
            <a-checkbox
              v-if="batchMode && !isTrashView"
              :model-value="selectedIds.has(doc.id)"
              @click.stop
              @change="toggleDocSelection(doc.id)"
              class="doc-checkbox"
            />

            <!-- Document Icon -->
            <div 
              class="doc-icon" 
              v-html="doc.type === 'sheet' ? icon['excel'].body : (doc.type === 'mindmap' ? iconMindmapColor : (doc.type === 'slide' ? iconSlideColor : icon['word'].body))"
              :class="doc.type === 'sheet' ? 'text-green-600' : (doc.type === 'mindmap' || doc.type === 'slide' ? '' : 'text-blue-600')"
            ></div>
            
            <!-- Document Info -->
            <div class="doc-info">
              <!-- Editable document name -->
              <div 
                v-if="editingDocId === doc.id" 
                class="doc-name-edit"
                @click.stop
              >
                <input
                  ref="editInput"
                  v-model="editingDocName"
                  class="doc-name-input"
                  @blur="handleBlur(doc.id)"
                  @keydown.enter="handleEnter(doc.id, $event)"
                  @keydown.esc="cancelEdit"
                />
              </div>
              <div 
                v-else 
                class="doc-name-container"
              >
                <a-tooltip :content="getDocName(doc)">
                  <span class="doc-name">{{ getDocName(doc) }}</span>
                </a-tooltip>
                <a-tooltip :content="t('doc.editNameHint')">
                  <span class="edit-icon" v-html="icon['edit'].body" @click.stop="startEdit(doc)"></span>
                </a-tooltip>
              </div>
              
              <div class="doc-meta" v-if="doc.updatedAt">
                {{ formatUpdateTime(doc.updatedAt) }}
              </div>
              <div class="doc-meta" v-else>{{ t('doc.recentlyEdited') }}</div>
            </div>
            
            <!-- Actions -->
            <div class="doc-actions">
              <!-- Current tag removed for cleaner design -->
              <!-- 当前文档不可删除：禁用按钮并给出提示 -->
              <template v-if="doc.id === currentDocumentId">
                <a-tooltip :content="t('doc.currentDocProtected')">
                  <span
                    v-html="icon['delete'].body"
                    class="delete-btn is-disabled ml-2 text-[var(--color-text-4)] cursor-not-allowed"
                    @click.stop="() => Message.warning(t('doc.currentDocProtected'))"
                    aria-disabled="true"
                  ></span>
                </a-tooltip>
              </template>
              <template v-else>
                <a-popconfirm
                  type="warning"
                  position="left"
                  :ok-text="isTrashView ? t('doc.permanentDelete') : t('doc.softDelete')"
                  :cancel-text="t('common.cancel')"
                  :ok-button-props="getOkBtnProps(doc.id)"
                  @popup-visible-change="onDeleteConfirmVisibleChange"
                  @ok="isTrashView ? emit('permanent-delete', doc.id) : emit('delete', doc.id)"
                >
                  <template #content>
                    <div class="min-w-[260px]">
                      <div>
                        <span>{{ t('doc.confirmDeleteTitle', { name: doc.name }) }}</span>
                        <span class="popconfirm-danger-note" v-if="isTrashView"> {{ t('doc.confirmPermanentDeleteMessage') }}</span>
                        <span class="text-[var(--color-text-3)]" v-else> {{ t('doc.confirmSoftDeleteMessage') }}</span>
                      </div>
                      <div v-if="isTrashView" class="mt-2 text-[var(--color-text-3)]">{{ t('doc.confirmInputLabel') }}</div>
                      <a-input
                        v-if="isTrashView"
                        v-model="deleteConfirmInput[doc.id]"
                        size="small"
                        :placeholder="t('doc.confirmInputPlaceholder', { name: doc.name })"
                      />
                    </div>
                  </template>
                  <span
                    v-html="icon['delete'].body"
                    class="delete-btn ml-2 text-[var(--color-text-3)] cursor-pointer"
                    @click.stop="() => {}"
                  ></span>
                </a-popconfirm>
                <span
                  v-if="isTrashView"
                  v-html="icon['restore'].body"
                  class="ml-2 text-[var(--color-text-3)] cursor-pointer"
                  @click.stop="emit('restore', doc.id)"
                ></span>
              </template>
            </div>
            </div>
          </div>
        </div>

        <a-divider style="margin: 8px 0" />
        <!-- 固定底部操作区：新建文档按钮始终可见 -->
        <div class="drawer-fixed-footer" ref="footerRef">
          <a-dropdown
            trigger="click"
            position="top"
            :style="{ width: typeof computedWidth === 'number' ? `${computedWidth-5}px` : computedWidth }"
            @select="(v) => emit('create', v)"
            :popup-container="footerRef"
          >
            <a-button type="primary" long size="small">
              {{ t('doc.newDocument') }}
              <span class="ml-2 flex items-center w-4 h-4" v-html="icon['arrow-down'].body"></span>
            </a-button>
            <template #content>
              <a-doption value="doc">
                <template #icon>
                  <span class="flex items-center justify-center w-4 h-4 doc-type-icon" v-html="icon['word'].body"></span>
                </template>
                <span class="min-w-[120px]">{{ t('doc.newDocument') || '新建文档' }}</span>
              </a-doption>
              <a-doption value="sheet">
            <template #icon>
              <span class="flex items-center justify-center w-4 h-4 doc-type-icon" v-html="icon['excel'].body"></span>
            </template>
            <span class="min-w-[120px]">{{ t('doc.newSheet') || '新建表格' }}</span>
          </a-doption>
          <a-doption value="mindmap">
            <template #icon>
              <span class="flex items-center justify-center w-4 h-4 doc-type-icon" v-html="iconMindmapColor"></span>
            </template>
            <span class="min-w-[120px]">{{ t('doc.newMindmap') || '新建思维导图' }}</span>
          </a-doption>
          <a-doption value="slide">
            <template #icon>
              <span class="flex items-center justify-center w-4 h-4 doc-type-icon" v-html="iconSlideColor"></span>
            </template>
            <span class="min-w-[120px]">{{ t('doc.newSlide') || '新建幻灯片' }}</span>
          </a-doption>
        </template>
      </a-dropdown>
    </div>
  </div>
</a-spin>
</a-drawer>
</template>

<script setup>
import { computed, reactive, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message, Modal } from '@arco-design/web-vue'
import icon from '@/utils/icon'
import { useEditorHeader } from '@/components/editor-header/useEditorHeader'

const { t } = useI18n()
const { iconMindmapColor, iconSlideColor } = useEditorHeader()

const getDocName = (doc) => {
  if (!doc.name || 
      doc.name === 'untitledMindmap' || 
      doc.name === 'untitledSheet' || 
      doc.name === 'untitledDoc' ||
      doc.name === 'untitledSlide' ||
      doc.name.trim() === 'untitledMindmap' ||
      doc.name.toLowerCase() === 'untitledmindmap') {
     if (doc.type === 'mindmap') return t('doc.untitledMindmap')
     if (doc.type === 'sheet') return t('doc.untitledSheet')
     if (doc.type === 'slide') return t('doc.untitledSlide')
     return t('doc.untitledDoc')
  }
  return doc.name
}

const footerRef = ref(null)

const formatUpdateTime = (timestamp) => {
  if (!timestamp) return t('doc.recentlyEdited')
  const now = Date.now()
  const time = new Date(timestamp).getTime()
  const diff = now - time
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return t('doc.time.justNow')
  if (diff < hour) return t('doc.time.minutesAgo', { n: Math.floor(diff / minute) })
  if (diff < day) return t('doc.time.hoursAgo', { n: Math.floor(diff / hour) })
  if (diff < 2 * day) return t('doc.time.yesterday')
  if (diff < 7 * day) return t('doc.time.daysAgo', { n: Math.floor(diff / day) })
  return new Date(timestamp).toLocaleDateString()
}

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  documents: { type: Array, default: () => [] },
  currentDocumentId: { type: String, default: '' },
  placement: { type: String, default: 'left' },
  width: { type: [Number, String], default: 280 },
  isTrashView: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  isMobile: { type: Boolean, default: false },
  scope: { type: String, default: 'mine' },
  stats: { type: Object, default: () => ({}) },
  isAdmin: { type: Boolean, default: false }  // 是否是管理员
})

const emit = defineEmits([
  'update:modelValue',
  'toggle-trash',
  'select',
  'create',
  'delete',
  'restore',
  'permanent-delete',
  'rename',
  'change-scope',
  'batch-delete'
])

// v-model 映射
const visible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

// 动态宽度：移动端更宽，桌面沿用传入值
const computedWidth = computed(() => {
  if (props.isMobile) return '88vw'
  return props.width
})

// 搜索与过滤
const searchText = ref('')
const filteredDocuments = computed(() => {
  const list = Array.isArray(props.documents) ? props.documents : []
  const keyword = (searchText.value || '').trim().toLowerCase()
  if (!keyword) return list
  return list.filter(
    d => ((d?.name || '').toLowerCase().includes(keyword)) || ((d?.id || '').toLowerCase().includes(keyword))
  )
})

const groupedDocuments = computed(() => {
  const list = [...(filteredDocuments.value || [])]
  list.sort((a, b) => (new Date(b?.updatedAt || 0).getTime()) - (new Date(a?.updatedAt || 0).getTime()))
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  const groups = { today: [], yesterday: [], earlier: [] }
  list.forEach(d => {
    const ts = new Date(d?.updatedAt || 0).getTime()
    if (!ts) {
      groups.earlier.push(d)
      return
    }
    const diff = now - ts
    if (diff < day) groups.today.push(d)
    else if (diff < 2 * day) groups.yesterday.push(d)
    else groups.earlier.push(d)
  })
  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([key, items]) => ({ label: t(`doc.group.${key}`), items }))
})

// Inline editing state
const editingDocId = ref(null)
const editingDocName = ref('')
const editInput = ref(null)
const shouldIgnoreBlur = ref(false) // 标记是否应该忽略blur事件

// Batch delete state
const batchMode = ref(false)
const selectedIds = ref(new Set())

// Batch mode controls
const toggleBatchMode = () => {
  batchMode.value = !batchMode.value
  if (!batchMode.value) {
    selectedIds.value.clear()
  }
}

const toggleDocSelection = (docId) => {
  if (selectedIds.value.has(docId)) {
    selectedIds.value.delete(docId)
  } else {
    selectedIds.value.add(docId)
  }
  // Trigger reactivity
  selectedIds.value = new Set(selectedIds.value)
}

const isAllSelected = computed(() => {
  const selectableDocs = filteredDocuments.value.filter(d => d.id !== props.currentDocumentId)
  return selectableDocs.length > 0 && selectedIds.value.size === selectableDocs.length
})

const isSomeSelected = computed(() => {
  return selectedIds.value.size > 0
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value.clear()
  } else {
    const selectableDocs = filteredDocuments.value.filter(d => d.id !== props.currentDocumentId)
    selectedIds.value = new Set(selectableDocs.map(d => d.id))
  }
}

const handleBatchDelete = () => {
  if (selectedIds.value.size === 0) return

  const count = selectedIds.value.size
  const ids = Array.from(selectedIds.value)

  // 使用Arco Design的Modal确认
  Modal.warning({
    title: t('doc.batchDelete'),
    content: t('doc.batchDeleteConfirm', { count }),
    okText: t('doc.delete'),
    cancelText: t('cancel'),
    onOk: () => {
      emit('batch-delete', ids)
      selectedIds.value.clear()
      batchMode.value = false
    }
  })
}

// Handle document click
const handleDocClick = (docId, docType) => {
  console.log('[DocumentsDrawer] handleDocClick clicked:', docId, docType)
  // In batch mode, toggle selection instead of navigating
  if (batchMode.value && !props.isTrashView) {
    toggleDocSelection(docId)
    return
  }

  // Only navigate if not editing
  if (editingDocId.value !== docId) {
    console.log('[DocumentsDrawer] Emitting select event:', docId, docType)
    emit('select', docId, docType)
  } else {
    console.log('[DocumentsDrawer] Document is being edited, skipping navigation')
  }
}

// Start inline editing
const startEdit = (doc) => {
    editingDocId.value = doc.id
    editingDocName.value = doc.name || t('doc.untitled')
    
    // Focus input on next tick
    nextTick(() => {
    if (editInput.value && editInput.value.length > 0) {
      const input = editInput.value[editInput.value.length - 1]
      input?.focus()
      input?.select()
    }
  })
}

// Handle Enter key
const handleEnter = (docId, event) => {
  event.preventDefault()
  shouldIgnoreBlur.value = true // 标记忽略即将到来的blur事件
  
  // 直接从input元素获取当前值，避免v-model同步延迟
  const inputElement = event.target
  const currentValue = inputElement?.value || editingDocName.value
  
  console.log('[handleEnter] 当前输入值:', currentValue)
  console.log('[handleEnter] editingDocName.value:', editingDocName.value)
  
  // 确保editingDocName已更新为最新值
  editingDocName.value = currentValue
  
  // 使用nextTick确保v-model已同步
  nextTick(() => {
    // Enter键保存但不关闭编辑状态，让用户确认修改
    saveDocName(docId, false)
  })
}

// Handle blur event
const handleBlur = (docId) => {
  console.log('[handleBlur] shouldIgnoreBlur:', shouldIgnoreBlur.value)
  console.log('[handleBlur] editingDocName.value:', editingDocName.value)
  
  // 如果是Enter触发的blur，忽略它
  if (shouldIgnoreBlur.value) {
    console.log('[handleBlur] 忽略blur事件（Enter已处理）')
    shouldIgnoreBlur.value = false
    return
  }
  
  // 检查是否还在编辑状态（可能已被Enter处理并清空）
  if (!editingDocId.value) {
    console.log('[handleBlur] 编辑已结束，跳过blur处理')
    return
  }
  
  console.log('[handleBlur] 正常blur，保存并关闭编辑')
  // 延迟执行，确保v-model已更新
  nextTick(() => {
    // Blur时保存并关闭编辑状态
    saveDocName(docId, true)
  })
}

// Save document name
const saveDocName = async (docId, shouldCloseEdit = false) => {
  const newName = editingDocName.value.trim()
  
  console.log('[saveDocName] 开始保存')
  console.log('[saveDocName] docId:', docId)
  console.log('[saveDocName] editingDocName.value:', editingDocName.value)
  console.log('[saveDocName] newName (trimmed):', newName)
  console.log('[saveDocName] shouldCloseEdit:', shouldCloseEdit)
  
  if (!newName) {
    console.log('[saveDocName] 名称为空，取消编辑')
    Message.warning(t('doc.nameEmptyWarning'))
    cancelEdit()
    return
  }
  
  const doc = props.documents.find(d => d.id === docId)
  console.log('[saveDocName] 找到的文档:', doc)
  
  if (doc && newName !== doc.name) {
    console.log('[saveDocName] 名称已改变，发送rename事件')
    // 发送rename事件，并传入成功回调
    emit('rename', docId, newName, () => {
      // API成功后，关闭编辑状态
      console.log('[saveDocName] 重命名成功，关闭编辑')
      cancelEdit()
    })
  } else {
    console.log('[saveDocName] 名称未改变，跳过保存')
    // 名称未改变时，根据参数决定是否关闭
    if (shouldCloseEdit) {
      cancelEdit()
    }
  }
}

// Cancel editing
const cancelEdit = () => {
  console.log('[cancelEdit] 取消编辑')
  editingDocId.value = null
  editingDocName.value = ''
  // 重要：不要重置shouldIgnoreBlur，让它保持到blur事件处理器检查
  // shouldIgnoreBlur.value = false
}

// 删除确认输入与校验
const deleteConfirmInput = reactive({})
const getDocNameById = id => {
  const d = (Array.isArray(props.documents) ? props.documents : []).find(x => x.id === id)
  return d?.name || ''
}
const isConfirmAllowed = id => {
  const name = getDocNameById(id)
  const inputVal = (deleteConfirmInput[id] || '').trim()
  return inputVal === name
}
const getOkBtnProps = id => ({ status: 'danger', disabled: props.isTrashView ? !isConfirmAllowed(id) : false })

// 弹窗可见性变化：移动端震动 + 默认焦点指向取消
const onDeleteConfirmVisibleChange = v => {
  try {
    if (v && props.isMobile && 'vibrate' in navigator) {
      navigator.vibrate(12)
    }
    if (v) {
      nextTick(() => {
        const popconfs = document.querySelectorAll('.arco-popconfirm')
        const pop = popconfs[popconfs.length - 1]
        if (pop) {
          const btns = Array.from(pop.querySelectorAll('button'))
          const cancelText = (t && typeof t === 'function') ? t('cancel') : '取消'
          const cancelBtn = btns.find(b => (b.textContent || '').trim() === cancelText)
          cancelBtn && cancelBtn.focus()
        }
      })
    }
  } catch { /* ignore */ }
}
</script>

<style scoped>
.mobile-docs-drawer :deep(.arco-drawer-header) {
  padding: 10px 12px;
  font-weight: 600;
}
.mobile-docs-drawer :deep(.arco-drawer) {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  height: 100svh;
  max-height: 100svh;
}
.mobile-docs-drawer :deep(.arco-drawer-body) {
  /* 保证抽屉内容在加载时至少覆盖视窗高度 */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* 支持移动端浏览器可见视口（避免地址栏占位影响） */
  min-height: 100svh;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.doc-type-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
.scope-switch { display: flex; align-items: center; margin: 8px 0; }
.scope-switch :deep(.arco-tabs) {
  width: 100%;
  padding: 4px;
  border-radius: 12px;
  background: var(--color-fill-1, #f9fafb);
  border: 1px solid var(--color-border-2, #e5e7eb);
}
.scope-switch :deep(.arco-tabs-nav) {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
.scope-switch :deep(.arco-tabs-nav-operations) { display: none; }
.scope-switch :deep(.arco-tabs-nav-operations) {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
.scope-switch :deep(.arco-tabs-nav-operations-hidden),
.scope-switch :deep(.arco-tabs-nav-ink),
.scope-switch :deep(.arco-tabs-nav-prev),
.scope-switch :deep(.arco-tabs-nav-next) {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
.scope-switch :deep(.arco-tabs-nav-tab){
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.scope-switch :deep(.arco-tabs-nav-tab-list){
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.scope-switch :deep(.arco-tabs-nav-prev),
.scope-switch :deep(.arco-tabs-nav-next) {
  display: none !important;
}
.scope-switch :deep(.arco-tabs-nav-button),
.scope-switch :deep(.arco-tabs-nav-button-left),
.scope-switch :deep(.arco-tabs-nav-button-right),
.scope-switch :deep(.arco-icon-hover),
.scope-switch :deep(.arco-icon-hover.arco-icon-hover-disabled),
.scope-switch :deep(.arco-icon.arco-icon-left),
.scope-switch :deep(.arco-icon.arco-icon-right) {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
/* 文档作用域切换 Tab 样式 */
.scope-switch :deep(.arco-tabs-nav) {
  padding: 0 !important;
  background: transparent;
}
.scope-switch :deep(.arco-tabs-nav-scroll) {
  margin: 0 !important;
  overflow: visible;
  width: 100%;
  flex: 1 1 auto;
}
.mobile-docs-drawer :deep(.arco-tabs-nav-prev),
.mobile-docs-drawer :deep(.arco-tabs-nav-next),
.mobile-docs-drawer :deep(.arco-tabs-nav-operations),
.mobile-docs-drawer :deep(.arco-tabs-nav-operations-hidden),
.mobile-docs-drawer :deep(.arco-tabs-nav-ink) {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
.scope-switch :deep(.arco-tabs-nav-list) {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px;
}
/* 管理员模式下显示3个tab */
.scope-switch .scope-container-admin :deep(.arco-tabs-nav-list) {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.scope-switch :deep(.arco-tabs-tab) {
  margin: 0;
  padding: 0;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.scope-switch :deep(.arco-tabs-tab-title) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  min-width: 0;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--color-text-2, #86909c);
  transition: all 0.2s ease;
}
.scope-switch :deep(.arco-tabs-tab:hover .arco-tabs-tab-title) {
  color: var(--color-text-1, #1d2129);
}
.scope-switch :deep(.arco-tabs-tab-active) {
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.scope-switch :deep(.arco-tabs-tab-active .arco-tabs-tab-title) {
  color: var(--color-primary, #3b82f6);
  font-weight: 600;
}
.scope-switch :deep(.arco-tabs-content) {
  display: none;
}

/* 让 Spin 覆盖整个抽屉内容并居中指示器 */
.drawer-loading {
  height: 100%;
  width:100%
}
.mobile-docs-drawer :deep(.drawer-loading) {
  display: block;
  position: relative;
  height: 100%;
  min-height: 100vh;
  min-height: 100svh;
}
.mobile-docs-drawer :deep(.drawer-loading .arco-spin-mask) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.docs-list-scroll {
  flex: 1 1 auto;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  min-height: auto;
  max-height: none;
  padding-bottom: 64px; /* 给底部固定区留空间 */
  padding-right: 6px; /* 为滚动条预留空间，避免遮挡操作按钮 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
  scrollbar-gutter: stable; /* 现代浏览器，稳定滚动条槽位 */
}
.docs-list-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.docs-list-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
}
.docs-list-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
}
.docs-list-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.doc-group { margin-bottom: 12px; }
.doc-group-title {
  font-size: 12px;
  color: var(--color-text-3);
  padding: 6px 8px;
}
.empty-state { padding: 16px; }
.mobile-docs-drawer .docs-list-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.mobile-docs-drawer .docs-list-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
}
.mobile-docs-drawer .docs-list-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
}
.mobile-docs-drawer .docs-list-scroll::-webkit-scrollbar-track {
  background: transparent;
}

/* Batch mode bar */
.batch-mode-bar {
  padding: 8px 12px;
  background: var(--color-fill-2, #f2f3f5);
  border-radius: 6px;
  border: 1px solid var(--color-border-2, #e5e7eb);
}

.mobile-docs-drawer .doc-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--color-border-2, #e5e7eb);
  background: var(--color-bg-1, #fff);
}

.mobile-docs-drawer .doc-item:hover {
  background: var(--color-fill-1, #f9fafb);
  border-color: var(--color-border-3, #d1d5db);
}

.mobile-docs-drawer .doc-item.doc-item-active {
  background: var(--color-primary-light-1, #eff6ff);
  border-color: var(--color-primary, #3b82f6);
}

.mobile-docs-drawer .doc-item.doc-item-selected {
  background: var(--color-primary-light-2, #dbeafe);
  border-color: var(--color-primary-light-4, #93c5fd);
}

.mobile-docs-drawer .doc-checkbox {
  flex-shrink: 0;
}

.mobile-docs-drawer .doc-icon {
  font-size: 22px;
  flex-shrink: 0;
  line-height: 1;
}

.mobile-docs-drawer .doc-info {
  flex: 1;
  min-width: 0;
  margin-right: 8px;
}

.mobile-docs-drawer .doc-name-container {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  padding: 2px 4px;
  margin: -2px -4px;
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.mobile-docs-drawer .doc-name-container:hover .edit-icon {
  opacity: 1;
  color: var(--color-primary, #3b82f6);
}

.mobile-docs-drawer .doc-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1, #1f2937);
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.mobile-docs-drawer .edit-icon {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  color: var(--color-text-3, #9ca3af);
  opacity: 0;
  transition: opacity 0.15s ease, color 0.15s ease;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.mobile-docs-drawer .doc-name-edit {
  width: 100%;
}

.mobile-docs-drawer .doc-name-input {
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1, #1f2937);
  padding: 2px 6px;
  border: 1.5px solid var(--color-primary, #3b82f6);
  border-radius: 4px;
  background: var(--color-bg-1, #fff);
  outline: none;
  line-height: 1.4;
  box-shadow: 0 0 0 3px var(--color-primary-light-2, rgba(59, 130, 246, 0.1));
}

.mobile-docs-drawer .doc-name-input:focus {
  border-color: var(--color-primary, #3b82f6);
}

.mobile-docs-drawer .doc-item.doc-item-active .doc-name {
  color: var(--color-primary, #3b82f6);
  font-weight: 600;
}

.mobile-docs-drawer .doc-meta {
  font-size: 12px;
  color: var(--color-text-3, #9ca3af);
  margin-top: 2px;
  line-height: 1.3;
}

.mobile-docs-drawer .doc-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.mobile-docs-drawer .delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  color: var(--color-text-3);
  transition: background-color .15s ease, color .15s ease, transform .15s ease;
}
.mobile-docs-drawer .delete-btn:hover {
  /* 悬停：采用中性灰底，避免过早传递“危险”语义 */
  background: var(--color-fill-2);
  color: var(--color-text-2);
}
.mobile-docs-drawer .delete-btn:focus-visible {
  /* 键盘可访问：使用主题主色令牌 */
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
.mobile-docs-drawer .delete-btn.is-disabled,
.mobile-docs-drawer .delete-btn[aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
}
.mobile-docs-drawer .delete-btn:active {
  transform: scale(0.95);
}

.drawer-fixed-footer {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg-2, #fff);
  padding: 8px 0;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.04);
  z-index: 2;
}
</style>