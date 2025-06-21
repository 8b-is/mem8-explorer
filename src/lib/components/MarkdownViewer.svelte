<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { marked } from 'marked'
  import mermaid from 'mermaid'
  import DOMPurify from 'dompurify'
  import { createEventDispatcher } from 'svelte'
  
  const dispatch = createEventDispatcher<{
    navigate: { path: string }
  }>()
  
  let { content = '', filePath = '' } = $props()
  
  let container: HTMLDivElement
  let processedContent = $state('')
  let loading = $state(false)
  let error = $state<string | null>(null)
  let mermaidBlocks = $state<string[]>([])
  
  import { theme } from '$lib/stores/theme'
  
  // Initialize mermaid based on current theme
  $effect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'full-crt'
    
    const themeConfigs = {
      'white': {
        theme: 'default',
        themeVariables: {
          primaryColor: '#1976D2',
          primaryTextColor: '#FFFFFF',
          primaryBorderColor: '#1565C0',
          lineColor: '#424242',
          secondaryColor: '#FFA726',
          tertiaryColor: '#66BB6A',
          background: '#FFFFFF',
          mainBkg: '#1976D2',
          secondBkg: '#FFA726',
          tertiaryBkg: '#66BB6A',
          secondaryTextColor: '#FFFFFF',
          tertiaryTextColor: '#FFFFFF',
          textColor: '#212121',
          titleColor: '#1565C0',
          arrowheadColor: '#424242',
          edgeLabelBackground: '#FFFFFF',
          nodeTextColor: '#FFFFFF',
          nodeBkg: '#1976D2',
          nodeBorder: '#1565C0',
          clusterBkg: '#F5F5F5',
          clusterBorder: '#9E9E9E',
          defaultLinkColor: '#424242',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '16px'
        }
      },
      'dark': {
        theme: 'dark',
        themeVariables: {
          primaryColor: '#66BB6A',
          primaryTextColor: '#FFFFFF',
          primaryBorderColor: '#4CAF50',
          lineColor: '#616161',
          secondaryColor: '#FFB74D',
          tertiaryColor: '#64B5F6',
          background: '#121212',
          mainBkg: '#1E1E1E',
          secondBkg: '#2E2E2E',
          tertiaryBkg: '#424242',
          secondaryTextColor: '#BDBDBD',
          tertiaryTextColor: '#9E9E9E',
          textColor: '#E0E0E0',
          titleColor: '#4CAF50',
          arrowheadColor: '#BDBDBD',
          edgeLabelBackground: '#1E1E1E',
          nodeTextColor: '#FFFFFF',
          nodeBkg: '#2E2E2E',
          nodeBorder: '#4CAF50',
          clusterBkg: '#1E1E1E',
          clusterBorder: '#616161',
          defaultLinkColor: '#BDBDBD',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
      },
      'full-crt': {
        theme: 'dark',
        themeVariables: {
          primaryColor: '#00FF00',
          primaryTextColor: '#000000',
          primaryBorderColor: '#00FF00',
          lineColor: '#00FF00',
          secondaryColor: '#FFFF00',
          tertiaryColor: '#00FFFF',
          background: '#000000',
          mainBkg: '#00FF00',
          secondBkg: '#FFFF00',
          tertiaryBkg: '#00FFFF',
          secondaryTextColor: '#000000',
          tertiaryTextColor: '#000000',
          textColor: '#00FF00',
          titleColor: '#00FF00',
          arrowheadColor: '#00FF00',
          edgeLabelBackground: '#000000',
          nodeTextColor: '#000000',
          nodeBkg: '#00FF00',
          nodeBorder: '#00FF00',
          clusterBkg: '#001100',
          clusterBorder: '#00FF00',
          defaultLinkColor: '#00FF00',
          fontFamily: 'LazenbyCompLiquid, Share Tech Mono, monospace',
          fontSize: '14px'
        }
      },
      'fake-crt': {
        theme: 'dark',
        themeVariables: {
          primaryColor: '#00FF00',
          primaryTextColor: '#000000',
          primaryBorderColor: '#00FF00',
          lineColor: '#00FF00',
          secondaryColor: '#FFFF00',
          tertiaryColor: '#00FFFF',
          background: '#000000',
          mainBkg: '#00FF00',
          secondBkg: '#FFFF00',
          tertiaryBkg: '#00FFFF',
          secondaryTextColor: '#000000',
          tertiaryTextColor: '#000000',
          textColor: '#00FF00',
          titleColor: '#00FF00',
          arrowheadColor: '#00FF00',
          edgeLabelBackground: '#000000',
          nodeTextColor: '#000000',
          nodeBkg: '#00FF00',
          nodeBorder: '#00FF00',
          clusterBkg: '#001100',
          clusterBorder: '#00FF00',
          defaultLinkColor: '#00FF00',
          fontFamily: 'LazenbyCompLiquid, Share Tech Mono, monospace',
          fontSize: '14px'
        }
      },
      'slate': {
        theme: 'dark',
        themeVariables: {
          primaryColor: '#38BDF8',
          primaryTextColor: '#0F172A',
          primaryBorderColor: '#0284C7',
          background: '#0F172A',
          mainBkg: '#38BDF8',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
      },
      'zinc': {
        theme: 'dark',
        themeVariables: {
          primaryColor: '#67E8F9',
          primaryTextColor: '#18181B',
          primaryBorderColor: '#06B6D4',
          background: '#18181B',
          mainBkg: '#67E8F9',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
      },
      'emerald': {
        theme: 'default',
        themeVariables: {
          primaryColor: '#059669',
          primaryTextColor: '#FFFFFF',
          primaryBorderColor: '#047857',
          background: '#ECFDF5',
          mainBkg: '#059669',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
      },
      'rose': {
        theme: 'default',
        themeVariables: {
          primaryColor: '#E11D48',
          primaryTextColor: '#FFFFFF',
          primaryBorderColor: '#BE123C',
          background: '#FFF1F2',
          mainBkg: '#E11D48',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
      }
    }
    
    const config = themeConfigs[currentTheme as keyof typeof themeConfigs] || themeConfigs['full-crt']
    
    mermaid.initialize({
      startOnLoad: false,
      ...config,
      flowchart: {
        htmlLabels: true,
        curve: (currentTheme === 'full-crt' || currentTheme === 'fake-crt') ? 'linear' : 'basis',
        nodeSpacing: 50,
        rankSpacing: 50
      }
    })
    
    // Re-render mermaid diagrams if they exist
    if (container && !loading) {
      renderMermaidDiagrams(mermaidBlocks)
    }
  })
  
  // Custom renderer for marked to handle links
  const renderer = new marked.Renderer()
  
  // Override link rendering to handle internal markdown links
  renderer.link = (options) => {
    const href = options.href || ''
    const title = options.title || ''
    // Extract text from tokens
    let text = ''
    if (options.tokens && options.tokens.length > 0) {
      const token = options.tokens[0]
      if ('text' in token) {
        text = token.text
      }
    }
    if (href && href.endsWith('.md')) {
      return `<a href="#${href}" class="internal-link" data-href="${href}">${text}</a>`
    }
    return `<a href="${href}" target="_blank" rel="noopener" title="${title}">${text}</a>`
  }
  
  // Configure marked
  marked.setOptions({
    renderer: renderer,
    breaks: true,
    gfm: true,
    langPrefix: 'language-' // Ensure language prefix for code blocks
  })
  
  async function loadContent() {
    if (!filePath && !content) return
    
    loading = true
    error = null
    
    try {
      let markdownContent = content
      
      // If filePath is provided, fetch the content
      if (filePath && !content) {
        const response = await fetch(filePath)
        if (!response.ok) {
          throw new Error(`Failed to load ${filePath}: ${response.statusText}`)
        }
        markdownContent = await response.text()
      }
      
      // Extract mermaid blocks before parsing
      const extractedBlocks: string[] = []
      const mermaidRegex = /```mermaid\n([\s\S]*?)```/g
      let match
      let mermaidIndex = 0
      
      // Replace mermaid blocks with placeholders
      const processedMarkdown = markdownContent.replace(mermaidRegex, (_, mermaidCode) => {
        extractedBlocks.push(mermaidCode.trim())
        return `<div class="mermaid-placeholder" data-mermaid-index="${mermaidIndex++}">Loading diagram...</div>`
      })
      
      // Update state
      mermaidBlocks = extractedBlocks
      
      // Parse markdown
      const rawHtml = await marked.parse(processedMarkdown)
      
      // Sanitize HTML - be more permissive
      processedContent = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'code', 'pre', 'blockquote', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'span'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'id', 'data-mermaid-index', 'data-href', 'target', 'rel', 'title']
      })
      
      // Wait for DOM to update
      await tick()
      
      // Set loading to false before processing mermaid
      loading = false
      
      // Wait another tick for the content to render
      await tick()
      
      // Process mermaid diagrams
      await renderMermaidDiagrams(mermaidBlocks)
      
    } catch (err) {
      console.error('Error loading markdown:', err)
      error = err instanceof Error ? err.message : String(err)
      loading = false
    }
  }
  
  function setupMermaidInteraction(container: HTMLElement, wrapper: HTMLElement) {
    let scale = 1
    let translateX = 0
    let translateY = 0
    let isPanning = false
    let startX = 0
    let startY = 0
    
    const svg = wrapper.querySelector('svg')
    if (!svg) return
    
    // Apply initial transform
    function updateTransform() {
      wrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
    }
    
    // Zoom functions (zoom from center of viewport)
    function zoomIn() {
      const rect = wrapper.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const pointX = (centerX - translateX) / scale
      const pointY = (centerY - translateY) / scale
      
      scale = Math.min(scale * 1.2, 5)
      
      translateX = centerX - pointX * scale
      translateY = centerY - pointY * scale
      
      updateTransform()
    }
    
    function zoomOut() {
      const rect = wrapper.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const pointX = (centerX - translateX) / scale
      const pointY = (centerY - translateY) / scale
      
      scale = Math.max(scale / 1.2, 0.5)
      
      translateX = centerX - pointX * scale
      translateY = centerY - pointY * scale
      
      updateTransform()
    }
    
    function reset() {
      scale = 1
      translateX = 0
      translateY = 0
      updateTransform()
    }
    
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        container.requestFullscreen()
        container.classList.add('fullscreen-mode')
      } else {
        document.exitFullscreen()
        container.classList.remove('fullscreen-mode')
      }
    }
    
    // Button controls
    const zoomInBtn = container.querySelector('.zoom-in')
    const zoomOutBtn = container.querySelector('.zoom-out')
    const resetBtn = container.querySelector('.reset')
    const fullscreenBtn = container.querySelector('.fullscreen')
    
    zoomInBtn?.addEventListener('click', zoomIn)
    zoomOutBtn?.addEventListener('click', zoomOut)
    resetBtn?.addEventListener('click', reset)
    fullscreenBtn?.addEventListener('click', toggleFullscreen)
    
    // Mouse wheel zoom centered on cursor
    wrapper.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault()
      
      // Get mouse position relative to the wrapper
      const rect = wrapper.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      // Calculate the point on the diagram before zoom
      const pointX = (mouseX - translateX) / scale
      const pointY = (mouseY - translateY) / scale
      
      // Update scale
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.min(Math.max(scale * delta, 0.5), 5)
      
      // Calculate new translation to keep the point under the mouse
      translateX = mouseX - pointX * newScale
      translateY = mouseY - pointY * newScale
      
      scale = newScale
      updateTransform()
    })
    
    // Pan functionality
    wrapper.addEventListener('mousedown', (e: MouseEvent) => {
      if (e.button === 0) { // Left click only
        isPanning = true
        startX = e.clientX - translateX
        startY = e.clientY - translateY
        wrapper.style.cursor = 'grabbing'
      }
    })
    
    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isPanning) return
      translateX = e.clientX - startX
      translateY = e.clientY - startY
      updateTransform()
    })
    
    window.addEventListener('mouseup', () => {
      isPanning = false
      wrapper.style.cursor = 'grab'
    })
    
    // Touch support
    let initialDistance = 0
    let initialScale = scale
    
    wrapper.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        initialDistance = Math.sqrt(dx * dx + dy * dy)
        initialScale = scale
      } else if (e.touches.length === 1) {
        // Pan
        startX = e.touches[0].clientX - translateX
        startY = e.touches[0].clientY - translateY
      }
    })
    
    wrapper.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length === 2) {
        // Pinch zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const distance = Math.sqrt(dx * dx + dy * dy)
        scale = Math.min(Math.max(initialScale * (distance / initialDistance), 0.5), 5)
        updateTransform()
      } else if (e.touches.length === 1) {
        // Pan
        translateX = e.touches[0].clientX - startX
        translateY = e.touches[0].clientY - startY
        updateTransform()
      }
    })
    
    // Initial setup
    wrapper.style.cursor = 'grab'
    updateTransform()
  }
  
  async function renderMermaidDiagrams(mermaidBlocks: string[]) {
    if (!container || mermaidBlocks.length === 0) return
    
    // Find all placeholder divs
    const placeholders = container.querySelectorAll('.mermaid-placeholder')
    
    for (let i = 0; i < placeholders.length; i++) {
      const placeholder = placeholders[i] as HTMLElement
      const index = parseInt(placeholder.dataset.mermaidIndex || '0')
      const mermaidCode = mermaidBlocks[index]
      
      if (!mermaidCode) continue
      
      try {
        const id = `mermaid-${Date.now()}-${i}`
        
        // Create a container div for the diagram
        const containerDiv = document.createElement('div')
        containerDiv.className = 'mermaid-diagram'
        
        // Create the actual div that mermaid will render into
        const div = document.createElement('div')
        div.id = id
        
        // Replace placeholder with container
        placeholder.replaceWith(containerDiv)
        
        // Render the diagram
        const { svg } = await mermaid.render(id, mermaidCode)
        
        // Create wrapper for zoom/pan functionality
        const wrapper = document.createElement('div')
        wrapper.className = 'mermaid-wrapper'
        wrapper.innerHTML = svg
        
        // Create controls
        const controls = document.createElement('div')
        controls.className = 'mermaid-controls'
        controls.innerHTML = `
          <button class="mermaid-btn zoom-in" title="Zoom In">+</button>
          <button class="mermaid-btn zoom-out" title="Zoom Out">-</button>
          <button class="mermaid-btn reset" title="Reset">⟲</button>
          <button class="mermaid-btn fullscreen" title="Fullscreen">⛶</button>
        `
        
        containerDiv.appendChild(controls)
        containerDiv.appendChild(wrapper)
        
        // Setup zoom/pan functionality
        setupMermaidInteraction(containerDiv, wrapper)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        // Show error message
        const errorDiv = document.createElement('div')
        errorDiv.className = 'mermaid-error'
        errorDiv.innerHTML = `<strong>Mermaid Error:</strong><br>${err}`
        placeholder.replaceWith(errorDiv)
      }
    }
  }
  
  // Keep old function for debugging
  async function processMermaidDiagrams_old() {
    if (!container) return
    
    // Debug: log the actual HTML content
    console.log('Container HTML:', container.innerHTML.substring(0, 500))
    
    // Debug: log all code blocks
    const allCodeBlocks = container.querySelectorAll('pre code')
    console.log(`Total code blocks found: ${allCodeBlocks.length}`)
    
    // Also check for just <pre> blocks
    const allPreBlocks = container.querySelectorAll('pre')
    console.log(`Total pre blocks found: ${allPreBlocks.length}`)
    allPreBlocks.forEach((block, i) => {
      console.log(`Pre block ${i} innerHTML:`, block.innerHTML.substring(0, 100))
    })
    
    // Find all mermaid code blocks - try multiple selectors
    let mermaidBlocks = container.querySelectorAll('pre code.language-mermaid')
    
    // If not found, try alternative selectors
    if (mermaidBlocks.length === 0) {
      mermaidBlocks = container.querySelectorAll('code.language-mermaid')
    }
    
    // Also check for code blocks that contain mermaid syntax
    if (mermaidBlocks.length === 0) {
      const allBlocks = container.querySelectorAll('pre code')
      mermaidBlocks = Array.from(allBlocks).filter(block => {
        const text = block.textContent || ''
        return text.includes('graph') && (text.includes('-->') || text.includes('---'))
      })
      console.log(`Found ${mermaidBlocks.length} mermaid blocks by content detection`)
    }
    
    console.log(`Found ${mermaidBlocks.length} mermaid blocks total`)
    
    for (let i = 0; i < mermaidBlocks.length; i++) {
      const block = mermaidBlocks[i]
      const mermaidCode = block.textContent
      const id = `mermaid-${Date.now()}-${i}`
      
      console.log('Processing mermaid block:', mermaidCode?.substring(0, 50) + '...')
      
      try {
        // Create a div for the diagram
        const div = document.createElement('div')
        div.id = id
        div.className = 'mermaid-diagram'
        
        // Get the parent element (should be <pre>)
        const parent = block.parentElement
        
        // Replace the entire <pre> block with the div
        if (parent && parent.tagName === 'PRE') {
          parent.replaceWith(div)
        } else {
          block.replaceWith(div)
        }
        
        // Render the diagram
        const { svg } = await mermaid.render(id, mermaidCode || '')
        div.innerHTML = svg
        console.log('Mermaid diagram rendered successfully')
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        // Keep the original code block on error
      }
    }
  }
  
  function handleInternalLink(event: Event) {
    const link = (event.target as HTMLElement).closest('.internal-link')
    if (!link) return
    
    event.preventDefault()
    const href = link.getAttribute('data-href')
    
    // Dispatch custom event for parent to handle navigation
    if (href) {
      dispatch('navigate', { path: href })
    }
  }
  
  // Reactive updates
  $effect(() => {
    loadContent()
  })
  
  onMount(() => {
    // Add click handler for internal links
    container.addEventListener('click', handleInternalLink)
    
    return () => {
      container?.removeEventListener('click', handleInternalLink)
    }
  })
