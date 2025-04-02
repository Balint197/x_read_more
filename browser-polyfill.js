/**
 * Browser API Compatibility Layer
 * Allows the extension to work in both Chrome and Firefox
 */

// Create the browser object if it doesn't exist (for Chrome)
window.browser = (function() {
  if (typeof browser !== 'undefined') {
    // Firefox already has the browser object
    return browser;
  }

  // For Chrome, map chrome.* APIs to browser.*
  const api = {
    runtime: {
      sendMessage: function(...args) {
        return new Promise((resolve, reject) => {
          chrome.runtime.sendMessage(...args, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          });
        });
      },
      onMessage: {
        addListener: function(callback) {
          chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            const returnValue = callback(message, sender);
            // If return value is a Promise, resolve it and send response
            if (returnValue instanceof Promise) {
              returnValue.then(sendResponse);
              return true; // Keep the message channel open for async
            }
            return returnValue;
          });
        }
      }
    },
    storage: {
      local: {
        get: function(...args) {
          return new Promise((resolve) => {
            chrome.storage.local.get(...args, resolve);
          });
        },
        set: function(...args) {
          return new Promise((resolve) => {
            chrome.storage.local.set(...args, resolve);
          });
        }
      }
    },
    tabs: {
      executeScript: function(...args) {
        return new Promise((resolve, reject) => {
          chrome.tabs.executeScript(...args, (result) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(result);
            }
          });
        });
      },
      query: function(...args) {
        return new Promise((resolve) => {
          chrome.tabs.query(...args, resolve);
        });
      },
      sendMessage: function(...args) {
        return new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(...args, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          });
        });
      },
      create: function(...args) {
        return new Promise((resolve) => {
          chrome.tabs.create(...args, resolve);
        });
      }
    },
    commands: {
      onCommand: {
        addListener: function(callback) {
          chrome.commands.onCommand.addListener(callback);
        }
      },
      getAll: function() {
        return new Promise((resolve) => {
          chrome.commands.getAll(resolve);
        });
      }
    }
  };

  return api;
})(); 