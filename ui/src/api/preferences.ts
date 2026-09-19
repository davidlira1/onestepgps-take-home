import type { Preferences } from '@/types/preferences'

export async function getPreferences(): Promise<Preferences> {
  const res = await fetch('/api/preferences')
  if (!res.ok) {
    throw new Error(`Failed to load preferences: ${res.status}`)
  }
  return res.json() as Promise<Preferences>
}
