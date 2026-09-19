import { ref, watch } from 'vue'
import { getPreferences } from '@/api/preferences'
import type { Preferences } from '@/types/preferences'
import { applyTheme } from '@/utils/applyTheme'

export function usePreferences() {
  const preferences = ref<Preferences | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

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

  return { preferences, loading, error, load }
}
