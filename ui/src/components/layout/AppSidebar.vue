<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceListItem from '@/components/devices/DeviceListItem.vue'

defineProps<{
  devices: Device[]
  loading: boolean
  error: string | null
  searchQuery: string
}>()

const emit = defineEmits<{
  select: [id: string]
  'update:searchQuery': [value: string]
}>()
</script>

<template>
  <aside class="sidebar">
    <div class="search">
      <input
        type="search"
        class="search-input"
        placeholder="Search vehicles"
        :value="searchQuery"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <p v-if="loading" class="message">Loading devices…</p>
    <p v-else-if="error" class="message error">{{ error }}</p>
    <p v-else-if="searchQuery.trim() && devices.length === 0" class="message">
      No vehicles found
    </p>
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

.search {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.search-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font: inherit;
  font-size: 14px;
}

.search-input::placeholder {
  color: var(--muted);
}

.search-input:focus {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
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
