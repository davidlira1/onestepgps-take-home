export function applyTheme(theme: string | null | undefined) {
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light'
}
