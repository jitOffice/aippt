<template>
  <div class="coming-soon-overlay">
    <slot>
      <icon-lock :size="size" />
    </slot>
  </div>
</template>

<script setup>
import { IconLock } from '@arco-design/web-vue/es/icon'

defineProps({
  size: {
    type: Number,
    default: 20
  }
})
</script>

<style scoped>
.coming-soon-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 2;
  border: 2px solid #ffffff;
}
</style>