<script>
  import Header from './lib/components/Header.svelte'
  import Hero from './lib/components/Hero.svelte'
  import Visualizer from './lib/components/Visualizer.svelte'
  import ConceptLinks from './lib/components/ConceptLinks.svelte'
  import Footer from './lib/components/Footer.svelte'
</script>

<div class="app-container crt-effect">
  <Header />
  
  <main>
    <Hero />
    <Visualizer />
    <ConceptLinks />
  </main>
  
  <Footer />
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }
  
  main {
    width: 100%;
    max-width: 1200px;
    flex-grow: 1;
  }
</style>