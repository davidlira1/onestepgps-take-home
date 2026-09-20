import { afterEach, describe, it, expect, vi } from 'vitest'
import { deviceApi } from '@/api/devices'
import { useDevices } from './useDevices'
import type { Device } from '@/types/device'

function device(overrides: Partial<Device> = {}): Device {
  return {
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
    ...overrides,
  }
}

describe('useDevices', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads devices and manages loading state on success', async () => {
    const mockList: Device[] = [device()]

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

  it('refreshes devices without toggling loading and records lastUpdated', async () => {
    const first = [device()]
    const second = [device({ speed_kmh: 60 })]
    vi.spyOn(deviceApi, 'listDevices')
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(second)

    const { devices, loading, lastUpdated, refreshError, load, refresh } = useDevices()
    await load()
    const loadedAt = lastUpdated.value
    expect(loadedAt).toBeInstanceOf(Date)
    refreshError.value = 'stale'

    const promise = refresh()
    expect(loading.value).toBe(false)
    await promise

    expect(loading.value).toBe(false)
    expect(refreshError.value).toBeNull()
    expect(lastUpdated.value).toBeInstanceOf(Date)
    expect(lastUpdated.value).not.toBe(loadedAt)
    expect(devices.value[0]?.speed_kmh).toBe(60)
  })

  it('keeps existing devices and sets refreshError when a refresh fails', async () => {
    const first = [device()]
    vi.spyOn(deviceApi, 'listDevices')
      .mockResolvedValueOnce(first)
      .mockRejectedValueOnce(new Error('network down'))

    const { devices, refreshError, load, refresh } = useDevices()
    await load()
    await refresh()

    expect(devices.value).toEqual(first)
    expect(refreshError.value).toBe('network down')
  })

  it('does not start a second device request while one is in flight', async () => {
    let resolveFirst!: (value: Device[]) => void
    const firstRequest = new Promise<Device[]>((resolve) => {
      resolveFirst = resolve
    })
    const listSpy = vi
      .spyOn(deviceApi, 'listDevices')
      .mockImplementationOnce(() => firstRequest)
      .mockResolvedValueOnce([device()])

    const { refresh } = useDevices()
    const first = refresh()
    const second = refresh()
    await second
    expect(listSpy).toHaveBeenCalledTimes(1)

    resolveFirst([device()])
    await first
    expect(listSpy).toHaveBeenCalledTimes(1)
  })
})
