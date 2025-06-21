<script lang="ts">
  import { theme } from '$lib/stores/theme'
  import type { Theme } from '$lib/stores/theme'
  
  let currentTheme = $state<Theme>('full-crt')
  
  $effect(() => {
    theme.subscribe(value => {
      currentTheme = value
    })
  })
  
  function cycleTheme() {
    const themes: Theme[] = ['white', 'dark', 'slate', 'zinc', 'emerald', 'rose', 'fake-crt', 'full-crt']
    const currentIndex = themes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    theme.set(themes[nextIndex])
  }
  
  const themeLabels = {
    'white': 'White',
    'dark': 'Dark',
    'slate': 'Slate',
    'zinc': 'Zinc',
    'emerald': 'Emerald',
    'rose': 'Rose',
    'fake-crt': 'Fake CRT',
    'full-crt': 'Full CRT'
  }
  
  const themeIcons = {
    'white': '☀️',
    'dark': '🌙',
    'slate': '🌊',
    'zinc': '⚫',
    'emerald': '💚',
    'rose': '🌹',
    'fake-crt': '🖥️',
    'full-crt': '📺'
  }
</script>

<button 
  class="theme-toggle"
  onclick={cycleTheme}
  title="Click to change theme"
>
  <span class="theme-icon">{themeIcons[currentTheme]}</span>
  <span class="theme-label">{themeLabels[currentTheme]}</span>
</button>

<style>
  .theme-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 2px solid var(--border-primary);
    padding: 0.75rem 1.25rem;
    font-family: var(--font-body);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0;
    min-width: 140px;
    justify-content: center;
  }
  
  /* CRT theme styling */
  :global([data-theme="full-crt"]) .theme-toggle,
  :global([data-theme="fake-crt"]) .theme-toggle {
    box-shadow: var(--glow-green);
  }
  
  :global([data-theme="full-crt"]) .theme-toggle {
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { box-shadow: var(--glow-green); }
    50% { box-shadow: var(--glow-cyan); }
  }
  
  .theme-toggle:hover {
    transform: translateY(-2px);
    background: var(--border-primary);
    color: var(--bg-primary);
  }
  
  .theme-icon {
    font-size: 1.2rem;
  }
  
  .theme-label {
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  /* White theme specific */
  :global([data-theme="white"]) .theme-toggle {
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  :global([data-theme="white"]) .theme-toggle:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  
  /* Dark theme specific */
  :global([data-theme="dark"]) .theme-toggle {
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  
  :global([data-theme="dark"]) .theme-toggle:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  }
</style>