import { describe, it, expect, vi } from 'vitest'
import * as preferencesApi from '@/api/preferences'
import { usePreferences } from './usePreferences'
import { defaultPreferences, type Preferences } from '@/types/preferences'

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
    expect(preferences.value).toEqual(defaultPreferences())
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
    expect(preferences.value).toEqual(defaultPreferences())

    await load()

    expect(loading.value).toBe(false)
    expect(error.value).toBe('500 Internal Server Error')
    expect(preferences.value).toEqual(defaultPreferences())
  })

  it('replaces preferences with the server response after a successful theme update', async () => {
    const current: Preferences = {
      version: 1,
      sort: 'name_asc',
      hidden_device_ids: [],
      map_type: 'roadmap',
      theme: 'light',
    }
    const saved: Preferences = { ...current, version: 2, theme: 'dark' }

    vi.spyOn(preferencesApi, 'getPreferences').mockResolvedValueOnce(current)
    const patchSpy = vi.spyOn(preferencesApi, 'patchPreferences').mockResolvedValueOnce(saved)

    const { preferences, saving, saveError, load, updatePreferences } = usePreferences()
    await load()

    const promise = updatePreferences({ theme: 'dark' })
    expect(saving.value).toBe(true)

    await promise
    expect(patchSpy).toHaveBeenCalledWith({ version: 1, theme: 'dark' })
    expect(preferences.value).toEqual(saved)
    expect(saving.value).toBe(false)
    expect(saveError.value).toBeNull()
  })

  it('keeps preferences unchanged and sets saveError when the theme update fails', async () => {
    const current: Preferences = {
      version: 1,
      sort: 'name_asc',
      hidden_device_ids: [],
      map_type: 'roadmap',
      theme: 'light',
    }

    vi.spyOn(preferencesApi, 'getPreferences').mockResolvedValueOnce(current)
    vi.spyOn(preferencesApi, 'patchPreferences').mockRejectedValueOnce(
      new Error('Failed to save preferences: 409'),
    )

    const { preferences, saving, saveError, load, updatePreferences } = usePreferences()
    await load()

    await expect(updatePreferences({ theme: 'dark' })).rejects.toThrow(
      'Failed to save preferences: 409',
    )

    expect(preferences.value).toEqual(current)
    expect(saving.value).toBe(false)
    expect(saveError.value).toBe('Failed to save preferences: 409')
  })

  it('ignores a stale update that completes after a newer one', async () => {
    const current: Preferences = {
      version: 1,
      sort: 'name_asc',
      hidden_device_ids: [],
      map_type: 'roadmap',
      theme: 'light',
    }
    const firstSaved: Preferences = { ...current, version: 2, sort: 'name_desc' }
    const secondSaved: Preferences = { ...current, version: 3, sort: 'last_seen_desc' }

    let resolveFirst!: (value: Preferences) => void
    const firstResponse = new Promise<Preferences>((resolve) => {
      resolveFirst = resolve
    })

    vi.spyOn(preferencesApi, 'getPreferences').mockResolvedValueOnce(current)
    vi.spyOn(preferencesApi, 'patchPreferences')
      .mockImplementationOnce(() => firstResponse)
      .mockResolvedValueOnce(secondSaved)

    const { preferences, saveError, load, updatePreferences } = usePreferences()
    await load()

    const firstPromise = updatePreferences({ sort: 'name_desc' })
    const secondPromise = updatePreferences({ sort: 'last_seen_desc' })

    await secondPromise
    expect(preferences.value).toEqual(secondSaved)
    expect(saveError.value).toBeNull()

    resolveFirst(firstSaved)
    await firstPromise
    expect(preferences.value).toEqual(secondSaved)
    expect(saveError.value).toBeNull()
  })
})
