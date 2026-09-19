import { ref, watch } from 'vue'
import { getPreferences, patchPreferences } from '@/api/preferences'
import type { PreferenceChanges, Preferences } from '@/types/preferences'
import { applyTheme } from '@/utils/applyTheme'

export function usePreferences() {
  const preferences = ref<Preferences | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saving = ref(false)
  const saveError = ref<string | null>(null)

  watch(preferences, (prefs) => applyTheme(prefs?.theme), { immediate: true })

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

  async function updatePreferences(changes: PreferenceChanges) {
    if (!preferences.value) {
      saveError.value = 'Preferences not loaded'
      throw new Error(saveError.value)
    }
    saving.value = true
    saveError.value = null
    try {
      preferences.value = await patchPreferences({
        version: preferences.value.version,
        ...changes,
      })
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : 'Failed to save preferences'
      throw err
    } finally {
      saving.value = false
    }
  }

  return { preferences, loading, error, load, saving, saveError, updatePreferences }
}
