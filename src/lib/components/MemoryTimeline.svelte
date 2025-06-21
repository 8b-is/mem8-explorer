<script lang="ts">
  import { onMount } from 'svelte'
  
  interface Memory {
    id: number
    timestamp: number
    text: string
    frequency: number
    amplitude: number
    emotion: { valence: number; arousal: number; dominance: number }
    project: string
  }
  
  let canvas: HTMLCanvasElement
  let animationFrame: number
  let timeOffset = $state(0)
  let selectedMemory = $state<number | null>(null)
  let memories = $state<Memory[]>([])
  
  // Timeline parameters
  const timelineHeight = 300
  const timelineWidth = 800
  const memoryRadius = 4
  const hourWidth = 30
  
  // Generate example memories with wave patterns
  function generateMemories() {
    const now = Date.now()
    const examples = []
    
    // Smart Tree memories
    examples.push({
      id: 1,
      timestamp: now - 365 * 24 * 60 * 60 * 1000, // 1 year ago
      text: "Started Smart Tree IoT project with ESP32",
      frequency: 0.65,
      amplitude: 0.8,
      emotion: { valence: 80, arousal: 180, dominance: 160 },
      project: "smart-tree"
    })
    
    examples.push({
      id: 2,
      timestamp: now - 300 * 24 * 60 * 60 * 1000,
      text: "Implemented soil moisture sensing in Rust",
      frequency: 0.72,
      amplitude: 0.75,
      emotion: { valence: 60, arousal: 150, dominance: 170 },
      project: "smart-tree"
    })
    
    // Mem8 memories
    examples.push({
      id: 3,
      timestamp: now - 180 * 24 * 60 * 60 * 1000,
      text: "Designed wave-based memory system architecture",
      frequency: 0.85,
      amplitude: 0.9,
      emotion: { valence: 100, arousal: 200, dominance: 180 },
      project: "mem8"
    })
    
    examples.push({
      id: 4,
      timestamp: now - 90 * 24 * 60 * 60 * 1000,
      text: "Achieved 973x performance improvement over Qdrant",
      frequency: 0.95,
      amplitude: 0.95,
      emotion: { valence: 120, arousal: 220, dominance: 200 },
      project: "mem8"
    })
    
    // Recent memories
    examples.push({
      id: 5,
      timestamp: now - 7 * 24 * 60 * 60 * 1000,
      text: "Added consciousness layer with text sensors",
      frequency: 0.78,
      amplitude: 0.82,
      emotion: { valence: 70, arousal: 160, dominance: 150 },
      project: "mem8"
    })
    
    examples.push({
      id: 6,
      timestamp: now - 24 * 60 * 60 * 1000,
      text: "Integrated Smart Tree context into Mem8 API",
      frequency: 0.88,
      amplitude: 0.85,
      emotion: { valence: 90, arousal: 170, dominance: 160 },
      project: "both"
    })
    
    return examples
  }
  
  function getMemoryColor(memory: Memory) {
    const { valence, arousal } = memory.emotion
    
    if (valence > 50 && arousal > 150) return '#00FF00' // Happy/Excited - Green
    if (valence > 50 && arousal <= 150) return '#00FFFF' // Calm/Content - Cyan
    if (valence <= -50 && arousal > 150) return '#FF00FF' // Anxious - Magenta
    if (valence <= -50 && arousal <= 150) return '#FF0000' // Sad - Red
    return '#FFFF00' // Neutral - Yellow
  }
  
  function drawTimeline(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw timeline axis
    ctx.strokeStyle = '#00FFFF'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(50, timelineHeight - 50)
    ctx.lineTo(timelineWidth - 50, timelineHeight - 50)
    ctx.stroke()
    
    // Draw time markers - use monospace for better readability
    ctx.font = '12px Share Tech Mono, monospace'
    ctx.fillStyle = '#FFFF00'
    
    const labels = ['1 Year', '6 Months', '3 Months', '1 Month', 'Now']
    const positions = [100, 250, 400, 550, 700]
    
    labels.forEach((label, i) => {
      ctx.fillText(label, positions[i] - 20, timelineHeight - 30)
      
      // Draw tick
      ctx.beginPath()
      ctx.moveTo(positions[i], timelineHeight - 55)
      ctx.lineTo(positions[i], timelineHeight - 45)
      ctx.stroke()
    })
    
    // Draw memories as wave nodes
    memories.forEach(memory => {
      const age = Date.now() - memory.timestamp
      const maxAge = 365 * 24 * 60 * 60 * 1000 // 1 year
      const x = 100 + (1 - age / maxAge) * 600
      const y = timelineHeight - 50 - memory.frequency * 150
      
      // Draw wave connection
      ctx.strokeStyle = getMemoryColor(memory)
      ctx.globalAlpha = memory.amplitude
      ctx.beginPath()
      ctx.moveTo(x, timelineHeight - 50)
      ctx.lineTo(x, y)
      ctx.stroke()
      
      // Draw memory node
      ctx.fillStyle = getMemoryColor(memory)
      ctx.beginPath()
      ctx.arc(x, y, memoryRadius + memory.amplitude * 4, 0, Math.PI * 2)
      ctx.fill()
      
      // Add glow effect
      if (selectedMemory === memory.id) {
        ctx.shadowBlur = 20
        ctx.shadowColor = getMemoryColor(memory)
        ctx.fill()
        ctx.shadowBlur = 0
      }
      
      ctx.globalAlpha = 1
    })
    
    // Draw title - keep pixel font for headers
    ctx.font = '12px Press Start 2P'
    ctx.fillStyle = '#FF00FF'
    ctx.shadowBlur = 3
    ctx.shadowColor = '#FF00FF'
    ctx.fillText('Timeline: Memories as Wave Patterns', 10, 30)
    ctx.shadowBlur = 0
  }
  
  function findMemoryAt(x: number, y: number) {
    for (const memory of memories) {
      const age = Date.now() - memory.timestamp
      const maxAge = 365 * 24 * 60 * 60 * 1000
      const mx = 100 + (1 - age / maxAge) * 600
      const my = timelineHeight - 50 - memory.frequency * 150
      
      const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2)
      if (dist < memoryRadius + memory.amplitude * 4 + 5) {
        return memory
      }
    }
    return null
  }
  
  function handleMouseMove(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const memory = findMemoryAt(x, y)
    selectedMemory = memory ? memory.id : null
  }
  
  function animate() {
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    timeOffset += 0.01
    
    drawTimeline(ctx)
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  onMount(() => {
    canvas.width = timelineWidth
    canvas.height = timelineHeight
    memories = generateMemories()
    animate()
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  })
</script>

<section class="timeline-viewer neon-border">
  <h2>Memory Timeline Explorer</h2>
  <div class="canvas-container">
    <canvas 
      bind:this={canvas}
      onmousemove={handleMouseMove}
      class="timeline-canvas"
    ></canvas>
    
    {#if selectedMemory}
      {@const memory = memories.find(m => m.id === selectedMemory)}
      {#if memory}
        <div class="memory-details">
          <h3>Memory Details</h3>
          <p><span class="label">Content:</span> {memory.text}</p>
          <p><span class="label">Wave:</span> {memory.frequency.toFixed(2)} Hz @ {memory.amplitude.toFixed(2)} amplitude</p>
          <p><span class="label">Emotion:</span> Valence: {memory.emotion.valence}, Arousal: {memory.emotion.arousal}</p>
          <p><span class="label">Project:</span> {memory.project === 'both' ? 'Smart Tree + Mem8' : memory.project}</p>
        </div>
      {/if}
    {:else}
      <div class="instructions">
        <p>Hover over memory nodes to see details</p>
        <p class="legend">
          <span style="color: #00FF00">● Happy</span>
          <span style="color: #00FFFF">● Calm</span>
          <span style="color: #FFFF00">● Neutral</span>
          <span style="color: #FF00FF">● Anxious</span>
          <span style="color: #FF0000">● Sad</span>
        </p>
      </div>
    {/if}
  </div>
</section>

<style>
  .timeline-viewer {
    margin-top: 3rem;
    padding: 2rem;
  }
  
  .canvas-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .timeline-canvas {
    border: 2px solid var(--color-magenta);
    box-shadow: 0 0 20px var(--color-magenta);
    cursor: crosshair;
    background: rgba(0, 0, 0, 0.8);
  }
  
  .memory-details, .instructions {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--color-cyan);
    padding: 1.5rem;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 0 15px var(--color-cyan);
  }
  
  .memory-details h3 {
    color: var(--color-magenta);
    margin-bottom: 1rem;
    text-shadow: 0 0 10px var(--color-magenta);
  }
  
  .memory-details p {
    margin: 0.5rem 0;
    color: var(--color-cyan);
  }
  
  .label {
    color: var(--color-yellow);
    font-weight: bold;
  }
  
  .instructions {
    text-align: center;
    color: var(--color-yellow);
  }
  
  .legend {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    font-size: 0.9rem;
  }
  
  .legend span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>