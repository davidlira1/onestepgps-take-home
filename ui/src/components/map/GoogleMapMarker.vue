<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

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

onUnmounted(() => {
  marker?.setMap(null)
})
</script>

<template>
  <!-- Pin is attached to the Map object, not the DOM. -->
</template>
