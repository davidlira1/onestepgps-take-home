import type { Device, DeviceApi } from '@/types/device'

const laLocations = [
  { name: 'Ford Lightning', make: 'Ford', model: 'F-150 Lightning', lat: 34.0522, lng: -118.2437, status: 'driving', speed: 45, heading: 90 },
  { name: 'Ford Transit', make: 'Ford', model: 'Transit-250', lat: 34.0195, lng: -118.4912, status: 'stopped', speed: 0, heading: 180 },
  { name: 'Chevy Silverado', make: 'Chevrolet', model: 'Silverado 1500', lat: 33.7701, lng: -118.1937, status: 'off', speed: 0, heading: 270 },
  { name: 'Toyota 4Runner', make: 'Toyota', model: '4Runner TRD', lat: 34.1478, lng: -118.1445, status: 'driving', speed: 52, heading: 45 },
  { name: 'Freightliner M2', make: 'Freightliner', model: 'M2 106', lat: 34.1808, lng: -118.3090, status: 'driving', speed: 38, heading: 315 },
  { name: 'Honda Civic', make: 'Honda', model: 'Civic', lat: 33.6846, lng: -117.8265, status: 'idle', speed: 0, heading: 0 },
  { name: 'Tesla Model 3', make: 'Tesla', model: 'Model 3', lat: 32.7157, lng: -117.1611, status: 'driving', speed: 41, heading: 200 },
  { name: 'Ram 2500', make: 'Ram', model: '2500', lat: 34.5794, lng: -118.1165, status: 'off', speed: 0, heading: 90 },
  { name: 'Mercedes Sprinter', make: 'Mercedes-Benz', model: 'Sprinter', lat: 34.2746, lng: -119.2290, status: 'stopped', speed: 0, heading: 135 },
  { name: 'Nissan NV', make: 'Nissan', model: 'NV 2500', lat: 33.9533, lng: -117.3962, status: 'driving', speed: 29, heading: 270 },
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
