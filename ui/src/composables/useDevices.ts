import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import { deviceApi } from '@/api/devices'
import type { Device } from '@/types/device'

export const DEVICE_REFRESH_INTERVAL_MS = 5_000

export function useDevices() {
  const devices = ref<Device[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const refreshError = ref<string | null>(null)
  let inFlight = false

  async function fetchDevices(kind: 'load' | 'refresh') {
    if (inFlight) {
      return
    }
    inFlight = true
    if (kind === 'load') {
      loading.value = true
      error.value = null
    }
    try {
      devices.value = await deviceApi.listDevices()
      lastUpdated.value = new Date()
      refreshError.value = null
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load devices'
      if (kind === 'load') {
        error.value = message
      } else {
        refreshError.value = message
      }
    } finally {
      inFlight = false
      if (kind === 'load') {
        loading.value = false
      }
    }
  }

  function load() {
    return fetchDevices('load')
  }

  function refresh() {
    return fetchDevices('refresh')
  }

  if (getCurrentInstance()) {
    let timer: number | undefined
    onMounted(() => {
      timer = window.setInterval(() => {
        void refresh()
      }, DEVICE_REFRESH_INTERVAL_MS)
    })
    onUnmounted(() => {
      if (timer !== undefined) {
        window.clearInterval(timer)
      }
    })
  }

  return { devices, loading, error, lastUpdated, refreshError, load, refresh }
}
