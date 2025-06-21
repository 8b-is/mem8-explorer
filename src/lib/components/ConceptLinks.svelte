<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  
  const dispatch = createEventDispatcher<{
    navigate: { path: string }
  }>()
  
  interface Concept {
    title: string
    file: string
    description: string
    icon: string
  }
  
  const concepts: Concept[] = [
    { 
      title: "Wave-Based Memory Engine", 
      file: "ARCHITECTURE.md",
      description: "Memories as living waves that propagate and interfere",
      icon: "〜"
    },
    { 
      title: "2D Memory Grid", 
      file: "ARCHITECTURE.md",
      description: "32-byte packed cells in a spatial grid",
      icon: "▦"
    },
    { 
      title: "Natural Decay System", 
      file: "ARCHITECTURE.md",
      description: "Memories fade unless emotionally anchored",
      icon: "⏳"
    },
    { 
      title: "Wave Interference", 
      file: "ARCHITECTURE.md",
      description: "Similar memories strengthen through superposition",
      icon: "∿"
    },
    { 
      title: "Consciousness Layers", 
      file: "ARCHITECTURE.md",
      description: "Dual processing: always-on subconscious + selective consciousness",
      icon: "👁"
    },
    {
      title: "Context & Vision",
      file: "Context.md",
      description: "The vision and implementation ideas behind Mem8 Explorer",
      icon: "🎯"
    }
  ]
  
  function handleCardClick(event: MouseEvent, concept: Concept) {
    event.preventDefault()
    dispatch('navigate', { path: concept.file })
  }
</script>

<section class="concepts neon-border">
  <h3>Explore Key Mem8 Concepts</h3>
  <div class="concept-grid">
    {#each concepts as concept}
      <button 
        class="concept-card"
        onclick={(e) => handleCardClick(e, concept)}
      >
        <div class="icon">{concept.icon}</div>
        <h4>{concept.title}</h4>
        <p>{concept.description}</p>
      </button>
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
    width: 100%;
    padding: 1.5rem;
    border: 2px solid var(--color-magenta);
    background: rgba(255, 0, 255, 0.1);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
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