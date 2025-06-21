/**
 * Font Detector - Detects computer type and suggests appropriate retro fonts
 * 
 * This is like a digital archaeologist, digging through your system
 * to find the perfect nostalgic font for your computing experience!
 */

export interface SystemFonts {
  primary: string
  fallback: string
  monospace: string
  description: string
}

export function detectSystemType(): string {
  const ua = navigator.userAgent.toLowerCase()
  const platform = navigator.platform.toLowerCase()
  
  // Apple/Mac detection
  if (platform.includes('mac') || ua.includes('macintosh')) {
    if (ua.includes('powerpc') || ua.includes('ppc')) {
      return 'mac-classic'
    }
    return 'mac-modern'
  }
  
  // Windows detection
  if (platform.includes('win')) {
    if (ua.includes('windows nt 5.0') || ua.includes('windows 2000')) {
      return 'win-2000'
    }
    if (ua.includes('windows nt 5.1') || ua.includes('windows xp')) {
      return 'win-xp'
    }
    if (ua.includes('windows 95') || ua.includes('win95')) {
      return 'win-95'
    }
    if (ua.includes('windows 98') || ua.includes('win98')) {
      return 'win-98'
    }
    if (ua.includes('windows nt 6.') || ua.includes('windows 7') || ua.includes('windows 8')) {
      return 'win-legacy'
    }
    return 'win-modern'
  }
  
  // Linux detection
  if (platform.includes('linux') || ua.includes('x11')) {
    if (ua.includes('ubuntu')) return 'linux-ubuntu'
    if (ua.includes('debian')) return 'linux-debian'
    if (ua.includes('fedora')) return 'linux-fedora'
    if (ua.includes('arch')) return 'linux-arch'
    return 'linux-generic'
  }
  
  // Mobile detection
  if (ua.includes('android')) return 'android'
  if (ua.includes('iphone') || ua.includes('ipad')) return 'ios'
  
  // Gaming consoles (because why not?)
  if (ua.includes('playstation')) return 'playstation'
  if (ua.includes('xbox')) return 'xbox'
  if (ua.includes('nintendo')) return 'nintendo'
  
  // Retro systems (for the true enthusiasts running emulators)
  if (ua.includes('commodore') || ua.includes('c64')) return 'commodore-64'
  if (ua.includes('amiga')) return 'amiga'
  if (ua.includes('atari')) return 'atari'
  
  return 'generic'
}

