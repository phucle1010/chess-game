/**
 * PWA Setup Checker
 *
 * This script checks if all PWA files and configurations are in place.
 *
 * Usage: npm run check:pwa
 */

import fs from "fs";
import path from "path";

const checks = [];
let allPassed = true;

function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  checks.push({ file: filePath, exists, description });
  if (!exists) allPassed = false;
  return exists;
}

function checkDirectory(dirPath, description) {
  const fullPath = path.join(process.cwd(), dirPath);
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  checks.push({ file: dirPath, exists, description });
  if (!exists) allPassed = false;
  return exists;
}

console.log("🔍 Checking PWA Setup...\n");

// Check manifest files
checkFile("public/manifest.json", "Manifest JSON file");
checkFile("app/manifest.ts", "Next.js manifest route");

// Check service worker
checkFile("public/sw.js", "Service worker file");

// Check PWA components
checkFile(
  "components/pwa/ServiceWorkerRegistration.tsx",
  "Service Worker Registration component"
);
checkFile("components/pwa/InstallPrompt.tsx", "Install Prompt component");

// Check base icon
checkFile("public/icon-base.png", "Base icon (512x512px)");

// Check icons directory
const iconsDir = "public/icons";
if (checkDirectory(iconsDir, "Icons directory")) {
  const iconFiles = fs.readdirSync(path.join(process.cwd(), iconsDir));
  const requiredIcons = [
    "icon-72x72.png",
    "icon-96x96.png",
    "icon-128x128.png",
    "icon-144x144.png",
    "icon-152x152.png",
    "icon-192x192.png",
    "icon-384x384.png",
    "icon-512x512.png",
  ];

  requiredIcons.forEach((icon) => {
    const exists = iconFiles.includes(icon);
    checks.push({
      file: `${iconsDir}/${icon}`,
      exists,
      description: `Icon ${icon}`,
    });
    if (!exists) allPassed = false;
  });
}

// Check layout.tsx for PWA components
const layoutPath = path.join(process.cwd(), "app/layout.tsx");
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");
  const hasServiceWorker = layoutContent.includes("ServiceWorkerRegistration");
  const hasInstallPrompt = layoutContent.includes("InstallPrompt");
  const hasManifestLink = layoutContent.includes("manifest.json");

  checks.push({
    file: "app/layout.tsx",
    exists: hasServiceWorker,
    description: "ServiceWorkerRegistration imported",
  });
  checks.push({
    file: "app/layout.tsx",
    exists: hasInstallPrompt,
    description: "InstallPrompt imported",
  });
  checks.push({
    file: "app/layout.tsx",
    exists: hasManifestLink,
    description: "Manifest link in head",
  });

  if (!hasServiceWorker || !hasInstallPrompt || !hasManifestLink) {
    allPassed = false;
  }
}

// Print results
console.log("📋 Check Results:\n");
checks.forEach((check) => {
  const status = check.exists ? "✅" : "❌";
  console.log(`${status} ${check.description}`);
  if (!check.exists) {
    console.log(`   Missing: ${check.file}`);
  }
});

console.log("\n" + "=".repeat(50));
if (allPassed) {
  console.log("✅ PWA Setup: COMPLETE");
  console.log("\n📱 Your app is ready to be installed as a PWA!");
  console.log("💡 Next steps:");
  console.log("   1. Build the app: npm run build");
  console.log("   2. Test on mobile device or Chrome DevTools");
  console.log('   3. Look for "Add to Home Screen" option');
} else {
  console.log("❌ PWA Setup: INCOMPLETE");
  console.log("\n⚠️  Please fix the missing items above.");
}
console.log("=".repeat(50));

process.exit(allPassed ? 0 : 1);
