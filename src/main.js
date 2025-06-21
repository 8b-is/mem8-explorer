import { mount } from 'svelte'
import './styles/global.css'
import './styles/components.css'
import App from './App.svelte'

// Set random scanline delay before app starts (0-12 seconds for 16s cycle)
const randomDelay = Math.random() * 12
document.documentElement.style.setProperty('--scanline-delay', `${randomDelay}s`)

// Wait for DOM to be ready
function init() {
  const target = document.getElementById('app')
  if (!target) {
    console.error('Target element #app not found!')
    return
  }
  
  const app = mount(App, {
    target: target,
  })
  
  return app
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

export default init