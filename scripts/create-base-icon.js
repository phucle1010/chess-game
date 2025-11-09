/**
 * Create Base PWA Icon
 *
 * This script creates a crown-themed icon (512x512px) for the Chess Master PWA.
 * The icon features a golden crown with gems on a gradient purple background.
 * You can replace this with your own custom icon later.
 *
 * Usage: npm run create:base-icon
 */

import sharp from "sharp";
import path from "path";
import fs from "fs";

const outputPath = path.join(process.cwd(), "public", "icon-base.png");
const outputDir = path.dirname(outputPath);

// Create public directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function createIcon() {
  console.log("Creating base PWA icon...");

  try {
    // Create a chess-themed icon with gradient background
    const size = 512;
    const padding = 64;
    const iconSize = size - padding * 2;

    // Create SVG for beautiful crown icon
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Background gradient -->
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#6366f1;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
          </linearGradient>
          
          <!-- Crown gold gradient -->
          <linearGradient id="crownGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#fef3c7;stop-opacity:1" />
            <stop offset="30%" style="stop-color:#fbbf24;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#f59e0b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
          </linearGradient>
          
          <!-- Crown highlight -->
          <linearGradient id="crownHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.6" />
            <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
          </linearGradient>
          
          <!-- Gem gradient - Red -->
          <radialGradient id="gemRed" cx="30%" cy="30%">
            <stop offset="0%" style="stop-color:#fef2f2;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#fca5a5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
          </radialGradient>
          
          <!-- Gem gradient - Blue -->
          <radialGradient id="gemBlue" cx="30%" cy="30%">
            <stop offset="0%" style="stop-color:#eff6ff;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#93c5fd;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
          </radialGradient>
          
          <!-- Gem gradient - Green -->
          <radialGradient id="gemGreen" cx="30%" cy="30%">
            <stop offset="0%" style="stop-color:#f0fdf4;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#86efac;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16a34a;stop-opacity:1" />
          </radialGradient>
          
          <!-- Shadow filter -->
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Background with rounded corners -->
        <rect width="${size}" height="${size}" rx="96" fill="url(#bg)"/>
        
        <!-- Crown Group -->
        <g transform="translate(${padding}, ${padding})" filter="url(#shadow)">
          <!-- Base band (bottom) -->
          <rect x="${iconSize * 0.15}" y="${iconSize * 0.7}" width="${iconSize * 0.7}" height="${iconSize * 0.1}" rx="8" fill="url(#crownGold)"/>
          <rect x="${iconSize * 0.15}" y="${iconSize * 0.7}" width="${iconSize * 0.7}" height="${iconSize * 0.1}" rx="8" fill="url(#crownHighlight)"/>
          
          <!-- Main crown shape - elegant curve -->
          <path d="M ${iconSize * 0.15} ${iconSize * 0.7}
                   Q ${iconSize * 0.2} ${iconSize * 0.5}, ${iconSize * 0.3} ${iconSize * 0.45}
                   Q ${iconSize * 0.35} ${iconSize * 0.35}, ${iconSize * 0.4} ${iconSize * 0.3}
                   Q ${iconSize * 0.45} ${iconSize * 0.2}, ${iconSize * 0.5} ${iconSize * 0.18}
                   Q ${iconSize * 0.55} ${iconSize * 0.2}, ${iconSize * 0.6} ${iconSize * 0.3}
                   Q ${iconSize * 0.65} ${iconSize * 0.35}, ${iconSize * 0.7} ${iconSize * 0.45}
                   Q ${iconSize * 0.8} ${iconSize * 0.5}, ${iconSize * 0.85} ${iconSize * 0.7}
                   Z" 
                fill="url(#crownGold)" 
                stroke="#d97706" 
                stroke-width="2.5"/>
          
          <!-- Left peak - elegant -->
          <path d="M ${iconSize * 0.3} ${iconSize * 0.45}
                   L ${iconSize * 0.32} ${iconSize * 0.25}
                   L ${iconSize * 0.35} ${iconSize * 0.15}
                   L ${iconSize * 0.38} ${iconSize * 0.25}
                   L ${iconSize * 0.4} ${iconSize * 0.3}
                   Z" 
                fill="#fef3c7" 
                stroke="#d97706" 
                stroke-width="2"/>
          
          <!-- Center peak - tallest and most elegant (perfectly centered) -->
          <path d="M ${iconSize * 0.48} ${iconSize * 0.18}
                   L ${iconSize * 0.49} ${iconSize * 0.12}
                   L ${iconSize * 0.495} ${iconSize * 0.08}
                   L ${iconSize * 0.5} ${iconSize * 0.05}
                   L ${iconSize * 0.505} ${iconSize * 0.08}
                   L ${iconSize * 0.51} ${iconSize * 0.12}
                   L ${iconSize * 0.52} ${iconSize * 0.18}
                   Z" 
                fill="#fef3c7" 
                stroke="#d97706" 
                stroke-width="2"/>
          
          <!-- Right peak - elegant -->
          <path d="M ${iconSize * 0.7} ${iconSize * 0.45}
                   L ${iconSize * 0.68} ${iconSize * 0.25}
                   L ${iconSize * 0.65} ${iconSize * 0.15}
                   L ${iconSize * 0.62} ${iconSize * 0.25}
                   L ${iconSize * 0.6} ${iconSize * 0.3}
                   Z" 
                fill="#fef3c7" 
                stroke="#d97706" 
                stroke-width="2"/>
          
          <!-- Decorative lines on base band -->
          <line x1="${iconSize * 0.25}" y1="${iconSize * 0.72}" x2="${iconSize * 0.75}" y2="${iconSize * 0.72}" stroke="#d97706" stroke-width="1.5" opacity="0.6"/>
          <line x1="${iconSize * 0.25}" y1="${iconSize * 0.78}" x2="${iconSize * 0.75}" y2="${iconSize * 0.78}" stroke="#d97706" stroke-width="1.5" opacity="0.6"/>
          
          <!-- Beautiful gems with shine -->
          <!-- Left gem (Red) -->
          <circle cx="${iconSize * 0.32}" cy="${iconSize * 0.35}" r="${iconSize * 0.04}" fill="url(#gemRed)"/>
          <circle cx="${iconSize * 0.32}" cy="${iconSize * 0.35}" r="${iconSize * 0.04}" fill="url(#crownHighlight)" opacity="0.5"/>
          <circle cx="${iconSize * 0.3}" cy="${iconSize * 0.33}" r="${iconSize * 0.015}" fill="#ffffff" opacity="0.8"/>
          
          <!-- Center gem (Blue) - largest -->
          <circle cx="${iconSize * 0.5}" cy="${iconSize * 0.25}" r="${iconSize * 0.05}" fill="url(#gemBlue)"/>
          <circle cx="${iconSize * 0.5}" cy="${iconSize * 0.25}" r="${iconSize * 0.05}" fill="url(#crownHighlight)" opacity="0.5"/>
          <circle cx="${iconSize * 0.48}" cy="${iconSize * 0.23}" r="${iconSize * 0.018}" fill="#ffffff" opacity="0.9"/>
          
          <!-- Right gem (Green) -->
          <circle cx="${iconSize * 0.68}" cy="${iconSize * 0.35}" r="${iconSize * 0.04}" fill="url(#gemGreen)"/>
          <circle cx="${iconSize * 0.68}" cy="${iconSize * 0.35}" r="${iconSize * 0.04}" fill="url(#crownHighlight)" opacity="0.5"/>
          <circle cx="${iconSize * 0.66}" cy="${iconSize * 0.33}" r="${iconSize * 0.015}" fill="#ffffff" opacity="0.8"/>
          
          <!-- Shine effect on crown -->
          <path d="M ${iconSize * 0.15} ${iconSize * 0.7}
                   Q ${iconSize * 0.2} ${iconSize * 0.5}, ${iconSize * 0.3} ${iconSize * 0.45}
                   Q ${iconSize * 0.35} ${iconSize * 0.35}, ${iconSize * 0.4} ${iconSize * 0.3}
                   Q ${iconSize * 0.45} ${iconSize * 0.2}, ${iconSize * 0.5} ${iconSize * 0.18}
                   Q ${iconSize * 0.55} ${iconSize * 0.2}, ${iconSize * 0.6} ${iconSize * 0.3}
                   Q ${iconSize * 0.65} ${iconSize * 0.35}, ${iconSize * 0.7} ${iconSize * 0.45}
                   Q ${iconSize * 0.8} ${iconSize * 0.5}, ${iconSize * 0.85} ${iconSize * 0.7}
                   Z" 
                fill="url(#crownHighlight)"/>
        </g>
      </svg>
    `;

    // Convert SVG to PNG
    await sharp(Buffer.from(svg)).png().resize(size, size).toFile(outputPath);

    console.log(`✅ Base icon created successfully at: ${outputPath}`);
    console.log("📝 You can now run: npm run generate:pwa-icons");
    console.log("💡 Tip: Replace this icon with your custom design if needed");
  } catch (error) {
    console.error("Error creating icon:", error);
    process.exit(1);
  }
}

createIcon();
