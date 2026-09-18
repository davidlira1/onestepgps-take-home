<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { loadGoogleMaps } from '@/lib/loadGoogleMaps'

const props = defineProps<{
  apiKey: string
  mapConfig: google.maps.MapOptions
}>()

const mapEl = ref<HTMLDivElement | null>(null)
const mapsApi = shallowRef<typeof google | null>(null)
const map = shallowRef<google.maps.Map | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  if (!props.apiKey) {
    error.value = 'Missing Google Maps API key'
    return
  }

  if (!mapEl.value) {
    return
  }

  try {
    const g = await loadGoogleMaps(props.apiKey)
    mapsApi.value = g
    map.value = new g.maps.Map(mapEl.value, props.mapConfig)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Google Maps failed to load'
  }
})
</script>

<template>
  <div class="loader">
    <p v-if="error" class="error">{{ error }}</p>
    <div ref="mapEl" class="google-map" />
    <slot v-if="mapsApi && map" :google="mapsApi" :map="map" />
  </div>
</template>

<style scoped>
.loader,
.google-map {
  width: 100%;
  height: 100%;
}

.loader {
  position: relative;
}

.error {
  position: absolute;
  z-index: 1;
  margin: 16px;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--surface);
  color: #b42318;
  font-size: 13px;
}
</style>
