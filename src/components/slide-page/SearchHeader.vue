<template>
  <div class="search-header">
    <div class="header-row">
      <a-dropdown trigger="click" position="bl" :popup-visible="dropdownVisible" @popup-visible-change="handleDropdownChange">
        <div class="header-title" @click="toggleDropdown">
          <div class="title-content">
            <div class="title-icon">
              <component :is="currentIcon" :size="24" />
            </div>
            <span>{{ currentTitle }}</span>
          </div>
          <icon-down :size="18" />
        </div>
        <template #content>
          <a-doption
            v-for="option in dropdownOptions"
            :key="option.id"
            @click="selectOption(option)"
          >
            <div class="dropdown-option">
              <icon-check v-if="selectedOption?.id === option.id" :size="16" class="check-icon" />
              <span :class="{ 'active-option': selectedOption?.id === option.id }">
                {{ option.name }}
              </span>
            </div>
          </a-doption>
        </template>
      </a-dropdown>
      
      <a-button class="close-btn" type="text" @click="$emit('close')">
        <icon-close :size="22" />
      </a-button>
    </div>
    
    <div class="search-row">
      <a-input
        v-model="searchValue"
        size="large"
        :placeholder="placeholder"
        allow-clear
        @input="handleSearchInput"
      >
        <template #prefix>
          <icon-search :size="18" />
        </template>
      </a-input>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  Dropdown as ADropdown, 
  Doption as ADoption, 
  Button as AButton, 
  Input as AInput 
} from '@arco-design/web-vue'
import { 
  IconDown, 
  IconCheck, 
  IconClose, 
  IconSearch 
} from '@arco-design/web-vue/es/icon'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object],
    default: null
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  dropdownOptions: {
    type: Array,
    default: () => []
  },
  selectedOption: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'search', 'option-select'])

const { t } = useI18n()

// State
const searchValue = ref('')
const dropdownVisible = ref(false)

// Computed
const currentTitle = computed(() => {
  return props.selectedOption?.name || props.title || 'Search'
})

const currentIcon = computed(() => {
  return props.selectedOption?.icon || props.icon || IconSearch
})

// Methods
const handleSearchInput = (value) => {
  emit('search', value)
}

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}

const handleDropdownChange = (visible) => {
  dropdownVisible.value = visible
}

const selectOption = (option) => {
  emit('option-select', option)
  dropdownVisible.value = false
}
</script>

<style scoped>
.search-header {
  padding: 24px 28px;
  background: white;
  border-bottom: 1px solid #e8ebf7;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  padding: 14px 18px;
  border-radius: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f8f9ff;
  border: 2px solid #e5e7eb;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  justify-content: space-between;
  flex: 1;
}

.header-title:hover {
  background: #f0f2ff;
  border-color: #6366f1;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.18);
}

.title-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.search-row {
  width: 100%;
}

.search-row :deep(.arco-input-wrapper) {
  background: white;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-row :deep(.arco-input-wrapper:hover) {
  border-color: #a5b4fc;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.12);
}

.search-row :deep(.arco-input-wrapper:focus-within) {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15), 0 4px 12px rgba(99, 102, 241, 0.2);
}

.search-row :deep(.arco-input) {
  font-size: 15px;
  padding: 12px 16px;
  font-weight: 450;
}

.close-btn {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.dropdown-option:hover {
  background: #f3f4f6;
}

.check-icon {
  color: #6366f1;
  flex-shrink: 0;
}

.active-option {
  color: #6366f1;
  font-weight: 600;
}

/* Arco Design Dropdown Styles */
:deep(.arco-dropdown) {
  min-width: 240px !important;
  background: #ffffff !important;
}

:deep(.arco-dropdown-list) {
  background: #ffffff !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  padding: 8px !important;
  min-width: 240px !important;
}

:deep(.arco-dropdown-option) {
  background: transparent !important;
  color: #1f2937 !important;
  padding: 0 !important;
  margin: 2px 0 !important;
  border-radius: 8px !important;
}

:deep(.arco-dropdown-option:hover) {
  background: #f5f5f5 !important;
}

:deep(.arco-dropdown-option-content) {
  padding: 0 !important;
}
</style>