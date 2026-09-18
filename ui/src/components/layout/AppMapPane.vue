<script setup lang="ts">
import { computed } from 'vue'
import type { Device } from '@/types/device'
import GoogleMapFitBounds from '@/components/map/GoogleMapFitBounds.vue'
import GoogleMapFocus from '@/components/map/GoogleMapFocus.vue'
import GoogleMapLoader from '@/components/map/GoogleMapLoader.vue'
import GoogleMapMarker from '@/components/map/GoogleMapMarker.vue'

const props = defineProps<{
  devices: Device[]
  selectedDeviceId: string | null
  focusNonce: number
}>()

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

const mapConfig: google.maps.MapOptions = {
  center: { lat: 34.05, lng: -118.25 },
  zoom: 9,
}

const locatedDevices = computed(() =>
  props.devices.filter(
    (device): device is Device & { latitude: number; longitude: number } =>
      device.latitude != null && device.longitude != null,
  ),
)

const mapPoints = computed(() =>
  locatedDevices.value.map((device) => ({
    lat: device.latitude,
    lng: device.longitude,
  })),
)

const focusTarget = computed(() => {
  if (!props.selectedDeviceId) {
    return null
  }
  const device = locatedDevices.value.find((d) => d.id === props.selectedDeviceId)
  if (!device) {
    return null
  }
  return { lat: device.latitude, lng: device.longitude, nonce: props.focusNonce }
})
</script>

<template>
  <section class="map-pane">
    <GoogleMapLoader :api-key="apiKey" :map-config="mapConfig">
      <template #default="{ google, map }">
        <GoogleMapMarker
          v-for="device in locatedDevices"
          :key="device.id"
          :google="google"
          :map="map"
          :lat="device.latitude"
          :lng="device.longitude"
          :title="device.name"
        />
        <GoogleMapFitBounds :google="google" :map="map" :points="mapPoints" />
        <GoogleMapFocus :map="map" :target="focusTarget" />
      </template>
    </GoogleMapLoader>
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
