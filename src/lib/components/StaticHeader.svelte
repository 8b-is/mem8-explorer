<script lang="ts">
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte'
  import { theme } from '$lib/stores/theme'
  import type { Theme } from '$lib/stores/theme'
  import { 
    detectSystemType, 
    getSystemFonts, 
    mapToAvailableFonts,
    generateFontFaceRules,
    getSystemMessage 
  } from '$lib/utils/fontDetector'
  
  const dispatch = createEventDispatcher<{
    navigate: { demo: string }
    viewDocs: void
  }>()
  
  let systemType = $state('generic')
  let systemMessage = $state('')
  let fontsLoaded = $state(false)
  let mobileMenuOpen = $state(false)
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
  
  onMount(() => {
    // Detect system and load appropriate fonts
    systemType = detectSystemType()
    const systemFonts = getSystemFonts(systemType)
    const availableFonts = mapToAvailableFonts(systemFonts)
    systemMessage = getSystemMessage(systemType)
    
    // Inject font-face rules
    const styleElement = document.createElement('style')
    styleElement.textContent = generateFontFaceRules(availableFonts)
    document.head.appendChild(styleElement)
    
    // Update CSS variables with system-specific fonts
    const root = document.documentElement
    root.style.setProperty('--font-system-primary', `'${systemFonts.primary.replace(/\s+/g, '-')}', var(--font-retro)`)
    root.style.setProperty('--font-system-fallback', `'${systemFonts.fallback.replace(/\s+/g, '-')}', var(--font-body)`)
    root.style.setProperty('--font-system-mono', `'${systemFonts.monospace.replace(/\s+/g, '-')}', var(--font-code)`)
    
    // Mark fonts as loaded after a short delay
    setTimeout(() => {
      fontsLoaded = true
    }, 100)
    
    return () => {
      // Cleanup injected styles if needed
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
  })
</script>

<header class="static-header {fontsLoaded ? 'fonts-loaded' : ''}">
  <div class="header-content">
    <div class="logo-section">
      <h1 class="logo">Mem|8</h1>
      <span class="tagline">Explorer</span>
    </div>
    
    <nav class="header-nav desktop-nav">
      <button class="nav-link" onclick={() => dispatch('navigate', { demo: 'visualizer' })}>Wave Grid</button>
      <button class="nav-link" onclick={() => dispatch('navigate', { demo: 'timeline' })}>Timeline</button>
      <button class="nav-link" onclick={() => dispatch('navigate', { demo: 'smarttree' })}>Smart Tree</button>
      <button class="nav-link" onclick={() => dispatch('navigate', { demo: 'analyzer' })}>Analyzer</button>
    </nav>
    
    <div class="header-actions">
      <button 
        class="theme-button"
        onclick={cycleTheme}
        title="Click to change theme"
      >
        <span class="theme-icon">{themeIcons[currentTheme]}</span>
        <span class="theme-label desktop-only">{themeLabels[currentTheme]}</span>
      </button>
      
      <span class="system-type desktop-only" title={systemMessage}>{systemType}</span>
      
      <button 
        class="hamburger-menu"
        onclick={() => mobileMenuOpen = !mobileMenuOpen}
        aria-label="Toggle menu"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
  </div>
  
  {#if mobileMenuOpen}
    <nav class="mobile-nav">
      <button class="mobile-nav-link" onclick={() => { dispatch('navigate', { demo: 'visualizer' }); mobileMenuOpen = false; }}>
        Wave Grid
      </button>
      <button class="mobile-nav-link" onclick={() => { dispatch('navigate', { demo: 'timeline' }); mobileMenuOpen = false; }}>
        Timeline
      </button>
      <button class="mobile-nav-link" onclick={() => { dispatch('navigate', { demo: 'smarttree' }); mobileMenuOpen = false; }}>
        Smart Tree
      </button>
      <button class="mobile-nav-link" onclick={() => { dispatch('navigate', { demo: 'analyzer' }); mobileMenuOpen = false; }}>
        Analyzer
      </button>
      <div class="mobile-system-info">
        <span class="mobile-label">System:</span>
        <span class="mobile-value">{systemType}</span>
      </div>
    </nav>
  {/if}
  
  <div class="header-underline">
    <div class="underline-animation"></div>
  </div>
</header>

<style>
  .static-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--bg-primary);
    border-bottom: 2px solid var(--border-primary);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  
  /* Add glow effect for CRT themes */
  :global([data-theme="full-crt"]) .static-header,
  :global([data-theme="fake-crt"]) .static-header {
    box-shadow: 
      0 2px 20px var(--color-crt-green),
      inset 0 -2px 10px var(--color-crt-glow);
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .logo-section {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }
  
  .logo {
    font-family: var(--font-system-primary, var(--font-retro));
    font-size: 2rem;
    margin: 0;
    color: var(--heading-color);
    letter-spacing: 2px;
    position: relative;
  }
  
  /* Subtle glow animation for logo */
  :global([data-theme="full-crt"]) .logo,
  :global([data-theme="fake-crt"]) .logo {
    animation: subtle-glow 3s ease-in-out infinite alternate;
  }
  
  @keyframes subtle-glow {
    from { 
      text-shadow: 
        0 0 10px var(--color-crt-green),
        0 0 20px var(--color-crt-green);
    }
    to { 
      text-shadow: 
        0 0 15px var(--color-crt-green),
        0 0 25px var(--color-crt-green),
        0 0 30px var(--color-crt-glow);
    }
  }
  
  .tagline {
    font-family: var(--font-system-fallback, var(--font-body));
    font-size: 1rem;
    color: var(--text-secondary);
    opacity: 0.8;
  }
  
  .header-nav {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  
  .desktop-nav {
    display: none;
  }
  
  @media (min-width: 1024px) {
    .desktop-nav {
      display: flex;
    }
  }
  
  .nav-link {
    font-family: var(--font-system-mono, var(--font-code));
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
    padding: 0.5rem 0;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--link-color);
    transition: width 0.3s ease;
  }
  
  .nav-link:hover {
    color: var(--link-color);
  }
  
  .nav-link:hover::after {
    width: 100%;
  }
  
  /* CRT theme hover effects */
  :global([data-theme="full-crt"]) .nav-link:hover,
  :global([data-theme="fake-crt"]) .nav-link:hover {
    text-shadow: 0 0 5px var(--color-cyan);
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .system-type {
    font-family: var(--font-system-mono, var(--font-code));
    font-size: 0.75rem;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--border-secondary);
    border-radius: 2px;
    cursor: help;
    transition: all 0.2s ease;
  }
  
  .system-type:hover {
    background: var(--border-secondary);
    color: var(--bg-primary);
  }
  
  /* Animated underline */
  .header-underline {
    height: 2px;
    background: var(--bg-secondary);
    position: relative;
    overflow: hidden;
  }
  
  .underline-animation {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--link-color) 50%,
      transparent 100%
    );
    animation: scan 8s linear infinite;
  }
  
  @keyframes scan {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  /* Font loading animation */
  .static-header:not(.fonts-loaded) .logo {
    opacity: 0;
    transform: translateY(-10px);
  }
  
  .fonts-loaded .logo {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.5s ease;
  }
  
  /* Theme button styles */
  .theme-button {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 2px solid var(--border-primary);
    padding: 0.5rem 1rem;
    font-family: var(--font-body);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0;
  }
  
  .theme-button:hover {
    background: var(--border-primary);
    color: var(--bg-primary);
    transform: translateY(-2px);
  }
  
  /* CRT theme button glow */
  :global([data-theme="full-crt"]) .theme-button,
  :global([data-theme="fake-crt"]) .theme-button {
    box-shadow: 0 0 10px var(--color-crt-green);
  }
  
  :global([data-theme="full-crt"]) .theme-button:hover,
  :global([data-theme="fake-crt"]) .theme-button:hover {
    box-shadow: 0 0 20px var(--color-crt-green), 0 0 30px var(--color-crt-glow);
  }
  
  .theme-icon {
    font-size: 1.1rem;
  }
  
  .theme-label {
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.8rem;
  }
  
  /* Hamburger menu styles */
  .hamburger-menu {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    flex-direction: column;
    gap: 4px;
  }
  
  .hamburger-line {
    width: 24px;
    height: 2px;
    background: var(--text-primary);
    transition: all 0.3s ease;
  }
  
  .hamburger-menu:hover .hamburger-line {
    background: var(--link-color);
  }
  
  /* Mobile navigation */
  .mobile-nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border-bottom: 2px solid var(--border-primary);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    animation: slideDown 0.3s ease;
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .mobile-nav-link {
    background: none;
    border: none;
    color: var(--text-primary);
    font-family: var(--font-system-mono, var(--font-code));
    font-size: 1rem;
    padding: 0.75rem 1rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid var(--border-secondary);
  }
  
  .mobile-nav-link:hover {
    background: var(--bg-secondary);
    color: var(--link-color);
    padding-left: 1.5rem;
  }
  
  .mobile-system-info {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    margin-top: 0.5rem;
    border-top: 1px solid var(--border-secondary);
    font-family: var(--font-system-mono, var(--font-code));
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
  
  .mobile-label {
    font-weight: bold;
  }
  
  /* Utility classes */
  .desktop-only {
    display: none;
  }
  
  @media (min-width: 768px) {
    .desktop-only {
      display: inline;
    }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 1023px) {
    .hamburger-menu {
      display: flex;
    }
    
    .theme-label {
      display: none;
    }
    
    .theme-button {
      padding: 0.5rem 0.75rem;
    }
  }
  
  @media (max-width: 768px) {
    .header-content {
      padding: 1rem;
    }
    
    .logo {
      font-size: 1.5rem;
    }
    
    .tagline {
      font-size: 0.9rem;
    }
  }
</style>