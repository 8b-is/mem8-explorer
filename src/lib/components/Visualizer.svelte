<script lang="ts">
  import { onMount } from 'svelte'
  
  let canvas: HTMLCanvasElement
  let animationFrame: number
  let time = $state(0)
  let mouseX = $state(0)
  let mouseY = $state(0)
  
  // Wave visualization parameters
  const gridSize = 40
  const cellSize = 10
  const waveSpeed = 0.002
  const dampening = 0.98
  
  interface GridCell {
    height: number
    velocity: number
    color: { r: number; g: number; b: number }
  }
  
  let grid: GridCell[][] = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill(null).map(() => ({
      height: 0,
      velocity: 0,
      color: { r: 0, g: 255, b: 255 }
    }))
  )
  
  function handleMouseMove(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
  }
  
  function handleMouseEnter(event: MouseEvent) {
    // Optional: Add visual feedback when mouse enters the grid
    console.log('Mouse entered the grid')
  }
  
  function handleMouseLeave(event: MouseEvent) {
    // Optional: Reset or pause effects when mouse leaves
    console.log('Mouse left the grid')
  }
  
  function handleClick(event: MouseEvent) {
    // Create a bigger ripple on click
    const rect = canvas.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top
    const gridX = Math.floor(clickX / cellSize)
    const gridY = Math.floor(clickY / cellSize)
    
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      // Create a stronger wave on click
      grid[gridY][gridX].velocity += 2.0
      
      // Optional: Change color on click
      grid[gridY][gridX].color = { 
        r: Math.random() * 100, 
        g: 200 + Math.random() * 55, 
        b: 200 + Math.random() * 55 
      }
    }
  }
  
  function drawGrid(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw grid cells
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cell = grid[i][j]
        const x = j * cellSize
        const y = i * cellSize
        
        // Calculate color based on wave height
        const intensity = Math.abs(cell.height) * 50
        const r = Math.min(255, cell.color.r + intensity)
        const g = Math.min(255, cell.color.g + intensity)
        const b = Math.min(255, cell.color.b + intensity)
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1)
        
        // Add glow effect for high intensity cells
        if (intensity > 100) {
          ctx.shadowBlur = 10
          ctx.shadowColor = `rgb(${r}, ${g}, ${b})`
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1)
          ctx.shadowBlur = 0
        }
      }
    }
    
    // Draw wave equation - keep pixel font for this special element
    ctx.font = '11px Press Start 2P'
    ctx.fillStyle = '#FFFF00'
    ctx.shadowBlur = 3
    ctx.shadowColor = '#FFFF00'
    ctx.fillText('M(x,t) = A(x,t)e^(i(ωt-kx)) · D(t) · E(x,t)', 10, canvas.height - 20)
    ctx.shadowBlur = 0
  }
  
  function updateWaves() {
    // Create ripples based on mouse position
    const gridX = Math.floor(mouseX / cellSize)
    const gridY = Math.floor(mouseY / cellSize)
    
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      grid[gridY][gridX].velocity += 0.5
    }
    
    // Update wave propagation
    for (let i = 1; i < gridSize - 1; i++) {
      for (let j = 1; j < gridSize - 1; j++) {
        // Wave equation simulation
        const neighbors = 
          grid[i-1][j].height + 
          grid[i+1][j].height + 
          grid[i][j-1].height + 
          grid[i][j+1].height
        
        grid[i][j].velocity += (neighbors / 4 - grid[i][j].height) * waveSpeed
        grid[i][j].velocity *= dampening
        grid[i][j].height += grid[i][j].velocity
        
        // Add time-based wave patterns
        grid[i][j].height += Math.sin(time * 0.001 + i * 0.1) * 0.01
        grid[i][j].height += Math.cos(time * 0.001 + j * 0.1) * 0.01
      }
    }
  }
  
  function animate() {
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    time++
    
    updateWaves()
    drawGrid(ctx)
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  onMount(() => {
    canvas.width = gridSize * cellSize
    canvas.height = gridSize * cellSize
    animate()
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  })
</script>

<section class="visualizer neon-border grid-background">
  <h2>The Grid Awaits...</h2>
  <div class="canvas-container">
    <canvas 
      bind:this={canvas}
      onmousemove={handleMouseMove}
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
      onclick={handleClick}
      class="memory-grid"
    ></canvas>
    <div class="controls">
      <p>Move your mouse over the grid to create memory waves!</p>
      <p class="hint">Watch as memories propagate, interfere, and decay...</p>
    </div>
  </div>
</section>

<style>
  .visualizer {
    margin-top: 2rem;
    text-align: center;
  }
  
  .canvas-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .memory-grid {
    border: 2px solid var(--color-cyan);
    box-shadow: 0 0 20px var(--color-cyan);
    cursor: crosshair;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }
  
  .controls {
    text-align: center;
  }
  
  .controls p {
    margin: 0.5rem 0;
    color: var(--color-yellow);
  }
  
  .hint {
    font-size: 0.8rem;
    color: var(--color-cyan) !important;
    opacity: 0.8;
  }
</style>