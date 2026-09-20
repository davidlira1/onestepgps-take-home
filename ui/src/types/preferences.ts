export type Preferences = {
  version: number
  sort: string
  hidden_device_ids: string[]
  map_type: string
  theme: string
}

export type PreferenceChanges = Partial<Omit<Preferences, 'version'>>

export function defaultPreferences(): Preferences {
  return {
    version: 1,
    sort: 'name_asc',
    hidden_device_ids: [],
    map_type: 'roadmap',
    theme: 'light',
  }
}
