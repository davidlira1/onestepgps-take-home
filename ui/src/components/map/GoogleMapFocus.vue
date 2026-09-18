<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  map: google.maps.Map
  target: { lat: number; lng: number; nonce?: number } | null
}>()

watch(
  () => props.target,
  (target) => {
    if (!target) {
      return
    }
    props.map.panTo(target)
    props.map.setZoom(14)
  },
)
</script>

<template>
  <!-- Camera is updated on the Map object, not the DOM. -->
</template>
