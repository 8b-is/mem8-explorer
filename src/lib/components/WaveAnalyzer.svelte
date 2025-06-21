<script lang="ts">
  import { onMount } from 'svelte'
  
  type WaveType = 'memory' | 'emotion' | 'decay'
  type SelectedWaveType = WaveType | 'all'
  
  interface Wave {
    frequency: number
    amplitude: number
    phase: number
    color: string
    label: string
  }
  
  let canvas: HTMLCanvasElement
  let animationFrame: number
  let time = $state(0)
  let selectedWave = $state<SelectedWaveType>('memory')
  let interference = $state(true)
  let decay = $state(true)
  
  // Wave parameters
  const waves: Record<WaveType, Wave> = {
    memory: {
      frequency: 0.8,
      amplitude: 0.9,
      phase: 0,
      color: '#00FFFF',
      label: 'Memory Wave'
    },
    emotion: {
      frequency: 1.2,
      amplitude: 0.7,
      phase: Math.PI / 4,
      color: '#FF00FF',
      label: 'Emotional Modulation'
    },
    decay: {
      frequency: 0.3,
      amplitude: 0.5,
      phase: Math.PI / 2,
      color: '#FFFF00',
      label: 'Decay Function'
    }
  }
  
  const canvasWidth = 800
  const canvasHeight = 400
  const waveHeight = 100
  const centerY = canvasHeight / 2
  
  function calculateWave(x: number, waveType: WaveType, includeDecay = true) {
    const wave = waves[waveType]
    const t = time * 0.01
    
    // Basic wave equation: M(x,t) = A(x,t)e^(i(ωt-kx))
    let y = wave.amplitude * Math.sin(wave.frequency * x * 0.02 + t + wave.phase)
    
    // Apply decay if enabled
    if (includeDecay && decay) {
      const decayFactor = Math.exp(-x * 0.001)
      y *= decayFactor
    }
    
    return y * waveHeight
  }
  
  function drawGrid(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 1
    
    // Vertical lines
    for (let x = 0; x < canvasWidth; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeight)
      ctx.stroke()
    }
    
    // Horizontal lines
    for (let y = 0; y < canvasHeight; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidth, y)
      ctx.stroke()
    }
    
    // Center line
    ctx.strokeStyle = '#666666'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(canvasWidth, centerY)
    ctx.stroke()
  }
  
  function drawWave(ctx: CanvasRenderingContext2D, waveType: WaveType, offset = 0) {
    const wave = waves[waveType]
    ctx.strokeStyle = wave.color
    ctx.lineWidth = 3
    ctx.shadowBlur = 10
    ctx.shadowColor = wave.color
    
    ctx.beginPath()
    for (let x = 0; x < canvasWidth; x += 2) {
      const y = calculateWave(x, waveType) + centerY + offset
      
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
    ctx.shadowBlur = 0
  }
  
  function drawInterference(ctx: CanvasRenderingContext2D) {
    if (!interference) return
    
    ctx.strokeStyle = '#00FF00'
    ctx.lineWidth = 2
    ctx.shadowBlur = 15
    ctx.shadowColor = '#00FF00'
    
    ctx.beginPath()
    for (let x = 0; x < canvasWidth; x += 2) {
      // Combine memory and emotion waves
      const memoryY = calculateWave(x, 'memory')
      const emotionY = calculateWave(x, 'emotion')
      const combinedY = (memoryY + emotionY) * 0.6 + centerY
      
      if (x === 0) {
        ctx.moveTo(x, combinedY)
      } else {
        ctx.lineTo(x, combinedY)
      }
    }
    ctx.stroke()
    ctx.shadowBlur = 0
  }
  
  function drawLabels(ctx: CanvasRenderingContext2D) {
    ctx.font = '12px Press Start 2P'
    
    // Wave equation
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText('M(x,t) = A(x,t)e^(i(ωt-kx)) · D(t) · E(x,t)', 10, 30)
    
    // Legend
    let y = 60
    Object.entries(waves).forEach(([key, wave]) => {
      ctx.fillStyle = wave.color
      ctx.fillRect(10, y - 10, 20, 10)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(wave.label, 40, y)
      y += 25
    })
    
    if (interference) {
      ctx.fillStyle = '#00FF00'
      ctx.fillRect(10, y - 10, 20, 10)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText('Interference Pattern', 40, y)
    }
    
    // Parameters
    ctx.fillStyle = '#FFFF00'
    ctx.fillText(`Time: ${(time * 0.01).toFixed(2)}`, canvasWidth - 200, 30)
    ctx.fillText(`Decay: ${decay ? 'ON' : 'OFF'}`, canvasWidth - 200, 50)
  }
  
  function animate() {
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    drawGrid(ctx)
    
    // Draw individual waves
    if (selectedWave === 'all' || selectedWave === 'memory') {
      drawWave(ctx, 'memory')
    }
    if (selectedWave === 'all' || selectedWave === 'emotion') {
      drawWave(ctx, 'emotion', -50)
    }
    if (selectedWave === 'all' || selectedWave === 'decay') {
      drawWave(ctx, 'decay', 50)
    }
    
    // Draw interference pattern
    drawInterference(ctx)
    
    drawLabels(ctx)
    
    time++
    animationFrame = requestAnimationFrame(animate)
  }
  
  onMount(() => {
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    animate()
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  })
</script>

<section class="wave-analyzer neon-border">
  <h2>Wave Pattern Analyzer</h2>
  
  <div class="analyzer-container">
    <canvas 
      bind:this={canvas}
      class="wave-canvas"
    ></canvas>
    
    <div class="controls">
      <div class="control-group">
        <label for="wave-select">Select Wave:</label>
        <select id="wave-select" bind:value={selectedWave}>
          <option value="all">All Waves</option>
          <option value="memory">Memory Wave</option>
          <option value="emotion">Emotional Modulation</option>
          <option value="decay">Decay Function</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" bind:checked={interference} />
          Show Interference
        </label>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" bind:checked={decay} />
          Apply Decay
        </label>
      </div>
    </div>
    
    <div class="explanation">
      <h3>Understanding Wave Patterns</h3>
      <p>In Mem8, memories propagate as waves through a 2D grid:</p>
      <ul>
        <li><span class="highlight-cyan">Memory waves</span> carry the core information</li>
        <li><span class="highlight-magenta">Emotional modulation</span> affects memory persistence</li>
        <li><span class="highlight-yellow">Decay function</span> simulates natural forgetting</li>
        <li><span class="highlight-green">Interference patterns</span> create emergent behaviors</li>
      </ul>
      <p class="note">
        Watch how waves combine and interfere, creating complex patterns that mirror
        how human memory works - not as static storage, but as dynamic, living patterns.
      </p>
    </div>
  </div>
</section>

<style>
  .wave-analyzer {
    margin-top: 3rem;
    padding: 2rem;
  }
  
  .analyzer-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
  
  .wave-canvas {
    border: 2px solid var(--color-cyan);
    box-shadow: 0 0 20px var(--color-cyan);
    width: 100%;
    max-width: 800px;
  }
  
  .controls {
    display: flex;
    gap: 2rem;
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--color-magenta);
    padding: 1rem;
    box-shadow: 0 0 15px var(--color-magenta);
  }
  
  .control-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-yellow);
  }
  
  .control-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  select {
    background: var(--color-black);
    color: var(--color-cyan);
    border: 2px solid var(--color-cyan);
    padding: 0.25rem 0.5rem;
    font-family: var(--font-retro);
    font-size: 0.8rem;
  }
  
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: var(--color-magenta);
  }
  
  .explanation {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--color-green);
    padding: 1.5rem;
    max-width: 800px;
    width: 100%;
    box-shadow: 0 0 15px var(--color-green);
  }
  
  .explanation h3 {
    color: var(--color-magenta);
    margin-bottom: 1rem;
    text-shadow: 0 0 10px var(--color-magenta);
  }
  
  .explanation ul {
    list-style: none;
    padding-left: 1rem;
    margin: 1rem 0;
  }
  
  .explanation li {
    margin: 0.5rem 0;
    color: var(--color-cyan);
  }
  
  .highlight-cyan { color: #00FFFF; font-weight: bold; }
  .highlight-magenta { color: #FF00FF; font-weight: bold; }
  .highlight-yellow { color: #FFFF00; font-weight: bold; }
  .highlight-green { color: #00FF00; font-weight: bold; }
  
  .note {
    color: var(--color-green);
    font-style: italic;
    margin-top: 1rem;
    font-size: 0.9rem;
    line-height: 1.4;
  }
</style>