import type { Device, DeviceApi } from '@/types/device'

export const httpDeviceApi: DeviceApi = {
  async listDevices(): Promise<Device[]> {
    const res = await fetch('/api/devices')
    if (!res.ok) {
      throw new Error(`Failed to load devices: ${res.status}`)
    }
    return res.json() as Promise<Device[]>
  },
}
