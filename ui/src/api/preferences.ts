import type { PreferenceChanges, Preferences } from '@/types/preferences'

export async function getPreferences(): Promise<Preferences> {
  const res = await fetch('/api/preferences')
  if (!res.ok) {
    throw new Error(`Failed to load preferences: ${res.status}`)
  }
  return res.json() as Promise<Preferences>
}

export async function patchPreferences(payload: PreferenceChanges & {
  version: number
}): Promise<Preferences> {
  const res = await fetch('/api/preferences', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`Failed to save preferences: ${res.status}`)
  }
  return res.json() as Promise<Preferences>
}
