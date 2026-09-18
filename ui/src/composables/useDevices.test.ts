import { describe, it, expect, vi } from 'vitest'
import { deviceApi } from '@/api/devices'
import { useDevices } from './useDevices'
import type { Device } from '@/types/device'

describe('useDevices', () => {
  it('loads devices and manages loading state on success', async () => {
    const mockList: Device[] = [
      {
        id: 'device-1',
        name: 'Ford Lightning',
        make: 'Ford',
        model: 'F-150',
        active_state: 'active',
        online: true,
        drive_status: 'driving',
        latitude: 34.0522,
        longitude: -118.2437,
        heading: 90,
        speed_kmh: 45,
        last_seen_at: '2026-09-17T00:00:00.000Z',
      },
    ]

    vi.spyOn(deviceApi, 'listDevices').mockResolvedValueOnce(mockList)

    const { devices, loading, error, load } = useDevices()
    expect(devices.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()

    const promise = load()
    expect(loading.value).toBe(true)

    await promise
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(devices.value).toHaveLength(1)
    expect(devices.value[0]?.name).toBe('Ford Lightning')
  })

  it('captures error message when API fails', async () => {
    vi.spyOn(deviceApi, 'listDevices').mockRejectedValueOnce(new Error('500 Internal Server Error'))

    const { devices, loading, error, load } = useDevices()
    expect(devices.value).toEqual([])

    await load()

    expect(loading.value).toBe(false)
    expect(error.value).toBe('500 Internal Server Error')
    expect(devices.value).toEqual([])
  })
})
