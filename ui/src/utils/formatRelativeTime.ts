const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' })

export function formatRelativeTime(iso: string | null, now = Date.now()): string {
  if (!iso) {
    return 'unknown'
  }

  const then = Date.parse(iso)
  if (Number.isNaN(then)) {
    return 'unknown'
  }

  const seconds = Math.round((now - then) / 1000)
  const abs = Math.abs(seconds)

  if (abs < 60) {
    return rtf.format(-seconds, 'second')
  }
  if (abs < 3600) {
    return rtf.format(-Math.round(seconds / 60), 'minute')
  }
  if (abs < 86400) {
    return rtf.format(-Math.round(seconds / 3600), 'hour')
  }
  return rtf.format(-Math.round(seconds / 86400), 'day')
}
