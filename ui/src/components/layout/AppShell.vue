<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDevices } from '@/composables/useDevices'
import { usePreferences } from '@/composables/usePreferences'
import PreferencesModal from '@/components/preferences/PreferencesModal.vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppMapPane from './AppMapPane.vue'
import AppFooter from './AppFooter.vue'

const { devices, loading, error, load: loadDevices } = useDevices()
const {
  preferences,
  saving,
  saveError,
  load: loadPreferences,
  updatePreferences,
} = usePreferences()
const selectedDeviceId = ref<string | null>(null)
const focusNonce = ref(0)
const preferencesOpen = ref(false)
const searchQuery = ref('')

const searchedDevices = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return devices.value
  return devices.value.filter((device) =>
    device.name.toLowerCase().includes(query),
  )
})

function selectDevice(id: string) {
  selectedDeviceId.value = id
  focusNonce.value += 1
}

function openPreferences() {
  saveError.value = null
  preferencesOpen.value = true
}

function closePreferences() {
  preferencesOpen.value = false
}

async function saveTheme(theme: string) {
  try {
    await updatePreferences({ theme })
    preferencesOpen.value = false
  } catch {
    // Keep the modal open; saveError is shown inline.
  }
}

onMounted(() => {
  loadDevices()
  loadPreferences()
})
</script>

<template>
  <div class="shell">
    <AppHeader @preferences="openPreferences" />
    <div class="main">
      <AppSidebar
        v-model:search-query="searchQuery"
        :devices="searchedDevices"
        :loading="loading"
        :error="error"
        @select="selectDevice"
      />
      <AppMapPane
        :devices="searchedDevices"
        :selected-device-id="selectedDeviceId"
        :focus-nonce="focusNonce"
      />
    </div>
    <AppFooter />
    <PreferencesModal
      v-if="preferencesOpen"
      :theme="preferences.theme"
      :saving="saving"
      :save-error="saveError"
      @close="closePreferences"
      @save="saveTheme"
    />
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
