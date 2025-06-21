<script lang="ts">
  let taglines = [
    "An 80's Inspired Dive into a Modern Memory System",
    "Where Waves Meet Neon Dreams",
    "Surfing the Digital Memory Grid Since 2025",
    "Your Portal to the Quantum Memory Realm"
  ]
  
  let currentTagline = $state(taglines[0])
  let taglineIndex = $state(0)
  
  // Cycle through taglines
  $effect(() => {
    const interval = setInterval(() => {
      taglineIndex = (taglineIndex + 1) % taglines.length
      currentTagline = taglines[taglineIndex]
    }, 5000)
    
    return () => clearInterval(interval)
  })
</script>

<header class="neon-border">
  <h1>Mem8 Explorer</h1>
  <p class="tagline">{currentTagline}</p>
  <div class="scanlines"></div>
</header>

<style>
  header {
    width: 100%;
    max-width: 1200px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .tagline {
    color: var(--color-yellow);
    font-size: 1rem;
    margin: 0;
    transition: opacity 0.5s ease-in-out;
  }
  
  .scanlines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      transparent 50%,
      rgba(0, 255, 255, 0.03) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    animation: scanlines 8s linear infinite;
  }
  
  @keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(10px); }
  }
</style>