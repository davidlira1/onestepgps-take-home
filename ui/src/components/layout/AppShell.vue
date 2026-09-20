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
const currentSort = ref(defaultPreferences().sort)
const userChoseSort = ref(false)
const currentTheme = ref(defaultPreferences().theme)
const userChoseTheme = ref(false)
const toastMessage = ref<string | null>(null)
let sortSaveId = 0

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

watch(currentTheme, (theme) => applyTheme(theme), { immediate: true })

const displayedDevices = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const filtered = query
    ? devices.value.filter((device) => device.name.toLowerCase().includes(query))
    : devices.value
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

async function saveTheme(theme: string) {
  userChoseTheme.value = true
  currentTheme.value = theme
  preferencesOpen.value = false
  toastMessage.value = null
  try {
    await updatePreferences({ theme })
  } catch {
    toastMessage.value = "Theme changed, but couldn't save your preference."
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
      />
    </div>
    <AppFooter />
    <PreferencesModal
      v-if="preferencesOpen"
      :theme="currentTheme"
      :saving="saving"
      :save-error="saveError"
      @close="closePreferences"
      @save="saveTheme"
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
