<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  google: typeof google
  map: google.maps.Map
  points: { lat: number; lng: number }[]
  deviceIds: string[]
}>()

function fit() {
  const points = props.points
  if (points.length === 0) {
    return
  }

  if (points.length === 1) {
    const point = points[0]!
    props.map.setCenter(point)
    props.map.setZoom(12)
    return
  }

  const bounds = new props.google.maps.LatLngBounds()
  for (const point of points) {
    bounds.extend(point)
  }
  props.map.fitBounds(bounds, 48)
}

watch(
  () => [...props.deviceIds].sort().join(','),
  fit,
  { immediate: true },
)
</script>

<template>
  <!-- Camera is updated on the Map object, not the DOM. -->
</template>
