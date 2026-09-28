import { WorkspaceWindow, WorkspaceTab, TabGroupSnapshot, CurrentWorkspaceSummary } from '../types';

export async function getCurrentWorkspaceSummary(): Promise<CurrentWorkspaceSummary> {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    return { tabsCount: 0, groupsCount: 0, windowsCount: 1 };
  }

  try {
    const currentWin = await chrome.windows.getCurrent();
    const tabs = await chrome.tabs.query({ windowId: currentWin.id });
    
    let groupsCount = 0;
    if (chrome.tabGroups && typeof chrome.tabGroups.query === 'function') {
      const groups = await chrome.tabGroups.query({ windowId: currentWin.id });
      groupsCount = groups.length;
    }

    return {
      tabsCount: tabs.length,
      groupsCount: groupsCount,
      windowsCount: 1
    };
  } catch (err) {
    console.error('Error fetching current workspace summary:', err);
    return { tabsCount: 0, groupsCount: 0, windowsCount: 1 };
  }
}

async function captureTabStateWithTimeout(tab: chrome.tabs.Tab, timeoutMs = 150): Promise<{ scrollX: number; scrollY: number; selectedText?: string }> {
  if (!tab.id || !tab.url || (!tab.url.startsWith('http://') && !tab.url.startsWith('https://') && !tab.url.startsWith('file://'))) {
    return { scrollX: 0, scrollY: 0 };
  }

  return new Promise((resolve) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({ scrollX: 0, scrollY: 0 });
      }
    }, timeoutMs);

    chrome.tabs.sendMessage(tab.id!, { type: 'GET_PAGE_STATE' })
      .then((response) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          if (response) {
            resolve({
              scrollX: response.scrollX || 0,
              scrollY: response.scrollY || 0,
              selectedText: response.selectedText ? response.selectedText.slice(0, 5000) : undefined
            });
          } else {
            resolve({ scrollX: 0, scrollY: 0 });
          }
        }
      })
      .catch(() => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve({ scrollX: 0, scrollY: 0 });
        }
      });
  });
}

export async function captureWorkspace(): Promise<{ windows: WorkspaceWindow[]; tabGroups: TabGroupSnapshot[]; tabsCount: number; groupsCount: number }> {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    throw new Error('Chrome Extension API not available');
  }

  const currentWin = await chrome.windows.getCurrent();
  const rawTabs = await chrome.tabs.query({ windowId: currentWin.id });

  let tabGroups: TabGroupSnapshot[] = [];
  if (chrome.tabGroups && typeof chrome.tabGroups.query === 'function') {
    try {
      const rawGroups = await chrome.tabGroups.query({ windowId: currentWin.id });
      tabGroups = rawGroups.map(g => ({
        id: g.id,
        title: g.title || '',
        color: g.color || 'grey',
        collapsed: g.collapsed || false
      }));
    } catch (err) {
      console.warn('Could not query tab groups:', err);
    }
  }

  // Capture all tab page states concurrently in parallel with a 150ms timeout
  const tabStatePromises = rawTabs.map(tab => captureTabStateWithTimeout(tab, 150));
  const tabStates = await Promise.all(tabStatePromises);

  const capturedTabs: WorkspaceTab[] = rawTabs.map((tab, idx) => {
    const pageState = tabStates[idx] || { scrollX: 0, scrollY: 0 };
    return {
      url: tab.url || '',
      title: tab.title || tab.url || 'Untitled Tab',
      index: tab.index,
      active: tab.active || false,
      pinned: tab.pinned || false,
      muted: tab.mutedInfo?.muted || false,
      groupId: tab.groupId !== -1 ? tab.groupId : undefined,
      scrollX: pageState.scrollX,
      scrollY: pageState.scrollY,
      selectedText: pageState.selectedText
    };
  }).filter(t => t.url);

  const windowSnapshot: WorkspaceWindow = {
    originalWindowId: currentWin.id,
    left: currentWin.left,
    top: currentWin.top,
    width: currentWin.width,
    height: currentWin.height,
    tabs: capturedTabs
  };

  return {
    windows: [windowSnapshot],
    tabGroups,
    tabsCount: capturedTabs.length,
    groupsCount: tabGroups.length
  };
}

