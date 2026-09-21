<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useDevices } from '@/composables/useDevices'
import { usePreferences } from '@/composables/usePreferences'
import PreferencesModal from '@/components/preferences/PreferencesModal.vue'
import { defaultPreferences } from '@/types/preferences'
import { applyTheme } from '@/utils/applyTheme'
import { sortDevices } from '@/utils/sortDevices'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppMapPane from './AppMapPane.vue'
import AppFooter from './AppFooter.vue'
import AppToast from './AppToast.vue'

const { devices, loading, error, lastUpdated, refreshError, load: loadDevices } =
  useDevices()
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
const currentSort = ref(defaultPreferences().sort)
const userChoseSort = ref(false)
const currentTheme = ref(defaultPreferences().theme)
const userChoseTheme = ref(false)
const currentHiddenDeviceIds = ref<string[]>([...defaultPreferences().hidden_device_ids])
const userChoseHidden = ref(false)
const currentMapType = ref(defaultPreferences().map_type)
const userChoseMapType = ref(false)
const toastMessage = ref<string | null>(null)
let sortSaveId = 0
let mapSaveId = 0

watch(
  () => preferences.value.sort,
  (sort) => {
    if (!userChoseSort.value) {
      currentSort.value = sort
    }
  },
)

watch(
  () => preferences.value.theme,
  (theme) => {
    if (!userChoseTheme.value) {
      currentTheme.value = theme
    }
  },
)

watch(
  () => preferences.value.hidden_device_ids,
  (hiddenIds) => {
    if (!userChoseHidden.value) {
      currentHiddenDeviceIds.value = [...hiddenIds]
    }
  },
)

watch(
  () => preferences.value.map_type,
  (mapType) => {
    if (!userChoseMapType.value) {
      currentMapType.value = mapType
    }
  },
)

watch(currentTheme, (theme) => applyTheme(theme), { immediate: true })

const displayedDevices = computed(() => {
  const hidden = new Set(currentHiddenDeviceIds.value)
  const visible = devices.value.filter((device) => !hidden.has(device.id))
  const query = searchQuery.value.trim().toLowerCase()
  const filtered = query
    ? visible.filter((device) => device.name.toLowerCase().includes(query))
    : visible
  return sortDevices(filtered, currentSort.value)
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

async function savePreferences(changes: { theme: string; hidden_device_ids: string[] }) {
  userChoseTheme.value = true
  userChoseHidden.value = true
  currentTheme.value = changes.theme
  currentHiddenDeviceIds.value = [...changes.hidden_device_ids]
  preferencesOpen.value = false
  toastMessage.value = null
  try {
    await updatePreferences(changes)
  } catch {
    toastMessage.value = "Preferences changed, but couldn't save them."
  }
}

async function changeMapType(mapType: string) {
  userChoseMapType.value = true
  currentMapType.value = mapType
  toastMessage.value = null
  const requestId = ++mapSaveId
  try {
    await updatePreferences({ map_type: mapType })
    if (requestId === mapSaveId) {
      toastMessage.value = null
    }
  } catch {
    if (requestId === mapSaveId) {
      toastMessage.value = "Map changed, but couldn't save your preference."
    }
  }
}

async function changeSort(sort: string) {
  userChoseSort.value = true
  currentSort.value = sort
  toastMessage.value = null
  const requestId = ++sortSaveId
  try {
    await updatePreferences({ sort })
    if (requestId === sortSaveId) {
      toastMessage.value = null
    }
  } catch {
    if (requestId === sortSaveId) {
      toastMessage.value = "Sort changed, but couldn't save your preference."
    }
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
        :devices="displayedDevices"
        :loading="loading"
        :error="error"
        :current-sort="currentSort"
        @select="selectDevice"
        @update:current-sort="changeSort"
      />
      <AppMapPane
        :devices="displayedDevices"
        :selected-device-id="selectedDeviceId"
        :focus-nonce="focusNonce"
        :map-type="currentMapType"
        @update:map-type="changeMapType"
      />
    </div>
    <AppFooter :last-updated="lastUpdated" :refresh-error="refreshError" />
    <PreferencesModal
      v-if="preferencesOpen"
      :theme="currentTheme"
      :hidden-device-ids="currentHiddenDeviceIds"
      :devices="devices"
      :saving="saving"
      :save-error="saveError"
      @close="closePreferences"
      @save="savePreferences"
    />
    <AppToast
      v-if="toastMessage"
      :message="toastMessage"
      @close="toastMessage = null"
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
