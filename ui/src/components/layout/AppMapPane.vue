<script setup lang="ts">
import type { Device } from '@/types/device'
import GoogleMapLoader from '@/components/map/GoogleMapLoader.vue'

defineProps<{
  devices: Device[]
}>()

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

const mapConfig: google.maps.MapOptions = {
  center: { lat: 34.05, lng: -118.25 },
  zoom: 9,
}
</script>

<template>
  <section class="map-pane">
    <GoogleMapLoader :api-key="apiKey" :map-config="mapConfig" />
  </section>
</template>

<style scoped>
.map-pane {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
</style>
