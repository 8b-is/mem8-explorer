import { mount } from 'svelte'
import './styles/global.css'
import App from './App.svelte'

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