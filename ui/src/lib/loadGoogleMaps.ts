let loadPromise: Promise<typeof google> | null = null

declare global {
  interface Window {
    __onestepGoogleMapsInit?: () => void
  }
}

export function loadGoogleMaps(apiKey: string): Promise<typeof google> {
  if (window.google?.maps) {
    return Promise.resolve(window.google)
  }

  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise((resolve, reject) => {
    window.__onestepGoogleMapsInit = () => {
      delete window.__onestepGoogleMapsInit
      resolve(window.google)
    }

    const params = new URLSearchParams({
      key: apiKey,
      v: 'weekly',
      loading: 'async',
      callback: '__onestepGoogleMapsInit',
    })

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`
    script.async = true
    script.onerror = () => {
      loadPromise = null
      delete window.__onestepGoogleMapsInit
      reject(new Error('Google Maps failed to load'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}
