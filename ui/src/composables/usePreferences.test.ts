import { describe, it, expect, vi } from 'vitest'
import * as preferencesApi from '@/api/preferences'
import { usePreferences } from './usePreferences'
import type { Preferences } from '@/types/preferences'

vi.mock('@/utils/applyTheme', () => ({
  applyTheme: vi.fn(),
}))

describe('usePreferences', () => {
  it('loads preferences and manages loading state on success', async () => {
    const mockPrefs: Preferences = {
      version: 1,
      sort: 'name_asc',
      hidden_device_ids: [],
      map_type: 'roadmap',
      theme: 'light',
    }

    vi.spyOn(preferencesApi, 'getPreferences').mockResolvedValueOnce(mockPrefs)

    const { preferences, loading, error, load } = usePreferences()
    expect(preferences.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()

    const promise = load()
    expect(loading.value).toBe(true)

    await promise
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(preferences.value).toEqual(mockPrefs)
  })

  it('captures error message when API fails', async () => {
    vi.spyOn(preferencesApi, 'getPreferences').mockRejectedValueOnce(
      new Error('500 Internal Server Error'),
    )

    const { preferences, loading, error, load } = usePreferences()
    expect(preferences.value).toBeNull()

    await load()

    expect(loading.value).toBe(false)
    expect(error.value).toBe('500 Internal Server Error')
    expect(preferences.value).toBeNull()
  })
})
