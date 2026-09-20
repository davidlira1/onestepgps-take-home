import { describe, it, expect } from 'vitest'
import type { Device } from '@/types/device'
import { sortDevices } from './sortDevices'

function device(overrides: Partial<Device> & Pick<Device, 'id' | 'name'>): Device {
  return {
    make: 'Ford',
    model: 'F-150',
    active_state: 'active',
    online: true,
    drive_status: 'parked',
    latitude: 34.05,
    longitude: -118.25,
    heading: 0,
    speed_kmh: 0,
    last_seen_at: null,
    ...overrides,
  }
}

describe('sortDevices', () => {
  const zebra = device({ id: '1', name: 'zebra van' })
  const alpha = device({ id: '2', name: 'Alpha Truck' })
  const mid = device({ id: '3', name: 'Mid Bus' })

  it('sorts names case-insensitively A–Z without mutating the input', () => {
    const input = [zebra, alpha, mid]
    expect(sortDevices(input, 'name_asc').map((d) => d.id)).toEqual(['2', '3', '1'])
    expect(input.map((d) => d.id)).toEqual(['1', '2', '3'])
  })

  it('sorts names case-insensitively Z–A', () => {
    expect(sortDevices([alpha, mid, zebra], 'name_desc').map((d) => d.id)).toEqual([
      '1',
      '3',
      '2',
    ])
  })

  it('sorts last_seen_desc with newest first and missing/invalid dates last', () => {
    const newest = device({ id: 'new', name: 'New', last_seen_at: '2026-09-20T12:00:00.000Z' })
    const older = device({ id: 'old', name: 'Old', last_seen_at: '2026-09-19T12:00:00.000Z' })
    const missing = device({ id: 'miss', name: 'Missing', last_seen_at: null })
    const invalid = device({ id: 'bad', name: 'Bad', last_seen_at: 'not-a-date' })

    expect(
      sortDevices([missing, newest, invalid, older], 'last_seen_desc').map((d) => d.id),
    ).toEqual(['new', 'old', 'miss', 'bad'])
  })
})