export async function restoreWorkspace(windows: WorkspaceWindow[], tabGroups: TabGroupSnapshot[] = []): Promise<{ success: boolean; restoredTabsCount: number; message: string }> {
  if (typeof chrome === 'undefined' || !chrome.windows) {
    throw new Error('Chrome Extension API not available');
  }

  let totalRestored = 0;
  let hasErrors = false;

  for (const winSnapshot of windows) {
    if (!winSnapshot.tabs || winSnapshot.tabs.length === 0) continue;

    try {
      // 1. Create a new window with the first tab
      const firstTab = winSnapshot.tabs[0];
      const newWin = await chrome.windows.create({
        url: isValidRestorableUrl(firstTab.url) ? firstTab.url : 'about:blank',
        focused: true
      });

      if (!newWin || !newWin.id) continue;

      const createdTabIds: { [originalIndex: number]: number } = {};
      const createdGroupMap: { [originalGroupId: number]: number[] } = {};

      const firstCreatedTab = newWin.tabs && newWin.tabs[0];
      if (firstCreatedTab && firstCreatedTab.id) {
        createdTabIds[firstTab.index] = firstCreatedTab.id;
        totalRestored++;

        if (firstTab.pinned) {
          await chrome.tabs.update(firstCreatedTab.id, { pinned: true });
        }
        if (firstTab.groupId !== undefined) {
          if (!createdGroupMap[firstTab.groupId]) createdGroupMap[firstTab.groupId] = [];
          createdGroupMap[firstTab.groupId].push(firstCreatedTab.id);
        }
      }

      // 2. Create the remaining tabs
      for (let i = 1; i < winSnapshot.tabs.length; i++) {
        const tabData = winSnapshot.tabs[i];
        const targetUrl = isValidRestorableUrl(tabData.url) ? tabData.url : 'about:blank';
        
        try {
          const newTab = await chrome.tabs.create({
            windowId: newWin.id,
            url: targetUrl,
            active: tabData.active,
            pinned: tabData.pinned,
            index: tabData.index
          });

          if (newTab && newTab.id) {
            createdTabIds[tabData.index] = newTab.id;
            totalRestored++;

            if (tabData.groupId !== undefined) {
              if (!createdGroupMap[tabData.groupId]) createdGroupMap[tabData.groupId] = [];
              createdGroupMap[tabData.groupId].push(newTab.id);
            }
          }
        } catch (tabErr) {
          console.warn(`Failed to create tab ${tabData.url}:`, tabErr);
          hasErrors = true;
        }
      }

      // 3. Recreate native tab groups
      if (chrome.tabGroups && typeof chrome.tabs.group === 'function') {
        for (const groupSnap of tabGroups) {
          const tabIdsInGroup = createdGroupMap[groupSnap.id];
          if (tabIdsInGroup && tabIdsInGroup.length > 0) {
            try {
              const newGroupId = await chrome.tabs.group({
                windowId: newWin.id,
                tabIds: tabIdsInGroup
              });

              await chrome.tabGroups.update(newGroupId, {
                title: groupSnap.title,
                color: (groupSnap.color as any) || 'grey',
                collapsed: groupSnap.collapsed || false
              });
            } catch (groupErr) {
              console.warn(`Failed to recreate tab group "${groupSnap.title}":`, groupErr);
              hasErrors = true;
            }
          }
        }
      }

      // 4. Restore scroll positions asynchronously after tab finishes loading
      for (const tabData of winSnapshot.tabs) {
        const createdTabId = createdTabIds[tabData.index];
        if (createdTabId && (tabData.scrollX || tabData.scrollY)) {
          injectScrollRestorer(createdTabId, tabData.scrollX || 0, tabData.scrollY || 0);
        }
      }

    } catch (winErr) {
      console.error('Failed to create window during restoration:', winErr);
      hasErrors = true;
    }
  }

  const message = hasErrors 
    ? `Workspace partially restored (${totalRestored} tabs restored)`
    : `Workspace restored successfully (${totalRestored} tabs in a new window)`;

  return { success: totalRestored > 0, restoredTabsCount: totalRestored, message };
}

function isValidRestorableUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://')) {
    return false;
  }
  return true;
}

function injectScrollRestorer(tabId: number, scrollX: number, scrollY: number) {
  const listener = (updatedTabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
    if (updatedTabId === tabId && changeInfo.status === 'complete') {
      chrome.tabs.onUpdated.removeListener(listener);
      chrome.tabs.sendMessage(tabId, {
        type: 'RESTORE_PAGE_STATE',
        scrollX,
        scrollY
      }).catch(() => {
        // Ignore silent failure if content script unavailable
      });
    }
  };
  chrome.tabs.onUpdated.addListener(listener);
}