</script>

<div class="markdown-viewer neon-border" bind:this={container}>
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading markdown content...</p>
    </div>
  {:else if error}
    <div class="error">
      <h3>Error Loading Content</h3>
      <p>{error}</p>
    </div>
  {:else}
    <div class="markdown-content">
      {@html processedContent}
    </div>
  {/if}
</div>

<style>
  .markdown-viewer {
    padding: 2rem;
    margin: 2rem 0;
    overflow-x: auto;
  }
  
  .loading {
    text-align: center;
    padding: 3rem;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    margin: 0 auto 1rem;
    border: 3px solid var(--color-magenta);
    border-top-color: var(--color-cyan);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .error {
    color: var(--color-yellow);
    text-align: center;
    padding: 2rem;
  }
  
  .error h3 {
    color: var(--color-magenta);
    margin-bottom: 1rem;
  }
  
  /* Markdown content styling */
  :global(.markdown-content h1),
  :global(.markdown-content h2),
  :global(.markdown-content h3),
  :global(.markdown-content h4),
  :global(.markdown-content h5),
  :global(.markdown-content h6) {
    color: var(--color-crt-green);
    text-shadow: var(--glow-green);
    margin: 1.5rem 0 1rem;
  }
  
  :global(.markdown-content h1) { font-size: 2em; }
  :global(.markdown-content h2) { font-size: 1.5em; }
  :global(.markdown-content h3) { font-size: 1.2em; }
  
  :global(.markdown-content p) {
    line-height: 1.6;
    margin: 1rem 0;
  }
  
  :global(.markdown-content a) {
    color: var(--color-cyan);
    text-decoration: none;
    font-weight: bold;
  }
  
  :global(.markdown-content a:hover) {
    color: var(--color-white);
    text-shadow: 0 0 5px var(--color-cyan);
  }
  
  :global(.markdown-content a.internal-link) {
    color: var(--color-yellow);
  }
  
  :global(.markdown-content a.internal-link:hover) {
    color: var(--color-white);
    text-shadow: 0 0 5px var(--color-yellow);
  }
  
  :global(.markdown-content code) {
    background: rgba(0, 255, 255, 0.1);
    color: var(--color-cyan);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: var(--font-retro);
    font-size: 0.9em;
  }
  
  :global(.markdown-content pre) {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid var(--color-cyan);
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
  
  :global(.markdown-content pre code) {
    background: none;
    padding: 0;
    color: var(--color-green);
  }
  
  /* Mermaid diagram styling */
  :global(.mermaid-diagram) {
    margin: 2rem 0;
    padding: 0;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--color-cyan);
    box-shadow: 0 0 20px var(--color-cyan);
    position: relative;
    overflow: hidden;
  }
  
  :global(.mermaid-wrapper) {
    position: relative;
    width: 100%;
    height: 600px;
    overflow: hidden;
    transform-origin: 0 0;
    transition: transform 0.2s ease;
  }
  
  :global(.mermaid-wrapper svg) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: none !important;
    height: auto !important;
  }
  
  /* Control buttons */
  :global(.mermaid-controls) {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
    z-index: 10;
    background: rgba(0, 0, 0, 0.8);
    padding: 0.5rem;
    border: 2px solid var(--color-crt-green);
    box-shadow: 0 0 10px var(--color-crt-green), 0 0 20px var(--color-crt-glow);
  }
  
  :global(.mermaid-btn) {
    background: var(--color-crt-green);
    color: var(--color-black);
    border: 2px solid var(--color-black);
    padding: 0.5rem 0.75rem;
    font-family: var(--font-retro);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.1s ease;
    box-shadow: 0 0 10px var(--color-crt-green);
  }
  
  :global(.mermaid-btn:hover) {
    background: var(--color-crt-glow);
    transform: translate(1px, 1px);
    box-shadow: 0 0 20px var(--color-crt-green), 0 0 30px var(--color-crt-glow);
  }
  
  :global(.mermaid-btn:active) {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 var(--color-cyan);
  }
  
  /* Fullscreen mode */
  :global(.mermaid-diagram.fullscreen-mode) {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    margin: 0 !important;
    z-index: 9999 !important;
    border: none !important;
  }
  
  :global(.mermaid-diagram.fullscreen-mode .mermaid-wrapper) {
    height: 100vh !important;
  }
  
  :global(.mermaid-diagram.fullscreen-mode .mermaid-controls) {
    top: 2rem;
    right: 2rem;
  }
  
  /* Override Mermaid default colors for better visibility */
  :global(.mermaid-diagram .node rect),
  :global(.mermaid-diagram .node circle),
  :global(.mermaid-diagram .node ellipse),
  :global(.mermaid-diagram .node polygon) {
    stroke-width: 2px !important;
  }
  
  /* Force all text to be black with white outline for universal readability */
  :global(.mermaid-diagram text),
  :global(.mermaid-diagram .node text),
  :global(.mermaid-diagram .nodeLabel),
  :global(.mermaid-diagram .label),
  :global(.mermaid-diagram .edgeLabel text),
  :global(.mermaid-diagram .cluster-label text),
  :global(.mermaid-diagram tspan) {
    fill: #000000 !important;
    stroke: #FFFFFF !important;
    stroke-width: 3px !important;
    paint-order: stroke fill !important;
    font-weight: bold !important;
    font-size: 14px !important;
  }
  
  /* Complete status (green) */
  :global(.mermaid-diagram .node.complete rect),
  :global(.mermaid-diagram .node.complete circle),
  :global(.mermaid-diagram .node.complete ellipse),
  :global(.mermaid-diagram .node.complete polygon) {
    fill: #4CAF50 !important;
    stroke: #2E7D32 !important;
  }
  
  /* Partial status (orange) */
  :global(.mermaid-diagram .node.partial rect),
  :global(.mermaid-diagram .node.partial circle),
  :global(.mermaid-diagram .node.partial ellipse),
  :global(.mermaid-diagram .node.partial polygon) {
    fill: #FF9800 !important;
    stroke: #F57C00 !important;
  }
  
  /* Proposed status (gray) */
  :global(.mermaid-diagram .node.proposed rect),
  :global(.mermaid-diagram .node.proposed circle),
  :global(.mermaid-diagram .node.proposed ellipse),
  :global(.mermaid-diagram .node.proposed polygon) {
    fill: #9E9E9E !important;
    stroke: #616161 !important;
  }
  
  
  :global(.mermaid-diagram .edgePath .path) {
    stroke: var(--color-cyan) !important;
    stroke-width: 2px !important;
    fill: none !important;
  }
  
  :global(.mermaid-diagram .edgePath .arrowheadPath) {
    fill: var(--color-cyan) !important;
    stroke: none !important;
  }
  
  :global(.mermaid-diagram .edgeLabel) {
    background-color: rgba(255, 255, 255, 0.9) !important;
  }
  
  :global(.mermaid-diagram .edgeLabel rect) {
    fill: rgba(255, 255, 255, 0.9) !important;
    stroke: #000000 !important;
    stroke-width: 1px !important;
  }
  
  :global(.mermaid-diagram .edgeLabel text) {
    fill: #000000 !important;
    font-weight: bold !important;
  }
  
  :global(.mermaid-diagram .cluster rect) {
    fill: rgba(0, 255, 255, 0.1) !important;
    stroke: var(--color-cyan) !important;
    stroke-width: 2px !important;
  }
  
  :global(.mermaid-diagram .cluster text) {
    fill: #000000 !important;
    font-weight: bold !important;
    background: rgba(255, 255, 255, 0.8);
    padding: 2px 4px;
  }
  
  /* Ensure subgraph labels are visible */
  :global(.mermaid-diagram .cluster-label) {
    fill: #000000 !important;
    font-weight: bold !important;
    font-size: 14px !important;
  }
  
  /* Mermaid error styling */
  :global(.mermaid-error) {
    margin: 2rem 0;
    padding: 1rem;
    background: rgba(255, 0, 0, 0.1);
    border: 2px solid var(--color-red, #ff0000);
    color: var(--color-red, #ff0000);
    font-family: var(--font-body);
    font-size: 0.9rem;
  }
  
  :global(.markdown-content blockquote) {
    border-left: 4px solid var(--color-crt-green);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--color-yellow);
  }
  
  :global(.markdown-content ul),
  :global(.markdown-content ol) {
    padding-left: 2rem;
    margin: 1rem 0;
  }
  
  :global(.markdown-content li) {
    margin: 0.5rem 0;
  }
  
  :global(.markdown-content table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
  }
  
  :global(.markdown-content th),
  :global(.markdown-content td) {
    border: 1px solid var(--color-cyan);
    padding: 0.5rem;
    text-align: left;
  }
  
  :global(.markdown-content th) {
    background: rgba(0, 255, 0, 0.2);
    color: var(--color-yellow);
  }
  
  :global(.markdown-content tr:nth-child(even)) {
    background: rgba(0, 255, 255, 0.05);
  }
  
  /* Mermaid diagram styling */
  :global(.mermaid-diagram) {
    margin: 2rem 0;
    text-align: center;
  }
  
  :global(.mermaid-diagram svg) {
    max-width: 100%;
    height: auto;
  }
</style>