import { ref } from 'vue'
import { deviceApi } from '@/api/devices'
import type { Device } from '@/types/device'

export function useDevices() {
  const devices = ref<Device[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      devices.value = await deviceApi.listDevices()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load devices'
    } finally {
      loading.value = false
    }
  }

  return { devices, loading, error, load }
}
