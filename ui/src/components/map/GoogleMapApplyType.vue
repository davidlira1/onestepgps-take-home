<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  map: google.maps.Map
  mapType: string
}>()

watch(
  () => props.mapType,
  (mapType) => {
    props.map.setMapTypeId(mapType === 'satellite' ? 'hybrid' : 'roadmap')
  },
  { immediate: true },
)
</script>

<template>
  <!-- Map type is updated on the Map object, not the DOM. -->
</template>
