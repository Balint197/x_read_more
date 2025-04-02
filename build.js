#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Check command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Please specify a target browser: chrome or firefox');
  process.exit(1);
}

const browser = args[0].toLowerCase();

if (browser !== 'chrome' && browser !== 'firefox') {
  console.error('Target browser must be either "chrome" or "firefox"');
  process.exit(1);
}

// Define source and destination paths
const sourceManifest = `manifest-${browser}.json`;
const destDir = `dist/${browser}`;

// Ensure the destination directory exists
fs.ensureDirSync(destDir);

// Copy the appropriate manifest file
console.log(`Building for ${browser}...`);
fs.copySync(sourceManifest, path.join(destDir, 'manifest.json'));

// Files to copy for both browsers
const filesToCopy = [
  'background.js',
  'content.js',
  'popup.js',
  'popup.html',
  'options.html',
  'browser-polyfill.js',
];

// Copy all shared files
filesToCopy.forEach(file => {
  fs.copySync(file, path.join(destDir, file));
});

// Copy the icons directory
fs.copySync('icons', path.join(destDir, 'icons'));

console.log(`Build for ${browser} completed successfully. Files are in ${destDir}.`); 