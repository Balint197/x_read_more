/**
 * Twitter/X Read More Expander - Background Script
 */

// Extension state
let extensionEnabled = true;

// Detect browser environment
const isChrome = typeof chrome !== 'undefined' && typeof browser === 'undefined';
const api = isChrome ? chrome : browser;

// Initialize extension state
function initializeState() {
  api.storage.local.get('enabled', result => {
    // Default to enabled if not previously set
    extensionEnabled = result.enabled !== undefined ? result.enabled : true;
    console.log('Background script: Extension state initialized:', extensionEnabled);
  });
}

// Initialize on load
initializeState();

// Function to check if URL is a Twitter/X status page
function isStatusPage(url) {
  if (!url) return false;
  
  // Create a URL object to parse the URL
  try {
    const urlObj = new URL(url);
    
    // Check if it's twitter.com or x.com domain
    const isTwitterDomain = urlObj.hostname === 'twitter.com' || 
                           urlObj.hostname === 'x.com' ||
                           urlObj.hostname.endsWith('.twitter.com') || 
                           urlObj.hostname.endsWith('.x.com');
    
    if (!isTwitterDomain) return false;
    
    // Check if the path contains /status/
    const pathParts = urlObj.pathname.split('/');
    return pathParts.includes('status');
    
  } catch (e) {
    console.error("Error parsing URL:", e);
    return false;
  }
}

// Function to inject content script - different for Chrome and Firefox
function injectContentScript(tabId) {
  if (isChrome) {
    // Chrome uses the scripting API in Manifest V3
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['browser-polyfill.js', 'content.js']
    }).catch(error => {
      console.error("Error injecting content script:", error);
    });
  } else {
    // Firefox can use tabs.executeScript
    browser.tabs.executeScript(tabId, {
      file: 'browser-polyfill.js'
    }).then(() => {
      return browser.tabs.executeScript(tabId, {
        file: 'content.js'
      });
    }).catch(error => {
      console.error("Error injecting content script:", error);
    });
  }
}

// Listen for tab updates to reinject content script if needed
api.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("Background script: Tab updated", tab.url);
  
  // Only proceed if this is a Twitter/X status page, the page has completed loading, and extension is enabled
  if (extensionEnabled && isStatusPage(tab.url) && changeInfo.status === 'complete') {
    console.log("Background script: Status page detected, injecting content script");
    
    // Inject the content script
    injectContentScript(tabId);
  }
});

// Listen for extension command shortcuts
api.commands.onCommand.addListener((command) => {
  if (command === 'use-once') {
    // Get the current active tab
    api.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0 && isStatusPage(tabs[0].url)) {
        // Send a message to the content script to execute once
        api.tabs.sendMessage(tabs[0].id, { action: 'useOnce' });
      }
    });
  }
});

// Listen for messages from popup or content scripts
api.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateState') {
    extensionEnabled = message.enabled;
    console.log('Background script: Extension state updated:', extensionEnabled);
  }
  
  // Allow content script to check if extension is enabled
  if (message.action === 'getState') {
    sendResponse({ enabled: extensionEnabled });
    return true; // Required for asynchronous sendResponse
  }
}); 