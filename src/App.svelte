<script lang="ts">
  import Header from './lib/components/Header.svelte'
  import StaticHeader from './lib/components/StaticHeader.svelte'
  import Hero from './lib/components/Hero.svelte'
  import Visualizer from './lib/components/Visualizer.svelte'
  import ConceptLinks from './lib/components/ConceptLinks.svelte'
  import Footer from './lib/components/Footer.svelte'
  import MarkdownViewer from './lib/components/MarkdownViewer.svelte'
  import MemoryTimeline from './lib/components/MemoryTimeline.svelte'
  import SmartTreeDemo from './lib/components/SmartTreeDemo.svelte'
  import WaveAnalyzer from './lib/components/WaveAnalyzer.svelte'
  
  let currentMarkdownFile = $state<string | null>(null)
  let currentDemo = $state('visualizer')
  
  function handleNavigate(event: CustomEvent<{ path: string }>) {
    const { path } = event.detail
    currentMarkdownFile = path
  }
  
  function closeMarkdown() {
    currentMarkdownFile = null
  }
  
  function navigateToDemo(demo: string) {
    currentMarkdownFile = null
    currentDemo = demo
  }
</script>

<div class="app-container crt-effect">
  <StaticHeader 
    on:navigate={(e) => navigateToDemo(e.detail.demo)}
    on:viewDocs={() => currentMarkdownFile = '/docs/ARCHITECTURE.md'}
  />
    
    <main class="with-static-header">
    {#if currentMarkdownFile}
      <div class="markdown-view">
        <button class="close-button" onclick={closeMarkdown}>
          ← Back to Explorer
        </button>
        <MarkdownViewer filePath={currentMarkdownFile} on:navigate={handleNavigate} />
      </div>
    {:else}
      <Hero on:navigate={handleNavigate} />
      
      <div class="demo-selector">
        <h2>Choose Your Experience</h2>
        <div class="demo-buttons">
          <button 
            class="demo-button {currentDemo === 'visualizer' ? 'active' : ''}"
            onclick={() => currentDemo = 'visualizer'}
          >
            Wave Grid
          </button>
          <button 
            class="demo-button {currentDemo === 'timeline' ? 'active' : ''}"
            onclick={() => currentDemo = 'timeline'}
          >
            Memory Timeline
          </button>
          <button 
            class="demo-button {currentDemo === 'smarttree' ? 'active' : ''}"
            onclick={() => currentDemo = 'smarttree'}
          >
            Smart Tree
          </button>
          <button 
            class="demo-button {currentDemo === 'analyzer' ? 'active' : ''}"
            onclick={() => currentDemo = 'analyzer'}
          >
            Wave Analyzer
          </button>
        </div>
      </div>
      
      {#if currentDemo === 'visualizer'}
        <Visualizer />
      {:else if currentDemo === 'timeline'}
        <MemoryTimeline />
      {:else if currentDemo === 'smarttree'}
        <SmartTreeDemo />
      {:else if currentDemo === 'analyzer'}
        <WaveAnalyzer />
      {/if}
      
      <ConceptLinks on:navigate={handleNavigate} />
    {/if}
  </main>
  
    <Footer />
  </div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }
  
  main {
    width: 100%;
    max-width: 1200px;
    flex-grow: 1;
  }
  
  main.with-static-header {
    margin-top: 80px; /* Space for fixed header */
  }
  
  .markdown-view {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .close-button {
    background: var(--color-magenta);
    color: var(--color-black);
    border: 2px solid var(--color-cyan);
    padding: 0.5rem 1.5rem;
    font-family: var(--font-retro);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1rem;
  }
  
  .close-button:hover {
    background: var(--color-cyan);
    color: var(--color-black);
    box-shadow: 0 0 20px var(--color-cyan);
    transform: translateX(-5px);
  }
  
  .demo-selector {
    margin: 3rem 0;
    text-align: center;
  }
  
  .demo-selector h2 {
    color: var(--color-magenta);
    margin-bottom: 1.5rem;
    text-shadow: 0 0 20px var(--color-magenta);
  }
  
  .demo-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .demo-button {
    background: var(--color-black);
    color: var(--color-cyan);
    border: 2px solid var(--color-cyan);
    padding: 0.75rem 1.5rem;
    font-family: var(--font-retro);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .demo-button:hover {
    background: var(--color-cyan);
    color: var(--color-black);
    box-shadow: 0 0 20px var(--color-cyan);
    transform: scale(1.05);
  }
  
  .demo-button.active {
    background: var(--color-magenta);
    color: var(--color-black);
    border-color: var(--color-magenta);
    box-shadow: 0 0 20px var(--color-magenta);
  }
  
  .demo-button.active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, transparent, var(--color-magenta));
    transform: translate(-50%, -50%);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
    100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
  }
</style>