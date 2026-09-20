<script setup lang="ts">
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="toast" role="status">
    <p class="message">{{ message }}</p>
    <button type="button" class="close" aria-label="Dismiss" @click="emit('close')">
      ×
    </button>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 20;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: min(360px, calc(100vw - 32px));
  padding: 12px 12px 12px 14px;
  border: 1px solid #f1b4b4;
  border-radius: 10px;
  background: #fef2f2;
  color: #9b1c1c;
  box-shadow: 0 10px 28px rgb(0 0 0 / 16%);
}

:global(html[data-theme='dark']) .toast {
  border-color: #7f2d2d;
  background: #3f1a1a;
  color: #fecaca;
}

.message {
  margin: 0;
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.close:hover {
  background: rgb(155 28 28 / 10%);
}
</style>
