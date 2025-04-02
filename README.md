# Twitter/X Read More Expander

A browser extension that automatically expands truncated tweets by clicking the "Show more" button.

## Features

- Automatically expands truncated tweets on Twitter/X status pages
- Toggle on/off from the popup
- Keyboard shortcut to expand tweets once (Alt+Shift+R)
- Works on both Chrome and Firefox

## Development

### Prerequisites

- Node.js and npm

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd twitter-x-read-more-expander
npm install
```

### Building the Extension

The extension can be built for both Chrome and Firefox:

```bash
# Build for Chrome
npm run build:chrome

# Build for Firefox
npm run build:firefox

# Build for both browsers
npm run build:all
```

The built files will be in the `dist/chrome` and `dist/firefox` directories.

### Creating Packages for Submission

To create ZIP files for submission to the Chrome Web Store and Firefox Add-ons:

```bash
# Package for Chrome
npm run package:chrome

# Package for Firefox
npm run package:firefox
```

This will create ZIP files in the root directory:
- `twitter-x-read-more-expander-chrome-1.0.zip`
- `twitter-x-read-more-expander-firefox-1.0.zip`

## Testing Locally

### Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select the `dist/chrome` directory
4. The extension should now be installed for testing

### Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file in the `dist/firefox` directory
4. The extension should now be installed for testing

## Publishing the Extension

### Chrome Web Store
1. Go to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay the one-time developer registration fee ($5) if you haven't already
4. Click "New item" and upload the `twitter-x-read-more-expander-chrome-1.0.zip` file
5. Fill in the required information and screenshots
6. Submit for review

### Firefox Add-ons
1. Go to [Firefox Add-on Developer Hub](https://addons.mozilla.org/en-US/developers/)
2. Sign in with your Mozilla account or create one
3. Click "Submit a New Add-on" and choose "On this site"
4. Upload the `twitter-x-read-more-expander-firefox-1.0.zip` file
5. Fill in the required information and screenshots
6. Submit for review

## License

MIT 