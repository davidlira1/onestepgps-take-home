export type Device = {
  id: string
  name: string
  make: string
  model: string
  active_state: string
  online: boolean
  drive_status: string
  latitude: number | null
  longitude: number | null
  heading: number
  speed_kmh: number
  last_seen_at: string | null
}

export type DeviceApi = {
  listDevices: () => Promise<Device[]>
}
