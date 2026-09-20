<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceListItem from '@/components/devices/DeviceListItem.vue'

defineProps<{
  devices: Device[]
  loading: boolean
  error: string | null
  searchQuery: string
  currentSort: string
}>()

const emit = defineEmits<{
  select: [id: string]
  'update:searchQuery': [value: string]
  'update:currentSort': [value: string]
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
    <div class="toolbar">
      <p class="count">
        {{ devices.length === 1 ? '1 vehicle' : `${devices.length} vehicles` }}
      </p>
      <div class="sort-wrap">
        <select
          class="sort"
          aria-label="Sort vehicles"
          :value="currentSort"
          @change="emit('update:currentSort', ($event.target as HTMLSelectElement).value)"
        >
          <option value="name_asc">Name A–Z</option>
          <option value="name_desc">Name Z–A</option>
          <option value="last_seen_desc">Recently updated</option>
        </select>
      </div>
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
  padding: 12px 16px 8px;
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

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 16px 12px;
  border-bottom: 1px solid var(--border);
}

.count {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.sort-wrap {
  position: relative;
}

.sort-wrap::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 10px;
  width: 6px;
  height: 6px;
  border-right: 1.5px solid var(--muted);
  border-bottom: 1.5px solid var(--muted);
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}

.sort {
  appearance: none;
  -webkit-appearance: none;
  max-width: 168px;
  padding: 6px 28px 6px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font: inherit;
  font-size: 13px;
  line-height: 1.3;
  cursor: pointer;
}

.sort:hover {
  background: var(--hover);
}

.sort:focus {
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
