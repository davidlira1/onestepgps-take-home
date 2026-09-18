<script setup lang="ts">
import type { Device } from '@/types/device'

defineProps<{
  devices: Device[]
}>()
</script>

<template>
  <section class="map-pane">Map</section>
</template>

<style scoped>
.map-pane {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
}
</style>
