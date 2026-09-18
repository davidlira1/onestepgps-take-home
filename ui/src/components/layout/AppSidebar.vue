<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceListItem from '@/components/devices/DeviceListItem.vue'

defineProps<{
  devices: Device[]
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <aside class="sidebar">
    <p v-if="loading" class="message">Loading devices…</p>
    <p v-else-if="error" class="message error">{{ error }}</p>
    <ul v-else class="device-list">
      <DeviceListItem
        v-for="device in devices"
        :key="device.id"
        :device="device"
        @select="emit('select', $event)"
      />
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  overflow-y: auto;
  background: var(--surface);
  border-right: 1px solid var(--border);
}

.device-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.message {
  margin: 0;
  padding: 16px 20px;
}

.error {
  color: #b42318;
}
</style>
