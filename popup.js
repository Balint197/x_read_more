/**
 * Twitter/X Read More Expander - Popup Script
 */

// Get DOM elements
const toggleSwitch = document.getElementById('toggle-switch');
const useOnceButton = document.getElementById('use-once-button');
const donateButton = document.getElementById('donate-button');
const shortcutDisplay = document.getElementById('shortcut-display');

// Detect browser environment and use appropriate API
const isChrome = typeof browser === 'undefined';
const api = isChrome ? chrome : browser;

// Load saved state
function loadSavedState() {
  // Use the api variable which points to the right browser API
  const getStorage = api.storage.local.get('enabled');
  
  // Handle promise or callback based on browser
  if (isChrome) {
    getStorage(result => {
      const isEnabled = result.enabled !== undefined ? result.enabled : true;
      toggleSwitch.checked = isEnabled;
    });
    
    api.commands.getAll(commands => {
      const useOnceCommand = commands.find(command => command.name === 'use-once');
      if (useOnceCommand && useOnceCommand.shortcut) {
        shortcutDisplay.textContent = useOnceCommand.shortcut;
      }
    });
  } else {
    getStorage.then(result => {
      const isEnabled = result.enabled !== undefined ? result.enabled : true;
      toggleSwitch.checked = isEnabled;
    });
    
    api.commands.getAll().then(commands => {
      const useOnceCommand = commands.find(command => command.name === 'use-once');
      if (useOnceCommand && useOnceCommand.shortcut) {
        shortcutDisplay.textContent = useOnceCommand.shortcut;
      }
    });
  }
}

// Save the toggle state
function saveToggleState(isEnabled) {
  // Save to storage
  api.storage.local.set({ enabled: isEnabled });
  
  // Send message to background script to update state
  api.runtime.sendMessage({ action: 'updateState', enabled: isEnabled });
}

// Execute "use once" functionality on the current tab
function executeUseOnce() {
  const queryTabs = api.tabs.query({ active: true, currentWindow: true });
  
  if (isChrome) {
    queryTabs(tabs => {
      if (tabs.length > 0) {
        api.tabs.sendMessage(tabs[0].id, { action: 'useOnce' });
        window.close();
      }
    });
  } else {
    queryTabs.then(tabs => {
      if (tabs.length > 0) {
        api.tabs.sendMessage(tabs[0].id, { action: 'useOnce' });
        window.close();
      }
    });
  }
}

// Open the Ko-fi donation page
function openDonationPage() {
  api.tabs.create({
    url: "https://ko-fi.com/ballwave"
  });
  
  window.close();
}

// Event Listeners
toggleSwitch.addEventListener('change', () => {
  saveToggleState(toggleSwitch.checked);
});

useOnceButton.addEventListener('click', executeUseOnce);

donateButton.addEventListener('click', openDonationPage);

// Initialize the popup
document.addEventListener('DOMContentLoaded', loadSavedState); 