import { mount } from 'svelte'
import './styles/global.css'
import './styles/components.css'
import App from './App.svelte'

console.log('Main.js loaded')

// Set random scanline delay before app starts (0-12 seconds for 16s cycle)
setTimeout(() => {
  const randomDelay = Math.random() * 50
  const randomOpacity = Math.random() * 0.01
  const randomMovement = Math.random() * 0.5  
  document.documentElement.style.setProperty('--scanline-delay', `${randomDelay}s`)
  document.documentElement.style.setProperty('--scanline-opacity', `${randomOpacity}`)
  document.documentElement.style.setProperty('--scanline-movement', `${randomMovement}`)
}, 1000)


// Wait for DOM to be ready
function init() {
  console.log('Init function called')
  const target = document.getElementById('app')
  if (!target) {
    console.error('Target element #app not found!')
    return
  }
  
  console.log('Target element found:', target)
  
  try {
    const app = mount(App, {
      target: target,
    })
    console.log('App mounted successfully')
    return app
  } catch (error) {
    console.error('Error mounting app:', error)
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log('DOM still loading, waiting for DOMContentLoaded')
  document.addEventListener('DOMContentLoaded', init)
} else {
  console.log('DOM already loaded, initializing immediately')
  init()
}

export default init