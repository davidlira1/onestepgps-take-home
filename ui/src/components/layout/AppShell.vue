<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDevices } from '@/composables/useDevices'
import { usePreferences } from '@/composables/usePreferences'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppMapPane from './AppMapPane.vue'
import AppFooter from './AppFooter.vue'

const { devices, loading, error, load: loadDevices } = useDevices()
const { load: loadPreferences } = usePreferences()
const selectedDeviceId = ref<string | null>(null)
const focusNonce = ref(0)

function selectDevice(id: string) {
  selectedDeviceId.value = id
  focusNonce.value += 1
}

onMounted(() => {
  loadDevices()
  loadPreferences()
})
</script>

<template>
  <div class="shell">
    <AppHeader />
    <div class="main">
      <AppSidebar
        :devices="devices"
        :loading="loading"
        :error="error"
        @select="selectDevice"
      />
      <AppMapPane
        :devices="devices"
        :selected-device-id="selectedDeviceId"
        :focus-nonce="focusNonce"
      />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.shell {
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.main {
  display: flex;
  min-height: 0;
}
</style>
