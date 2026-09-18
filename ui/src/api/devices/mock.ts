import type { Device, DeviceApi } from '@/types/device'

const laLocations = [
  { name: 'Ford Lightning', make: 'Ford', model: 'F-150 Lightning', lat: 34.0522, lng: -118.2437, status: 'driving', speed: 45, heading: 90 },
  { name: 'Ford Transit', make: 'Ford', model: 'Transit-250', lat: 34.0195, lng: -118.4912, status: 'stopped', speed: 0, heading: 180 },
  { name: 'Chevy Silverado', make: 'Chevrolet', model: 'Silverado 1500', lat: 33.7701, lng: -118.1937, status: 'off', speed: 0, heading: 270 },
  { name: 'Toyota 4Runner', make: 'Toyota', model: '4Runner TRD', lat: 34.1478, lng: -118.1445, status: 'driving', speed: 52, heading: 45 },
  { name: 'Freightliner M2', make: 'Freightliner', model: 'M2 106', lat: 34.1808, lng: -118.3090, status: 'driving', speed: 38, heading: 315 },
]

export const mockDevices: Device[] = []
for (let i = 0; i < laLocations.length; i++) {
  const loc = laLocations[i]!
  mockDevices.push({
    id: `mock-${i + 1}`,
    name: loc.name,
    make: loc.make,
    model: loc.model,
    active_state: loc.status === 'off' ? 'inactive' : 'active',
    online: loc.status !== 'off',
    drive_status: loc.status,
    latitude: loc.lat,
    longitude: loc.lng,
    heading: loc.heading,
    speed_kmh: loc.speed,
    last_seen_at: new Date(Date.now() - i * 60_000).toISOString(),
  })
}

export const mockDeviceApi: DeviceApi = {
  async listDevices(): Promise<Device[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockDevices
  },
}
