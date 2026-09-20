import type { Device } from '@/types/device'

export function sortDevices(devices: Device[], sort: string): Device[] {
  return [...devices].sort((a, b) => compareDevices(a, b, sort))
}

function compareDevices(a: Device, b: Device, sort: string): number {
  switch (sort) {
    case 'name_desc':
      return compareName(b, a)
    case 'last_seen_desc':
      return compareLastSeenDesc(a, b)
    case 'name_asc':
    default:
      return compareName(a, b)
  }
}

function compareName(a: Device, b: Device): number {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

function lastSeenTime(iso: string | null): number | null {
  if (!iso) {
    return null
  }
  const time = Date.parse(iso)
  return Number.isNaN(time) ? null : time
}

function compareLastSeenDesc(a: Device, b: Device): number {
  const aTime = lastSeenTime(a.last_seen_at)
  const bTime = lastSeenTime(b.last_seen_at)
  if (aTime == null && bTime == null) {
    return 0
  }
  if (aTime == null) {
    return 1
  }
  if (bTime == null) {
    return -1
  }
  return bTime - aTime
}
