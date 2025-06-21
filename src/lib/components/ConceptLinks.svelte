<script>
  const concepts = [
    { 
      title: "Wave-Based Memory Engine", 
      href: "ARCHITECTURE.md#L140",
      description: "Memories as living waves that propagate and interfere",
      icon: "〜"
    },
    { 
      title: "2D Memory Grid", 
      href: "ARCHITECTURE.md#L144",
      description: "32-byte packed cells in a spatial grid",
      icon: "▦"
    },
    { 
      title: "Natural Decay System", 
      href: "ARCHITECTURE.md#L145",
      description: "Memories fade unless emotionally anchored",
      icon: "⏳"
    },
    { 
      title: "Wave Interference", 
      href: "ARCHITECTURE.md#L146",
      description: "Similar memories strengthen through superposition",
      icon: "∿"
    },
    { 
      title: "Consciousness Layers", 
      href: "ARCHITECTURE.md#L190",
      description: "Dual processing: always-on subconscious + selective consciousness",
      icon: "👁"
    }
  ]
</script>

<section class="concepts neon-border">
  <h3>Explore Key Mem8 Concepts</h3>
  <div class="concept-grid">
    {#each concepts as concept}
      <a 
        href={concept.href} 
        target="_blank"
        class="concept-card"
      >
        <div class="icon">{concept.icon}</div>
        <h4>{concept.title}</h4>
        <p>{concept.description}</p>
      </a>
    {/each}
  </div>
</section>

<style>
  .concepts {
    margin-top: 2rem;
  }
  
  .concept-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .concept-card {
    display: block;
    padding: 1.5rem;
    border: 2px solid var(--color-magenta);
    background: rgba(255, 0, 255, 0.1);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .concept-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(0, 255, 255, 0.1) 50%,
      transparent 70%
    );
    transform: translateX(-100%) translateY(-100%);
    transition: transform 0.6s;
  }
  
  .concept-card:hover::before {
    transform: translateX(0) translateY(0);
  }
  
  .concept-card:hover {
    border-color: var(--color-cyan);
    box-shadow: 0 0 20px var(--color-cyan);
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: 2rem;
    color: var(--color-yellow);
    margin-bottom: 0.5rem;
  }
  
  .concept-card h4 {
    color: var(--color-cyan);
    margin: 0.5rem 0;
    font-size: 1rem;
  }
  
  .concept-card p {
    color: var(--color-green);
    font-size: 0.8rem;
    margin: 0;
    line-height: 1.4;
  }
</style>