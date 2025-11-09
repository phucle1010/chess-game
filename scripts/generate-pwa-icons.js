/**
 * PWA Icon Generator Script
 *
 * This script helps generate PWA icons from a base image.
 *
 * Usage:
 * 1. Place your base icon (512x512px) as public/icon-base.png
 * 2. Run: npm run generate:pwa-icons
 *
 * Note: sharp package is required (already included in dependencies)
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputPath = path.join(process.cwd(), "public", "icon-base.png");
const outputDir = path.join(process.cwd(), "public", "icons");

// Check if base icon exists
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Base icon not found at ${inputPath}`);
  console.log(
    "Please create a 512x512px icon and save it as public/icon-base.png"
  );
  process.exit(1);
}

// Create icons directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log("Generating PWA icons...");

  try {
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      await sharp(inputPath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 79, g: 70, b: 229, alpha: 1 }, // #4f46e5
        })
        .toFile(outputPath);
      console.log(`✓ Generated icon-${size}x${size}.png`);
    }

    console.log("\n✅ All PWA icons generated successfully!");
    console.log(`Icons saved to: ${outputDir}`);
  } catch (error) {
    console.error("Error generating icons:", error);
    process.exit(1);
  }
}

generateIcons();
