import { describe, it, expect } from 'vitest'
import { formatRelativeTime } from './formatRelativeTime'

describe('formatRelativeTime', () => {
  const now = Date.parse('2026-09-17T18:00:00.000Z')

  const tests = [
    { name: 'null is unknown', iso: null, want: 'unknown' },
    { name: 'invalid date is unknown', iso: 'not-a-date', want: 'unknown' },
    { name: '12 seconds ago', iso: '2026-09-17T17:59:48.000Z', want: '12 seconds ago' },
    { name: '2 minutes ago', iso: '2026-09-17T17:58:00.000Z', want: '2 minutes ago' },
    { name: '1 hour ago', iso: '2026-09-17T17:00:00.000Z', want: '1 hour ago' },
    { name: '1 day ago', iso: '2026-09-16T18:00:00.000Z', want: '1 day ago' },
  ]

  for (const tt of tests) {
    it(tt.name, () => {
      expect(formatRelativeTime(tt.iso, now)).toBe(tt.want)
    })
  }
})