export function getSystemFonts(systemType: string): SystemFonts {
  const fontMap: Record<string, SystemFonts> = {
    'mac-classic': {
      primary: 'Chicago',
      fallback: 'Geneva',
      monospace: 'Monaco',
      description: 'Classic Mac OS (System 7-9)'
    },
    'mac-modern': {
      primary: 'SF-Mono',
      fallback: '-apple-system',
      monospace: 'Menlo',
      description: 'Modern macOS'
    },
    'win-95': {
      primary: 'MS-Sans-Serif',
      fallback: 'Fixedsys',
      monospace: 'Terminal',
      description: 'Windows 95'
    },
    'win-98': {
      primary: 'Tahoma',
      fallback: 'MS-Sans-Serif',
      monospace: 'Lucida-Console',
      description: 'Windows 98'
    },
    'win-2000': {
      primary: 'Trebuchet-MS',
      fallback: 'Tahoma',
      monospace: 'Lucida-Console',
      description: 'Windows 2000'
    },
    'win-xp': {
      primary: 'Tahoma',
      fallback: 'Franklin-Gothic',
      monospace: 'Lucida-Console',
      description: 'Windows XP'
    },
    'win-legacy': {
      primary: 'Segoe-UI',
      fallback: 'Calibri',
      monospace: 'Consolas',
      description: 'Windows 7/8'
    },
    'win-modern': {
      primary: 'Segoe-UI',
      fallback: 'Calibri',
      monospace: 'Cascadia-Code',
      description: 'Windows 10/11'
    },
    'linux-ubuntu': {
      primary: 'Ubuntu',
      fallback: 'Liberation-Sans',
      monospace: 'Ubuntu-Mono',
      description: 'Ubuntu Linux'
    },
    'linux-debian': {
      primary: 'DejaVu-Sans',
      fallback: 'Liberation-Sans',
      monospace: 'DejaVu-Sans-Mono',
      description: 'Debian Linux'
    },
    'linux-fedora': {
      primary: 'Cantarell',
      fallback: 'Liberation-Sans',
      monospace: 'Source-Code-Pro',
      description: 'Fedora Linux'
    },
    'linux-arch': {
      primary: 'Noto-Sans',
      fallback: 'DejaVu-Sans',
      monospace: 'Hack',
      description: 'Arch Linux (BTW)'
    },
    'linux-generic': {
      primary: 'Liberation-Sans',
      fallback: 'DejaVu-Sans',
      monospace: 'Liberation-Mono',
      description: 'Linux'
    },
    'android': {
      primary: 'Roboto',
      fallback: 'Droid-Sans',
      monospace: 'Droid-Sans-Mono',
      description: 'Android'
    },
    'ios': {
      primary: 'SF-Pro',
      fallback: '-apple-system',
      monospace: 'SF-Mono',
      description: 'iOS'
    },
    'commodore-64': {
      primary: 'C64-Pro',
      fallback: 'Pet-Me-64',
      monospace: 'C64-Pro-Mono',
      description: 'Commodore 64'
    },
    'amiga': {
      primary: 'Topaz',
      fallback: 'AmigaTopaz',
      monospace: 'TopazPlus',
      description: 'Amiga'
    },
    'atari': {
      primary: 'Atari-Classic',
      fallback: 'AtariST',
      monospace: 'Atari-Classic',
      description: 'Atari'
    },
    'playstation': {
      primary: 'Zrnic',
      fallback: 'SST',
      monospace: 'Share-Tech-Mono',
      description: 'PlayStation'
    },
    'xbox': {
      primary: 'Xbox',
      fallback: 'Segoe-UI',
      monospace: 'Consolas',
      description: 'Xbox'
    },
    'nintendo': {
      primary: 'Nintendo-DS',
      fallback: 'Pretendo',
      monospace: 'NES-Chimera',
      description: 'Nintendo'
    },
    'generic': {
      primary: 'LazenbyCompLiquid',
      fallback: 'Press Start 2P',
      monospace: 'Share Tech Mono',
      description: 'Generic System'
    }
  }
  
  return fontMap[systemType] || fontMap['generic']
}

/**
 * Maps system fonts to available WOFF fonts in our collection
 * This is like having a font sommelier pair the perfect typeface with your system!
 */
