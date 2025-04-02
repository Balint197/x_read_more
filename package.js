#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

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
const sourceDir = `dist/${browser}`;
const packageName = `twitter-x-read-more-expander-${browser}-1.0.zip`;

// Ensure the source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory ${sourceDir} does not exist. Run build script first.`);
  process.exit(1);
}

// Create output stream
const output = fs.createWriteStream(packageName);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log(`${packageName} has been created (${archive.pointer()} total bytes)`);
});

// Catch errors
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the output file
archive.pipe(output);

// Add all files from the dist directory
archive.directory(sourceDir, false);

// Finalize the archive
archive.finalize(); 