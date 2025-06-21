import { writable } from 'svelte/store'

export type Theme = 'white' | 'dark' | 'full-crt' | 'fake-crt' | 'slate' | 'zinc' | 'emerald' | 'rose'

function createThemeStore() {
  // Get saved theme from localStorage or default to 'full-crt'
  const savedTheme = typeof window !== 'undefined' 
    ? (localStorage.getItem('mem8-theme') as Theme) || 'full-crt'
    : 'full-crt'
  
  const { subscribe, set, update } = writable<Theme>(savedTheme)
  
  return {
    subscribe,
    set: (theme: Theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mem8-theme', theme)
        document.documentElement.setAttribute('data-theme', theme)
      }
      set(theme)
    },
    update
  }
}

export const theme = createThemeStore()

// Initialize theme on page load
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('mem8-theme') as Theme || 'full-crt'
  document.documentElement.setAttribute('data-theme', savedTheme)
}