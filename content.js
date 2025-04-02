/**
 * Twitter/X Read More Expander
 * Automatically clicks the "Show more" button on Twitter/X posts
 */

// State variables
let extensionEnabled = true;
let observer = null;

// Function to check if we're on a status page
function isStatusPage() {
  try {
    const url = window.location.href;
    const urlObj = new URL(url);
    
    // Check if the path contains /status/
    const pathParts = urlObj.pathname.split('/');
    const isStatus = pathParts.includes('status');
    
    console.log("Read More Expander: URL check:", url, isStatus ? "IS status page" : "NOT status page");
    return isStatus;
  } catch (e) {
    console.error("Read More Expander: Error checking URL:", e);
    return false;
  }
}

// Function to find and click the "Show more" button
function clickReadMoreButton() {
  // Only run on status pages
  if (!isStatusPage()) {
    console.log("Read More Expander: Not a status page, exiting");
    return;
  }
  
  console.log("Read More Expander: Looking for Show more buttons");
  
  // Try to find by data-testid first (most reliable)
  let showMoreButtons = Array.from(document.querySelectorAll('[data-testid="tweet-text-show-more-link"]'));
  
  // If not found, try to find buttons with "Show more" text
  if (showMoreButtons.length === 0) {
    // Get all buttons
    const allButtons = Array.from(document.querySelectorAll('button[type="button"], button[role="button"], button'));
    
    // Filter buttons that contain "Show more" text
    showMoreButtons = allButtons.filter(button => {
      const buttonText = button.textContent.trim().toLowerCase();
      return buttonText.includes('show more');
    });
    
    // If still not found, look for spans with "Show more" that might be inside buttons
    if (showMoreButtons.length === 0) {
      const spans = Array.from(document.querySelectorAll('span'));
      const showMoreSpans = spans.filter(span => 
        span.textContent.trim().toLowerCase() === 'show more'
      );
      
      // For each span, find the parent button
      showMoreSpans.forEach(span => {
        const buttonParent = span.closest('button');
        if (buttonParent) {
          showMoreButtons.push(buttonParent);
        }
      });
    }
  }
  
  if (showMoreButtons.length > 0) {
    console.log("Read More Expander: Found Show more button(s):", showMoreButtons.length);
    
    // Click each button found
    showMoreButtons.forEach(button => {
      console.log("Read More Expander: Clicking button");
      button.click();
    });
  } else {
    console.log("Read More Expander: No Show more buttons found");
  }
}

// Set up MutationObserver to detect when tweet content loads
function setupObserver() {
  console.log("Read More Expander: Setting up observer");
  
  // Create an observer instance
  observer = new MutationObserver((mutations) => {
    // Only run on status pages and if extension is enabled
    if (!isStatusPage() || !extensionEnabled) {
      return;
    }
    
    // Look for changes that might indicate tweet content loading
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        // After content changes, check for the read more button
        clickReadMoreButton();
      }
    }
  });

  // Start observing the document body for changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // Also try to click immediately in case the tweet is already loaded
  if (extensionEnabled) {
    clickReadMoreButton();
  }
}

// Stop the observer
function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
    console.log("Read More Expander: Observer stopped");
  }
}

// Initialize by checking extension state
function initialize() {
  // Check if document is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkStateAndSetup);
  } else {
    checkStateAndSetup();
  }
}

// Check extension state and set up if enabled
function checkStateAndSetup() {
  // Get current extension state from background
  // Check if we're in Chrome or Firefox
  if (typeof browser !== 'undefined') {
    // Firefox
    browser.runtime.sendMessage({ action: 'getState' }).then(response => {
      extensionEnabled = response.enabled;
      console.log("Read More Expander: Extension enabled state:", extensionEnabled);
      
      // Setup or teardown based on state
      if (extensionEnabled) {
        setupObserver();
      } else {
        stopObserver();
      }
    });
  } else {
    // Chrome
    chrome.runtime.sendMessage({ action: 'getState' }, response => {
      if (response) {
        extensionEnabled = response.enabled;
        console.log("Read More Expander: Extension enabled state:", extensionEnabled);
        
        // Setup or teardown based on state
        if (extensionEnabled) {
          setupObserver();
        } else {
          stopObserver();
        }
      }
    });
  }
}

// Listen for messages from background script
// Check if we're in Chrome or Firefox
if (typeof browser !== 'undefined') {
  // Firefox
  browser.runtime.onMessage.addListener((message) => {
    console.log("Read More Expander: Received message", message);
    
    if (message.action === 'useOnce') {
      // Execute the "use once" functionality regardless of enabled state
      console.log("Read More Expander: Executing use-once functionality");
      clickReadMoreButton();
      return;
    }
    
    // Handle state changes
    if (message.action === 'updateState') {
      extensionEnabled = message.enabled;
      console.log("Read More Expander: State updated to", extensionEnabled);
      
      if (extensionEnabled) {
        setupObserver();
      } else {
        stopObserver();
      }
    }
  });
} else {
  // Chrome
  chrome.runtime.onMessage.addListener((message) => {
    console.log("Read More Expander: Received message", message);
    
    if (message.action === 'useOnce') {
      // Execute the "use once" functionality regardless of enabled state
      console.log("Read More Expander: Executing use-once functionality");
      clickReadMoreButton();
      return;
    }
    
    // Handle state changes
    if (message.action === 'updateState') {
      extensionEnabled = message.enabled;
      console.log("Read More Expander: State updated to", extensionEnabled);
      
      if (extensionEnabled) {
        setupObserver();
      } else {
        stopObserver();
      }
    }
  });
}

// Check if we're on a tweet status page before running our code
if (isStatusPage()) {
  console.log("Read More Expander: Status page detected, initializing");
  initialize();
} else {
  console.log("Read More Expander: Not a status page, not initializing");
} 