import { ref, watch } from 'vue'
import { getPreferences, patchPreferences } from '@/api/preferences'
import {
  defaultPreferences,
  type PreferenceChanges,
  type Preferences,
} from '@/types/preferences'
import { applyTheme } from '@/utils/applyTheme'

export function usePreferences() {
  const preferences = ref<Preferences>(defaultPreferences())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saving = ref(false)
  const saveError = ref<string | null>(null)

  watch(preferences, (prefs) => applyTheme(prefs.theme), { immediate: true })

  async function load() {
    loading.value = true
    error.value = null
    try {
      preferences.value = await getPreferences()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load preferences'
    } finally {
      loading.value = false
    }
  }

  let persistGeneration = 0

  async function updatePreferences(changes: PreferenceChanges) {
    const generation = ++persistGeneration
    saving.value = true
    saveError.value = null
    try {
      const result = await patchPreferences({
        version: preferences.value.version,
        ...changes,
      })
      if (generation !== persistGeneration) {
        return
      }
      preferences.value = result
    } catch (err) {
      if (generation === persistGeneration) {
        saveError.value = err instanceof Error ? err.message : 'Failed to save preferences'
      }
      throw err
    } finally {
      if (generation === persistGeneration) {
        saving.value = false
      }
    }
  }

  return { preferences, loading, error, load, saving, saveError, updatePreferences }
}
