<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Device } from '@/types/device'

const props = defineProps<{
  theme: string
  hiddenDeviceIds: string[]
  devices: Device[]
  saving: boolean
  saveError: string | null
}>()

const emit = defineEmits<{
  close: []
  save: [changes: { theme: string; hidden_device_ids: string[] }]
}>()

const draftTheme = ref(props.theme)
const draftHiddenDeviceIds = ref([...props.hiddenDeviceIds])
const vehicleSearch = ref('')
const vehiclesOpen = ref(false)

const hiddenCount = computed(
  () => props.devices.filter((device) => draftHiddenDeviceIds.value.includes(device.id)).length,
)
const visibleCount = computed(() => props.devices.length - hiddenCount.value)

const searchedVehicles = computed(() => {
  const query = vehicleSearch.value.trim().toLowerCase()
  if (!query) return props.devices
  return props.devices.filter((device) => device.name.toLowerCase().includes(query))
})

function selectTheme(theme: string) {
  draftTheme.value = theme
}

function isVisible(id: string) {
  return !draftHiddenDeviceIds.value.includes(id)
}

function toggleVisibility(id: string, visible: boolean) {
  if (visible) {
    draftHiddenDeviceIds.value = draftHiddenDeviceIds.value.filter((hiddenId) => hiddenId !== id)
    return
  }
  if (!draftHiddenDeviceIds.value.includes(id)) {
    draftHiddenDeviceIds.value = [...draftHiddenDeviceIds.value, id]
  }
}

function showAll() {
  draftHiddenDeviceIds.value = []
}

function toggleVehicles() {
  vehiclesOpen.value = !vehiclesOpen.value
}

function save() {
  emit('save', {
    theme: draftTheme.value,
    hidden_device_ids: [...draftHiddenDeviceIds.value],
  })
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="dialog" role="dialog" aria-labelledby="prefs-title" aria-modal="true">
      <header class="header">
        <h2 id="prefs-title" class="title">Preferences</h2>
        <button type="button" class="close" aria-label="Close" @click="emit('close')">×</button>
      </header>

      <section class="section">
        <p class="section-label">Appearance</p>

        <p class="field-label">Theme</p>
        <div class="themes">
          <button
            type="button"
            class="theme-card"
            :class="{ selected: draftTheme === 'light' }"
            @click="selectTheme('light')"
          >
            <span class="theme-icon" aria-hidden="true">☀</span>
            Light
          </button>
          <button
            type="button"
            class="theme-card"
            :class="{ selected: draftTheme === 'dark' }"
            @click="selectTheme('dark')"
          >
            <span class="theme-icon" aria-hidden="true">☾</span>
            Dark
          </button>
        </div>
      </section>

      <hr class="divider" />

      <section class="section">
        <p class="section-label">Vehicles</p>

        <button
          type="button"
          class="visibility-toggle"
          :aria-expanded="vehiclesOpen"
          @click="toggleVehicles"
        >
          <span class="field-label">Vehicle visibility</span>
          <span class="chevron" :class="{ open: vehiclesOpen }" aria-hidden="true"></span>
        </button>
        <p class="helper">Choose which vehicles appear in the fleet.</p>

        <template v-if="vehiclesOpen">
          <div class="summary">
            <p class="counts">{{ visibleCount }} visible · {{ hiddenCount }} hidden</p>
            <button
              type="button"
              class="show-all"
              :disabled="hiddenCount === 0"
              @click="showAll"
            >
              Show all
            </button>
          </div>

          <input
            type="search"
            class="search-input"
            placeholder="Search vehicles..."
            :value="vehicleSearch"
            @input="vehicleSearch = ($event.target as HTMLInputElement).value"
          />

          <p v-if="vehicleSearch.trim() && searchedVehicles.length === 0" class="empty">
            No vehicles found
          </p>
          <ul v-else class="vehicle-list">
            <li v-for="device in searchedVehicles" :key="device.id" class="vehicle-row">
              <label class="vehicle">
                <input
                  type="checkbox"
                  :checked="isVisible(device.id)"
                  @change="toggleVisibility(device.id, ($event.target as HTMLInputElement).checked)"
                />
                <span class="vehicle-name">{{ device.name }}</span>
                <span class="connectivity" :class="{ online: device.online }">
                  <span class="dot" aria-hidden="true"></span>
                  {{ device.online ? 'Online' : 'Offline' }}
                </span>
              </label>
            </li>
          </ul>
        </template>
      </section>

      <footer class="actions">
        <button type="button" class="btn" @click="emit('close')">Cancel</button>
        <button type="button" class="btn primary" :disabled="saving" @click="save">
          {{ saving ? 'Saving…' : 'Save' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 40%);
}

.dialog {
  width: min(520px, calc(100vw - 32px));
  padding: 20px 20px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 12px 32px rgb(0 0 0 / 18%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.close:hover {
  background: var(--hover);
}

.section {
  margin-bottom: 20px;
}

.section-label {
  margin: 0 0 14px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.field-label {
  margin: 0 0 8px;
  font-size: 14px;
}

.visibility-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.visibility-toggle .field-label {
  margin: 0;
}

.chevron {
  width: 7px;
  height: 7px;
  border-right: 1.5px solid var(--muted);
  border-bottom: 1.5px solid var(--muted);
  transform: rotate(45deg);
  transition: transform 0.15s ease;
}

.chevron.open {
  transform: translateY(2px) rotate(-135deg);
}

.helper {
  margin: 6px 0 12px;
  color: var(--muted);
  font-size: 13px;
}

.themes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.theme-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.theme-card:hover {
  background: var(--hover);
}

.theme-card.selected {
  border-color: var(--text);
  background: var(--hover);
}

.theme-icon {
  font-size: 16px;
}

.divider {
  margin: 0 0 20px;
  border: none;
  border-top: 1px solid var(--border);
}

.search-input {
  width: 100%;
  margin-bottom: 12px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font: inherit;
  font-size: 14px;
}

.search-input::placeholder {
  color: var(--muted);
}

.search-input:focus {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.counts {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.show-all {
  padding: 0;
  border: none;
  background: none;
  color: #2563eb;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.show-all:disabled {
  color: var(--muted);
  cursor: default;
}

.vehicle-list {
  max-height: 260px;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 8px;
  list-style: none;
}

.vehicle-row + .vehicle-row {
  border-top: 1px solid var(--border);
}

.vehicle {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
}

.vehicle:hover {
  background: var(--hover);
}

.vehicle-name {
  font-size: 14px;
}

.connectivity {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
}

.connectivity.online {
  color: #15803d;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #9ca3af;
}

.connectivity.online .dot {
  background: #22c55e;
}

.empty {
  margin: 0;
  padding: 16px 12px;
  color: var(--muted);
  font-size: 13px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  padding: 7px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.btn:hover:not(:disabled) {
  background: var(--hover);
}

.btn.primary {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
}

.btn.primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn:disabled {
  opacity: 0.65;
  cursor: default;
}
</style>
