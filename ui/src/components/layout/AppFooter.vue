<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  lastUpdated: Date | null
  refreshError: string | null
}>()

const lastUpdatedLabel = computed(() => {
  if (!props.lastUpdated) {
    return 'unknown'
  }
  return props.lastUpdated.toLocaleTimeString()
})
</script>

<template>
  <footer class="footer">
    <p v-if="refreshError" class="status">Update failed · Retrying...</p>
    <p v-else class="status">Updated {{ lastUpdatedLabel }}</p>
    <p class="brand">OneStep GPS</p>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 20px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 13px;
}

.status,
.brand {
  margin: 0;
}
</style>
