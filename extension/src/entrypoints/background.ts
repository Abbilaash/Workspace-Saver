import { defineBackground } from 'wxt/utils/define-background';

export default defineBackground(() => {
  console.log('Workspace Saver background service worker initialized.');

  // Listen for extension installation or update
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      console.log('Workspace Saver Extension installed successfully.');
    }
  });

  // Handle messages from popup or content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PING') {
      sendResponse({ status: 'PONG' });
    }
    return true;
  });
});
