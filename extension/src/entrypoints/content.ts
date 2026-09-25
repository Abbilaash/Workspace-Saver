import { defineContentScript } from 'wxt/utils/define-content-script';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'GET_PAGE_STATE') {
        try {
          const selection = window.getSelection()?.toString() || undefined;
          sendResponse({
            scrollX: window.scrollX || window.pageXOffset || 0,
            scrollY: window.scrollY || window.pageYOffset || 0,
            selectedText: selection
          });
        } catch (err) {
          sendResponse({ scrollX: 0, scrollY: 0, selectedText: undefined });
        }
        return true;
      }

      if (message.type === 'RESTORE_PAGE_STATE') {
        try {
          const { scrollX, scrollY } = message;
          if (typeof scrollX === 'number' && typeof scrollY === 'number') {
            window.scrollTo({
              left: scrollX,
              top: scrollY,
              behavior: 'smooth'
            });
          }
          sendResponse({ success: true });
        } catch (err) {
          sendResponse({ success: false });
        }
        return true;
      }
    });
  },
});
