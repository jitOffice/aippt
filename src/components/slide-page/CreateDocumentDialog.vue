<template>
  <!-- 桌面端弹窗 -->
  <a-modal
    v-if="!isMobile"
    v-model:visible="visibleProxy"
    @ok="onConfirm"
    @cancel="onCancel"
    :title="dialogTitle"
    :ok-text="t('common.confirm')"
    :cancel-text="t('common.cancel')"
    :ok-loading="loading"
  >
    <a-form :model="{ name: nameProxy }" layout="vertical">
      <a-form-item :label="t('doc.nameLabel')" required>
        <a-input
          v-model="nameProxy"
          :placeholder="t('doc.namePlaceholder')"
          @keyup.enter="onConfirm"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 移动端抽屉 -->
  <a-drawer
    v-else
    v-model:visible="visibleProxy"
    placement="bottom"
    :title="dialogTitle"
    :mask-closable="true"
    :esc-to-close="true"
    unmount-on-close
    class="mobile-create-drawer"
  >
    <div class="p-3">
      <a-form :model="{ name: nameProxy }" layout="vertical">
        <a-form-item :label="t('doc.nameLabel')" required>
          <a-input
            v-model="nameProxy"
            :placeholder="t('doc.namePlaceholder')"
            allow-clear
            @keyup.enter="onConfirm"
          />
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2 px-3 py-2">
        <a-button size="small" @click="onCancel">{{ t('common.cancel') }}</a-button>
        <a-button type="primary" size="small" :loading="loading" @click="onConfirm">{{ t('common.confirm') }}</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: { type: Boolean, default: false },
  isMobile: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  name: { type: String, default: '' },
  type: { type: String, default: 'doc' },
})

const emit = defineEmits(['update:visible', 'update:name', 'confirm', 'cancel'])

const dialogTitle = computed(() => {
  if (props.type === 'sheet') return t('doc.type.sheet') || t('doc.newSheet') || '新建表格'
  if (props.type === 'mindmap') return t('doc.newMindmap') || '新建思维导图'
  if (props.type === 'slide') return t('doc.newSlide') || '新建幻灯片'
  return t('doc.type.word') || t('doc.newDocument') || '新建文档'
})

const visibleProxy = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const nameProxy = computed({
  get: () => props.name,
  set: (val) => emit('update:name', val),
})

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
  emit('update:visible', false)
}
</script>