export function mapToAvailableFonts(systemFonts: SystemFonts): string[] {
  // Map of system font names to our WOFF font filenames
  const fontMapping: Record<string, string[]> = {
    // Classic Mac
    'Chicago': ['Web437_IBM_BIOS.woff', 'Web437_IBM_CGA.woff'],
    'Geneva': ['Web437_IBM_VGA_9x16.woff', 'Web437_IBM_EGA_9x14.woff'],
    'Monaco': ['Web437_IBM_VGA_8x16.woff', 'Web437_IBM_MDA.woff'],
    
    // Windows Classic
    'MS-Sans-Serif': ['Web437_IBM_PS-55_re._A.woff', 'Web437_Win95_LCD_1.woff'],
    'Fixedsys': ['Web437_Kaypro2K_G.woff', 'Web437_Kaypro2K.woff'],
    'Terminal': ['Web437_DOS-V_re._JPN30.woff', 'Web437_DOS-V_re._ANK24.woff'],
    'Tahoma': ['Web437_TridentEarly_8x16.woff', 'Web437_DTK_BIOS.woff'],
    'Lucida-Console': ['Web437_Compaq_8x16.woff', 'Web437_CompaqThin_8x16.woff'],
    
    // Retro Systems
    'C64-Pro': ['Web437_AmstradCPC.woff', 'Web437_AmstradPC.woff'],
    'Pet-Me-64': ['Web437_PET-64.woff', 'Web437_Commodore64.woff'],
    'Topaz': ['Web437_Amiga_1200.woff', 'Web437_Amiga_500.woff'],
    'Atari-Classic': ['Web437_Atari_8bit.woff', 'Web437_AtariST_High.woff'],
    
    // Modern fallbacks to retro equivalents
    'SF-Mono': ['Web437_Phoenix_BIOS.woff', 'Web437_PhoenixEGA_8x14.woff'],
    'Segoe-UI': ['Web437_Win30_LCD_2.woff', 'Web437_Win95_LCD_2.woff'],
    'Consolas': ['Web437_Compaq_8x16.woff', 'Web437_HP_100LX_10x11.woff'],
    'Ubuntu-Mono': ['Web437_Verite_8x16.woff', 'Web437_Verite_9x16.woff'],
    'DejaVu-Sans-Mono': ['Web437_VGA_9x16.woff', 'Web437_VGA_8x16.woff'],
    
    // Default retro fonts
    'LazenbyCompLiquid': ['LazenbyCompLiquid.ttf'],
    'Press Start 2P': ['Web437_IBM_CGA.woff', 'Web437_IBM_CGA-2y.woff'],
    'Share Tech Mono': ['Web437_IBM_VGA_8x16.woff', 'Web437_IBM_VGA_9x16.woff']
  }
  
  const fonts: string[] = []
  
  // Try to find matching fonts for primary, fallback, and monospace
  for (const fontName of [systemFonts.primary, systemFonts.fallback, systemFonts.monospace]) {
    const mappedFonts = fontMapping[fontName]
    if (mappedFonts) {
      fonts.push(...mappedFonts)
    }
  }
  
  // Always include our default retro font as ultimate fallback
  if (!fonts.includes('LazenbyCompLiquid.ttf')) {
    fonts.push('LazenbyCompLiquid.ttf')
  }
  
  return [...new Set(fonts)] // Remove duplicates
}

/**
 * Generates CSS font-face rules for the detected system
 */
export function generateFontFaceRules(fonts: string[]): string {
  return fonts.map(font => {
    const fontName = font.replace(/\.(woff|ttf)$/, '').replace(/\s+/g, '-')
    const fontPath = font.endsWith('.ttf') 
      ? `/fonts/${font}` 
      : `/fonts/woff/${font}`
    const format = font.endsWith('.ttf') ? 'truetype' : 'woff'
    
    return `
@font-face {
  font-family: '${fontName}';
  src: url('${fontPath}') format('${format}');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`
  }).join('\n')
}

/**
 * Get a fun message about the detected system
 */
export function getSystemMessage(systemType: string): string {
  const messages: Record<string, string> = {
    'mac-classic': "Ah, a classic Mac user! Let's party like it's System 7! 🍎",
    'mac-modern': "macOS detected. Preparing your artisanal, hand-crafted fonts... ☕",
    'win-95': "Windows 95! Time to defrag your memories and surf the information superhighway! 💾",
    'win-98': "Windows 98 - The golden age of blue screens and dial-up! 📞",
    'win-xp': "Windows XP! Bliss.jpg has entered the chat! 🌄",
    'win-modern': "Modern Windows detected. Cortana can't help you here! 🪟",
    'linux-ubuntu': "Ubuntu! I see you like your Linux user-friendly! 🐧",
    'linux-arch': "I use Arch BTW... and so do you! Here's your minimalist font selection! 🏗️",
    'linux-generic': "Linux detected! May the FOSS be with you! 🐧",
    'commodore-64': "LOAD '*',8,1 - Welcome, retro computing enthusiast! 📼",
    'amiga': "Amiga detected! Guru Meditation not included! 🎨",
    'android': "Android user! These fonts are Material to your experience! 🤖",
    'ios': "iOS detected. These fonts have been carefully curated by Jony Ive's ghost! 📱",
    'generic': "Mystery system detected! Here's our universal retro font cocktail! 🎲"
  }
  
  return messages[systemType] || messages['generic']
}