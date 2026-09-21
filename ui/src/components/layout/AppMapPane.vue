<script setup lang="ts">
import { computed } from 'vue'
import type { Device } from '@/types/device'
import GoogleMapApplyType from '@/components/map/GoogleMapApplyType.vue'
import GoogleMapFitBounds from '@/components/map/GoogleMapFitBounds.vue'
import GoogleMapFocus from '@/components/map/GoogleMapFocus.vue'
import GoogleMapLoader from '@/components/map/GoogleMapLoader.vue'
import GoogleMapMarker from '@/components/map/GoogleMapMarker.vue'

const props = defineProps<{
  devices: Device[]
  selectedDeviceId: string | null
  focusNonce: number
  mapType: string
}>()

const emit = defineEmits<{
  'update:mapType': [value: string]
}>()

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''

const mapConfig = computed<google.maps.MapOptions>(() => ({
  center: { lat: 34.05, lng: -118.25 },
  zoom: 9,
  mapTypeControl: false,
  mapTypeId: props.mapType === 'satellite' ? 'hybrid' : 'roadmap',
}))

function chooseMapType(next: 'roadmap' | 'satellite') {
  if (next === props.mapType) {
    return
  }
  emit('update:mapType', next)
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

const locatedDeviceIds = computed(() => locatedDevices.value.map((device) => device.id))

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
          :heading="device.heading"
          :online="device.online"
        />
        <GoogleMapFitBounds
          :google="google"
          :map="map"
          :points="mapPoints"
          :device-ids="locatedDeviceIds"
        />
        <GoogleMapFocus :map="map" :target="focusTarget" />
        <GoogleMapApplyType :map="map" :map-type="mapType" />
        <div class="map-type" role="group" aria-label="Map type">
          <button
            type="button"
            :class="{ active: mapType !== 'satellite' }"
            :aria-pressed="mapType !== 'satellite'"
            @click="chooseMapType('roadmap')"
          >
            Map
          </button>
          <button
            type="button"
            :class="{ active: mapType === 'satellite' }"
            :aria-pressed="mapType === 'satellite'"
            @click="chooseMapType('satellite')"
          >
            Satellite
          </button>
        </div>
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

.map-type {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  display: flex;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: 0 1px 4px rgb(0 0 0 / 18%);
}

.map-type button {
  margin: 0;
  padding: 7px 12px;
  border: 0;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.map-type button + button {
  border-left: 1px solid var(--border);
}

.map-type button.active {
  background: var(--surface);
  color: var(--text);
}

.map-type button:hover {
  background: var(--hover);
}
</style>
