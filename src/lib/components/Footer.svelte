<script>
  const year = new Date().getFullYear()
  
  const quotes = [
    "Don't forget to defragment your nostalgia!",
    "Keep your memories wave-aligned!",
    "Remember: 973x faster than forgetting!",
    "Surf the memory waves, dude!",
    "May your bits be forever crisp!"
  ]
  
  let currentQuote = $state(quotes[Math.floor(Math.random() * quotes.length)])
  
  // Change quote periodically
  $effect(() => {
    const interval = setInterval(() => {
      currentQuote = quotes[Math.floor(Math.random() * quotes.length)]
    }, 8000)
    
    return () => clearInterval(interval)
  })
</script>

<footer class="neon-border">
  <p>&copy; {year} Hue & Aye Productions. All rights reserved (especially the right to party like it's 1989).</p>
  <p class="trish-quote">Trish says: "{currentQuote}"</p>
  <div class="footer-waves">
    <span class="wave">〜</span>
    <span class="wave">∿</span>
    <span class="wave">〜</span>
    <span class="wave">∿</span>
    <span class="wave">〜</span>
  </div>
</footer>

<style>
  footer {
    width: 100%;
    max-width: 1200px;
    text-align: center;
    margin-top: 2rem;
    position: relative;
  }
  
  footer p {
    color: var(--color-gray);
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }
  
  .trish-quote {
    color: var(--color-yellow) !important;
    font-style: italic;
  }
  
  .footer-waves {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
  }
  
  .wave {
    color: var(--color-cyan);
    font-size: 1.5rem;
    animation: wave-motion 3s ease-in-out infinite;
  }
  
  .wave:nth-child(2) { animation-delay: 0.5s; }
  .wave:nth-child(3) { animation-delay: 1s; }
  .wave:nth-child(4) { animation-delay: 1.5s; }
  .wave:nth-child(5) { animation-delay: 2s; }
  
  @keyframes wave-motion {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
</style>