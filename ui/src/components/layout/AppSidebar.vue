<script setup lang="ts">
import type { Device } from '@/types/device'

defineProps<{
  devices: Device[]
  loading: boolean
  error: string | null
}>()
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-inner">
      <p v-if="loading">Loading devices…</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <ul v-else>
        <li v-for="device in devices" :key="device.id">{{ device.name }}</li>
      </ul>
    </div>
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

.sidebar-inner {
  padding: 16px 20px;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li + li {
  margin-top: 8px;
}

.error {
  color: #b42318;
}
</style>
