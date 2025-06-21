<script>
  let glitchText = $state(false)
  
  // Random glitch effect
  $effect(() => {
    const glitchInterval = setInterval(() => {
      glitchText = true
      setTimeout(() => glitchText = false, 200)
    }, 3000 + Math.random() * 2000)
    
    return () => clearInterval(glitchInterval)
  })
</script>

<section class="hero neon-border">
  <h2 class:glitch={glitchText}>Welcome, Digital Voyager!</h2>
  <p>
    Imagine a memory system that could run on an Atari or Commodore 64... 
    but supercharged with today's technology. That's Mem8. 
    Prepare to explore its depths!
  </p>
  <p>
    This is our launchpad. Soon, this space will be teeming with interactive 
    visualizations of the <a href="ARCHITECTURE.md#L8" target="_blank">Core Memory Engine</a>, 
    the <a href="ARCHITECTURE.md#L19" target="_blank">Consciousness System</a>, 
    and more wonders from the Mem8 universe!
  </p>
  
  <div class="stats">
    <div class="stat">
      <span class="stat-value">973x</span>
      <span class="stat-label">Faster than Qdrant</span>
    </div>
    <div class="stat">
      <span class="stat-value">32</span>
      <span class="stat-label">Bytes per Cell</span>
    </div>
    <div class="stat">
      <span class="stat-value">1M</span>
      <span class="stat-label">Memories/Second</span>
    </div>
  </div>
</section>

<style>
  .hero {
    margin-top: 2rem;
  }
  
  .glitch {
    position: relative;
    animation: glitch 0.2s linear;
  }
  
  @keyframes glitch {
    0%, 100% { text-shadow: 2px 2px var(--color-cyan); }
    20% { text-shadow: -2px 2px var(--color-magenta), 2px -2px var(--color-cyan); }
    40% { text-shadow: 2px -2px var(--color-yellow), -2px 2px var(--color-cyan); }
    60% { text-shadow: -2px -2px var(--color-magenta), 2px 2px var(--color-green); }
    80% { text-shadow: 2px 2px var(--color-cyan), -2px -2px var(--color-yellow); }
  }
  
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .stat {
    text-align: center;
    padding: 1rem;
    border: 1px solid var(--color-cyan);
    background: rgba(0, 255, 255, 0.1);
  }
  
  .stat-value {
    display: block;
    font-size: 2rem;
    color: var(--color-yellow);
    text-shadow: 2px 2px var(--color-magenta);
  }
  
  .stat-label {
    display: block;
    font-size: 0.8rem;
    color: var(--color-cyan);
    margin-top: 0.5rem;
  }
</style>