# PWA (Progressive Web App) Setup

This application has been configured as a Progressive Web App (PWA), allowing users to install it on their mobile devices and desktop browsers like a native application.

## Features Implemented

### ✅ Manifest File

- Created `public/manifest.json` and `app/manifest.ts` with app metadata
- Configured app name, description, theme colors, and icons
- Added shortcuts for quick access to Play Game and Leaderboard

### ✅ Service Worker

- Created `public/sw.js` for offline support and caching
- Implements cache-first strategy for better performance
- Handles push notifications (ready for future implementation)
- Auto-updates every hour

### ✅ PWA Components

- **ServiceWorkerRegistration**: Automatically registers the service worker in production
- **InstallPrompt**: Shows a friendly prompt to install the app when available

### ✅ Meta Tags & Configuration

- Updated `app/layout.tsx` with PWA meta tags
- Added Apple-specific meta tags for iOS devices
- Configured theme colors and viewport settings

## How It Works

### Installation

1. Users visit the website on a supported browser (Chrome, Edge, Safari, etc.)
2. After a few seconds, an install prompt appears (if not already installed)
3. Users can click "Install" to add the app to their home screen
4. The app will open in standalone mode (no browser UI)

### Offline Support

- The service worker caches essential pages and resources
- Users can access cached content even when offline
- New content is fetched when connection is restored

## Setup Instructions

### 1. Generate Icons

You need to create PWA icons in multiple sizes. See `public/PWA_ICONS_README.md` for detailed instructions.

**Quick option using the script:**

```bash
# Install sharp (if not already installed)
npm install --save-dev sharp

# Place your 512x512px icon as public/icon-base.png
# Then run:
node scripts/generate-pwa-icons.js
```

**Or use online tools:**

- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/

### 2. Test PWA

1. Build the application:

   ```bash
   npm run build
   npm run start:next
   ```

2. Test on mobile device:
   - Open the app in Chrome/Edge on Android
   - Open the app in Safari on iOS
   - Look for "Add to Home Screen" option

3. Test in Chrome DevTools:
   - Open DevTools (F12)
   - Go to Application tab
   - Check "Manifest" and "Service Workers" sections
   - Use "Add to Home Screen" simulation

## Browser Support

- ✅ Chrome/Edge (Android & Desktop)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Android)
- ✅ Samsung Internet
- ⚠️ Some features may vary by browser

## Configuration

### Theme Colors

- **Background**: `#1e1b4b` (violet-950)
- **Theme**: `#4f46e5` (indigo-600)

You can update these in:

- `public/manifest.json`
- `app/manifest.ts`
- `app/layout.tsx` (meta tags)

### Service Worker

The service worker is located at `public/sw.js` and is automatically registered in production mode only.

### Install Prompt

The install prompt appears automatically after 3 seconds if:

- The browser supports PWA installation
- The app is not already installed
- The user hasn't dismissed it in this session

## Troubleshooting

### Icons not showing

- Ensure all icon files exist in `public/icons/`
- Check file paths in `manifest.json`
- Clear browser cache and reload

### Service Worker not registering

- Service worker only registers in production mode
- Check browser console for errors
- Ensure `public/sw.js` is accessible

### Install prompt not showing

- Some browsers require HTTPS (except localhost)
- Check if app is already installed
- Try clearing browser data

### Testing locally

- Use `npm run build && npm run start:next` for production build
- Service worker won't work in `next dev` mode
- Use Chrome DevTools to test PWA features

## Next Steps

1. **Create proper icons**: Generate all required icon sizes
2. **Test on devices**: Test installation on real mobile devices
3. **Customize**: Update app name, colors, and shortcuts as needed
4. **Add features**: Consider adding push notifications, offline game mode, etc.

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Next.js PWA Guide](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
