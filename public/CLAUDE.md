# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

All development commands go through the interactive `scripts/manage.sh`:

```bash
# Interactive mode (recommended)
./scripts/manage.sh                    # Opens colorful menu with humor and pizzazz

# Direct commands
./scripts/manage.sh dev                # Start development server
./scripts/manage.sh build              # Build for production
./scripts/manage.sh preview            # Preview production build
./scripts/manage.sh install            # Install dependencies with pnpm
./scripts/manage.sh check              # Run type checking
./scripts/manage.sh clean              # Clean build artifacts

# Additional commands via pnpm
pnpm run check:watch                   # Continuous type checking

# Requirements
# - Node.js 18+ required
# - pnpm package manager (install: npm install -g pnpm)
```

## Architecture Overview

Mem8 Explorer is a web-based visualization tool for the Mem8 memory system, designed with an 80s retro aesthetic to make wave-based memory concepts accessible and fun.

### Core Design Principles

1. **Modern Stack**: Svelte 5 + Vite + TypeScript with pnpm for fast, efficient development
2. **80s Aesthetic**: Neon colors, CRT effects, pixel fonts, synthwave vibes
3. **Educational Focus**: Direct links to ARCHITECTURE.md sections for concept exploration
4. **Interactive Visualizations**: Canvas-based wave grid showing memory propagation and interference

### Project Structure

```
mem8-explorer/
├── src/
│   ├── App.svelte              # Main application component
│   ├── main.js                 # Entry point
│   ├── lib/
│   │   └── components/         # Svelte components
│   │       ├── Header.svelte   # Animated header
│   │       ├── Hero.svelte     # Welcome section
│   │       ├── Visualizer.svelte # Interactive wave grid
│   │       ├── ConceptLinks.svelte # Architecture links
│   │       └── Footer.svelte   # Footer with quotes
│   └── styles/
│       └── global.css          # Global styles and CSS variables
├── index.html                  # Vite entry point
├── package.json                # Dependencies (uses pnpm)
├── vite.config.js              # Vite configuration
├── svelte.config.js            # Svelte configuration
├── tsconfig.json               # TypeScript configuration
├── ARCHITECTURE.md             # Detailed wave-based memory concepts
├── Context.md                  # Project vision and implementation ideas
└── scripts/
    └── manage.sh               # Interactive development script
```

### Key Features

**Current Implementation**
- Interactive 2D memory grid visualization with wave propagation
- Real-time wave pattern animations using Canvas API
- Mouse-controlled memory wave creation
- Wave equation display: M(x,t) = A(x,t)e^(i(ωt-kx)) · D(t) · E(x,t)
- CRT scanline effects and neon color scheme
- Responsive grid layout for concept cards
- Direct navigation to ARCHITECTURE.md sections

**Planned Features**
- Memory decay and interference demonstrations
- Cross-sensory binding visualizations
- WebSocket connection to live Mem8 instance
- 8-bit sound effects and synthwave audio
- 3D visualization with Three.js (dependency already included)

### Styling Guidelines

The project uses a consistent 80s aesthetic:
- **Colors**: Black background, neon magenta (#ff00ff), cyan (#00ffff), yellow (#ffff00), green (#00ff00)
- **Effects**: CRT scanlines, neon text-shadow glows, flicker animations
- **Fonts**: 'Press Start 2P' for pixel font aesthetic
- **Borders**: 2px solid with glow effects on hover
- **Canvas**: Pixelated rendering with crisp edges

### Integration with Parent Mem8

This explorer serves as a visual interface to understand Mem8's core concepts:
- Wave-based memory storage (M(x,t) = A(x,t)e^(i(ωt-kx)) · D(t) · E(x,t))
- 2D grid structure with BindCell packing
- Emotional context influence on memory decay
- Cross-sensory binding mechanisms
- Consciousness/subconscious processing layers

The Visualizer component implements a simplified version of Mem8's wave propagation algorithm, showing how memories spread through the grid and interfere with each other.

### Development Workflow

1. Use `./scripts/manage.sh` for all commands (interactive menu recommended)
2. Test visual changes by running `dev` command
3. Keep the 80s aesthetic consistent when adding features
4. Link new visualizations to relevant ARCHITECTURE.md sections
5. Use TypeScript for type safety - the project has strict checking enabled

### Technical Notes

- The manage.sh script includes robust path resolution using SCRIPT_DIR
- All file paths in the script are relative to the script location
- The project uses pnpm for package management (faster than npm)
- Vite configuration includes automatic browser opening on dev server start
- Three.js is included as a dependency for future 3D visualizations
- TypeScript paths are configured for `$lib` alias pointing to `src/lib`

### Wave Visualization Details

The current Visualizer component simulates:
- **Wave Propagation**: Using neighbor cell averaging
- **Dampening**: 0.98 factor to simulate natural decay
- **Time-based Patterns**: Sine/cosine waves for ambient motion
- **Interactive Ripples**: Mouse movement creates memory waves
- **Color Intensity**: Based on wave height (amplitude)

### Current Development Focus

1. **Immediate**: Enhance Canvas visualization with more accurate wave physics
2. **Next**: Add memory decay visualization and emotional anchoring
3. **Future**: WebSocket integration for real-time memory viewing
4. **Long-term**: Full interactive memory exploration with search/filter

## Docker Deployment

The project includes Docker support for easy deployment with Coolify or other container platforms:

```bash
# Build Docker image
./scripts/manage.sh docker-build

# Run with docker-compose
./scripts/manage.sh docker-run

# Stop container
./scripts/manage.sh docker-stop

# Or use docker-compose directly
docker-compose up -d
docker-compose down
```

### Docker Configuration

- **Dockerfile**: Multi-stage build optimized for production
  - Build stage: Compiles Svelte app with all dev dependencies
  - Production stage: Minimal image with only production dependencies
  - Uses `serve` for static file serving
- **docker-compose.yml**: Configured for Coolify deployment
  - Port 3000 exposed
  - Health checks included
  - Coolify-specific labels added
  - Auto-restart enabled

### Deployment Notes

- The container serves the static build on port 3000
- Health checks ensure the container is running properly
- Suitable for deployment on Coolify, Portainer, or standard Docker hosts
- Environment variables can be added to docker-compose.yml as needed