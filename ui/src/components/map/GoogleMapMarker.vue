<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { deviceMarkerSymbol } from './deviceMarkerSymbol'

const props = defineProps<{
  google: typeof google
  map: google.maps.Map
  lat: number
  lng: number
  title: string
  heading: number
  online: boolean
}>()

let marker: google.maps.Marker | null = null

function icon() {
  return deviceMarkerSymbol(props.google, props.heading, props.online)
}

onMounted(() => {
  marker = new props.google.maps.Marker({
    position: { lat: props.lat, lng: props.lng },
    map: props.map,
    title: props.title,
    icon: icon(),
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

watch(
  () => [props.heading, props.online] as const,
  () => {
    marker?.setIcon(icon())
  },
)

onUnmounted(() => {
  marker?.setMap(null)
})
</script>

<template>
  <!-- Pin is attached to the Map object, not the DOM. -->
</template>
