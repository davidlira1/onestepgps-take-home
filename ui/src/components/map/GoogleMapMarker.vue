<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  google: typeof google
  map: google.maps.Map
  lat: number
  lng: number
  title: string
}>()

let marker: google.maps.Marker | null = null

onMounted(() => {
  marker = new props.google.maps.Marker({
    position: { lat: props.lat, lng: props.lng },
    map: props.map,
    title: props.title,
  })
})

watch(
  () => [props.lat, props.lng] as const,
  ([lat, lng]) => {
    marker?.setPosition({ lat, lng })
  },
)

watch(
  () => props.title,
  (title) => {
    marker?.setTitle(title)
  },
)

onUnmounted(() => {
  marker?.setMap(null)
})
</script>

<template>
  <!-- Pin is attached to the Map object, not the DOM. -->
</template>
