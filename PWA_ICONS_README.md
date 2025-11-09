# PWA Icons Setup Guide

This application requires PWA icons in multiple sizes. Follow these steps to generate the icons:

## Required Icon Sizes

You need to create the following icon sizes in the `public/icons/` directory:

- `icon-72x72.png` (72x72 pixels)
- `icon-96x96.png` (96x96 pixels)
- `icon-128x128.png` (128x128 pixels)
- `icon-144x144.png` (144x144 pixels)
- `icon-152x152.png` (152x152 pixels) - Apple touch icon
- `icon-192x192.png` (192x192 pixels) - Android home screen
- `icon-384x384.png` (384x384 pixels)
- `icon-512x512.png` (512x512 pixels) - Splash screen

## Quick Setup Options

### Option 1: Using Online Tools

1. Create a 512x512px icon with your chess piece or logo
2. Use an online PWA icon generator:
   - https://www.pwabuilder.com/imageGenerator
   - https://realfavicongenerator.net/
   - https://www.favicon-generator.org/
3. Download all sizes and place them in `public/icons/`

### Option 2: Using ImageMagick (Command Line)

If you have a base icon (512x512px) named `icon-base.png`:

```bash
mkdir -p public/icons
convert icon-base.png -resize 72x72 public/icons/icon-72x72.png
convert icon-base.png -resize 96x96 public/icons/icon-96x96.png
convert icon-base.png -resize 128x128 public/icons/icon-128x128.png
convert icon-base.png -resize 144x144 public/icons/icon-144x144.png
convert icon-base.png -resize 152x152 public/icons/icon-152x152.png
convert icon-base.png -resize 192x192 public/icons/icon-192x192.png
convert icon-base.png -resize 384x384 public/icons/icon-384x384.png
cp icon-base.png public/icons/icon-512x512.png
```

### Option 3: Using Node.js Script

Create a script using `sharp` or `jimp` to generate all sizes from a base image.

## Icon Design Guidelines

- Use a transparent background or solid color matching your theme (#4f46e5 or #1e1b4b)
- Ensure icons are recognizable at small sizes
- Use high contrast for visibility
- Consider using a chess piece (king, queen, or knight) as the main icon
- Icons should be square with padding (not edge-to-edge)

## Temporary Placeholder

Until you create proper icons, you can use a simple colored square or your favicon.ico as a placeholder by copying it to all required sizes.

## Testing

After adding icons:

1. Build the application: `npm run build`
2. Test on a mobile device or use Chrome DevTools device emulation
3. Check if the "Add to Home Screen" prompt appears
4. Verify icons appear correctly when installed
