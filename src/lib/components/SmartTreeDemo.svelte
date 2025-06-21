<script lang="ts">
  import { onMount } from 'svelte'
  
  interface SensorData {
    moisture: number
    temperature: number
    light: number
    humidity: number
  }
  
  interface SensorMemory {
    timestamp: number
    moisture: number
    temperature: number
    light: number
    frequency: number
    amplitude: number
    emotion: { valence: number; arousal: number; dominance: number }
  }
  
  let canvas: HTMLCanvasElement
  let animationFrame: number
  let sensorData = $state<SensorData>({
    moisture: 65,
    temperature: 22,
    light: 750,
    humidity: 45
  })
  let wateringActive = $state(false)
  let memories = $state<SensorMemory[]>([])
  
  // Smart Tree visualization parameters
  const canvasWidth = 600
  const canvasHeight = 400
  const treeX = 300
  const treeY = 300
  
  // Generate sensor memories
  function generateSensorMemory() {
    const memory = {
      timestamp: Date.now(),
      moisture: sensorData.moisture,
      temperature: sensorData.temperature,
      light: sensorData.light,
      frequency: 0.5 + (sensorData.moisture / 100) * 0.3,
      amplitude: 0.7 + (sensorData.light / 1000) * 0.3,
      emotion: {
        valence: sensorData.moisture > 40 && sensorData.moisture < 80 ? 80 : -40,
        arousal: Math.abs(sensorData.moisture - 60) * 3,
        dominance: 128
      }
    }
    
    memories = [...memories.slice(-50), memory]
    
    // Auto-water if too dry
    if (sensorData.moisture < 30 && !wateringActive) {
      activateWatering()
    }
  }
  
  function activateWatering() {
    wateringActive = true
    setTimeout(() => {
      wateringActive = false
      sensorData.moisture = Math.min(100, sensorData.moisture + 25)
    }, 3000)
  }
  
  // 8-bit color palette
  const PIXEL_SIZE = 4
  const TREE_COLORS = {
    trunk: '#8B4513',
    trunkDark: '#654321',
    leafHealthy: '#00FF00',
    leafDry: '#FFFF00',
    leafDead: '#8B4513',
    soil: '#654321',
    soilWet: '#4B3621',
    sky: '#001122',
    water: '#00AAFF'
  }
  
  // Helper to draw pixelated blocks
  function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    ctx.fillStyle = color
    ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
  }
  
  // Draw 8-bit style rectangle
  function drawPixelRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
    ctx.fillStyle = color
    for (let px = 0; px < w; px++) {
      for (let py = 0; py < h; py++) {
        drawPixel(ctx, x + px, y + py, color)
      }
    }
  }
  
  function drawTree(ctx: CanvasRenderingContext2D) {
    // Enable crisp pixels
    ctx.imageSmoothingEnabled = false
    
    // Clear with sky gradient (8-bit style)
    for (let y = 0; y < canvasHeight / PIXEL_SIZE; y++) {
      const gradient = Math.floor(y / 10)
      const color = gradient < 5 ? '#000033' : gradient < 10 ? '#001122' : '#000000'
      for (let x = 0; x < canvasWidth / PIXEL_SIZE; x++) {
        drawPixel(ctx, x, y, color)
      }
    }
    
    // Draw pixelated stars
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * (canvasWidth / PIXEL_SIZE))
      const y = Math.floor(Math.random() * 40)
      drawPixel(ctx, x, y, Math.random() > 0.5 ? '#FFFFFF' : '#FFFF00')
    }
    
    // Draw soil layers
    const soilY = 80
    for (let y = soilY; y < 100; y++) {
      for (let x = 0; x < canvasWidth / PIXEL_SIZE; x++) {
        const isMoist = x < (canvasWidth / PIXEL_SIZE) * (sensorData.moisture / 100)
        const color = isMoist ? TREE_COLORS.soilWet : TREE_COLORS.soil
        // Add some texture
        if (Math.random() > 0.7) {
          drawPixel(ctx, x, y, isMoist ? '#3B2611' : '#554321')
        } else {
          drawPixel(ctx, x, y, color)
        }
      }
    }
    
    // Calculate tree health for coloring
    const treeHealth = (sensorData.moisture + sensorData.light / 10) / 2
    const leafColor = treeHealth > 70 ? TREE_COLORS.leafHealthy : 
                     treeHealth > 40 ? TREE_COLORS.leafDry : 
                     TREE_COLORS.leafDead
    
    // Draw 8-bit tree trunk with bark texture
    const trunkX = 70
    const trunkY = 50
    const trunkWidth = 10
    const trunkHeight = 30
    
    for (let y = 0; y < trunkHeight; y++) {
      for (let x = 0; x < trunkWidth; x++) {
        const color = (x === 0 || x === trunkWidth - 1 || Math.random() > 0.8) 
          ? TREE_COLORS.trunkDark 
          : TREE_COLORS.trunk
        drawPixel(ctx, trunkX + x, trunkY + y, color)
      }
    }
    
    // Draw 8-bit tree crown (pyramid style)
    const crownLevels = [
      { y: 30, width: 30, offset: 5 },
      { y: 35, width: 40, offset: 0 },
      { y: 40, width: 50, offset: -5 },
      { y: 45, width: 40, offset: 0 },
      { y: 50, width: 20, offset: 10 }
    ]
    
    crownLevels.forEach(level => {
      const startX = trunkX - 10 + level.offset
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < level.width; x++) {
          // Create leafy texture
          if (Math.random() > 0.3) {
            const shade = Math.random() > 0.7 ? 
              (leafColor === TREE_COLORS.leafHealthy ? '#00CC00' : 
               leafColor === TREE_COLORS.leafDry ? '#CCCC00' : '#6B4513') : 
              leafColor
            drawPixel(ctx, startX + x, level.y + y, shade)
          }
        }
      }
    })
    
    // Draw 8-bit style sensor display panel
    const panelX = 2
    const panelY = 2
    const panelWidth = 50
    const panelHeight = 25
    
    // Draw panel background
    drawPixelRect(ctx, panelX, panelY, panelWidth, panelHeight, '#000033')
    drawPixelRect(ctx, panelX + 1, panelY + 1, panelWidth - 2, panelHeight - 2, '#000000')
    
    // Draw sensor values with 8-bit font
    ctx.font = '8px Press Start 2P'
    ctx.imageSmoothingEnabled = false
    
    // Moisture bar
    ctx.fillStyle = '#00FFFF'
    ctx.fillText('MOIST:', 12, 20)
    const moistBarWidth = Math.floor((sensorData.moisture / 100) * 30)
    for (let x = 0; x < moistBarWidth; x++) {
      drawPixel(ctx, 20 + x, 3, sensorData.moisture > 60 ? '#00FF00' : sensorData.moisture > 30 ? '#FFFF00' : '#FF0000')
    }
    
    // Temperature
    ctx.fillStyle = '#FF8800'
    ctx.fillText(`TEMP:${Math.floor(sensorData.temperature)}C`, 12, 35)
    
    // Light indicator (sun icon)
    ctx.fillStyle = '#FFD700'
    ctx.fillText(`LUX:${Math.floor(sensorData.light)}`, 12, 50)
    
    // Humidity
    ctx.fillStyle = '#87CEEB'
    ctx.fillText(`HUM:${Math.floor(sensorData.humidity)}%`, 12, 65)
    
    // Draw 8-bit watering animation
    if (wateringActive) {
      const waterDrops = [
        { x: 65, y: 45 },
        { x: 70, y: 40 },
        { x: 75, y: 42 },
        { x: 80, y: 38 },
        { x: 85, y: 44 }
      ]
      
      waterDrops.forEach((drop, i) => {
        const animOffset = (Date.now() / 100 + i * 2) % 20
        // Draw water drops as 2x2 pixel blocks
        drawPixel(ctx, drop.x, drop.y + animOffset, TREE_COLORS.water)
        drawPixel(ctx, drop.x + 1, drop.y + animOffset, TREE_COLORS.water)
        drawPixel(ctx, drop.x, drop.y + animOffset + 1, '#0088CC')
        drawPixel(ctx, drop.x + 1, drop.y + animOffset + 1, '#0088CC')
      })
      
      // Draw watering can (8-bit style)
      const canX = 90
      const canY = 30
      drawPixelRect(ctx, canX, canY, 8, 6, '#888888')
      drawPixelRect(ctx, canX + 8, canY + 2, 3, 1, '#888888') // Spout
      drawPixelRect(ctx, canX + 2, canY - 2, 4, 2, '#888888') // Handle
    }
    
    // Draw 8-bit wave pattern history
    const waveX = 100
    const waveY = 15
    const waveWidth = 40
    const waveHeight = 10
    
    // Wave background
    drawPixelRect(ctx, waveX, waveY - 5, waveWidth, waveHeight + 2, '#330033')
    
    // Draw pixelated wave
    memories.slice(-waveWidth).forEach((memory, i) => {
      const height = Math.floor(memory.frequency * waveHeight)
      const yPos = waveY - height
      
      // Draw vertical bar for this memory
      for (let y = 0; y < height; y++) {
        const color = memory.emotion.valence > 0 ? '#00FF00' : '#FF0000'
        drawPixel(ctx, waveX + i, yPos + y, color)
      }
    })
    
    // Wave label
    ctx.fillStyle = '#FF00FF'
    ctx.font = '8px Press Start 2P'
    ctx.fillText('WAVE MEM', waveX * PIXEL_SIZE, (waveY - 7) * PIXEL_SIZE)
  }
  
  function simulateSensorChanges() {
    // Natural variations
    sensorData.moisture = Math.max(0, Math.min(100, 
      sensorData.moisture - 0.5 + Math.random() * 0.3))
    
    sensorData.temperature = Math.max(15, Math.min(35,
      sensorData.temperature + (Math.random() - 0.5) * 0.2))
    
    // Light cycles (day/night simulation)
    const hour = (Date.now() / 10000) % 24
    sensorData.light = Math.max(100, Math.min(1000,
      500 + Math.sin(hour * Math.PI / 12) * 400 + Math.random() * 50))
    
    sensorData.humidity = Math.max(20, Math.min(80,
      sensorData.humidity + (Math.random() - 0.5) * 0.5))
  }
  
  function animate() {
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    simulateSensorChanges()
    generateSensorMemory()
    drawTree(ctx)
    
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

<section class="smart-tree-demo neon-border">
  <h2>Smart Tree IoT Monitoring</h2>
  <div class="demo-container">
    <canvas 
      bind:this={canvas}
      class="tree-canvas"
    ></canvas>
    
    <div class="info-panel">
      <h3>Project Context</h3>
      <p>The Smart Tree project was our IoT plant monitoring system built with:</p>
      <ul>
        <li><span class="tech">Rust</span> - For reliable system programming</li>
        <li><span class="tech">ESP32</span> - WiFi-enabled microcontroller</li>
        <li><span class="tech">Sensors</span> - Moisture, temperature, light, humidity</li>
      </ul>
      
      <div class="memory-integration">
        <h4>Mem8 Integration Concept</h4>
        <p>Each sensor reading creates a wave pattern in Mem8:</p>
        <ul>
          <li>Frequency: Based on moisture levels</li>
          <li>Amplitude: Influenced by light intensity</li>
          <li>Emotion: Plant health status</li>
        </ul>
        <p class="note">Watch the purple wave pattern track the plant's "memory" of its conditions!</p>
      </div>
      
      <button 
        class="water-button"
        onclick={() => activateWatering()}
        disabled={wateringActive}
      >
        {wateringActive ? 'Watering...' : 'Water Plant'} 💧
      </button>
    </div>
  </div>
</section>

<style>
  .smart-tree-demo {
    margin-top: 3rem;
    padding: 2rem;
  }
  
  .demo-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }
  
  .tree-canvas {
    border: 4px solid var(--color-green);
    box-shadow: 
      0 0 20px var(--color-green),
      inset 0 0 20px rgba(0, 255, 0, 0.1);
    width: 100%;
    max-width: 600px;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    background: #000033;
    /* Add scanline effect */
    position: relative;
  }
  
  .tree-canvas::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      rgba(0, 255, 0, 0.03) 50%,
      rgba(0, 0, 0, 0.1) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    animation: scanlines 8s linear infinite;
  }
  
  @keyframes scanlines {
    0% { background-position: 0 0; }
    100% { background-position: 0 10px; }
  }
  
  .info-panel {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid var(--color-cyan);
    padding: 1.5rem;
    box-shadow: 0 0 15px var(--color-cyan);
  }
  
  .info-panel h3, .info-panel h4 {
    color: var(--color-magenta);
    margin-bottom: 1rem;
    text-shadow: 0 0 10px var(--color-magenta);
  }
  
  .info-panel ul {
    list-style: none;
    padding-left: 1rem;
    margin: 1rem 0;
  }
  
  .info-panel li {
    margin: 0.5rem 0;
    color: var(--color-cyan);
  }
  
  .tech {
    color: var(--color-yellow);
    font-weight: bold;
  }
  
  .memory-integration {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid var(--color-magenta);
  }
  
  .note {
    color: var(--color-green);
    font-size: 0.9rem;
    margin-top: 1rem;
    font-style: italic;
  }
  
  .water-button {
    background: var(--color-cyan);
    color: var(--color-black);
    border: 4px solid var(--color-black);
    box-shadow: 
      4px 4px 0 var(--color-magenta),
      inset -2px -2px 0 rgba(0, 0, 0, 0.5),
      inset 2px 2px 0 rgba(255, 255, 255, 0.3);
    padding: 0.75rem 1.5rem;
    font-family: var(--font-retro);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.1s ease;
    margin-top: 1.5rem;
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
  }
  
  .water-button:hover:not(:disabled) {
    background: var(--color-magenta);
    transform: translate(2px, 2px);
    box-shadow: 
      2px 2px 0 var(--color-cyan),
      inset -2px -2px 0 rgba(0, 0, 0, 0.5),
      inset 2px 2px 0 rgba(255, 255, 255, 0.3);
  }
  
  .water-button:active:not(:disabled) {
    transform: translate(4px, 4px);
    box-shadow: 
      0 0 0 var(--color-magenta),
      inset -2px -2px 0 rgba(0, 0, 0, 0.5),
      inset 2px 2px 0 rgba(255, 255, 255, 0.3);
  }
  
  .water-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 
      4px 4px 0 #666666,
      inset -2px -2px 0 rgba(0, 0, 0, 0.5),
      inset 2px 2px 0 rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 900px) {
    .demo-container {
      grid-template-columns: 1fr;
    }
  }
</style>