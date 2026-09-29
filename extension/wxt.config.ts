import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    manifest_version: 3,
    name: 'Workspace Saver',
    short_name: 'Workspace Saver',
    description: 'Save your browser tabs, native tab groups, scroll positions, selected text, and project notes into organized workspaces. Restore your entire context in one click.',
    version: '1.0.0',
    icons: {
      16: 'icon-16.png',
      48: 'icon-48.png',
      128: 'icon-128.png'
    },
    permissions: [
      'tabs',
      'tabGroups',
      'storage',
      'scripting',
      'activeTab',
      'identity'
    ],
    host_permissions: [
      '<all_urls>'
    ],
    action: {
      default_title: 'Workspace Saver',
      default_popup: 'popup.html',
      default_icon: {
        16: 'icon-16.png',
        48: 'icon-48.png',
        128: 'icon-128.png'
      }
    },
    offline_enabled: true
  },
  srcDir: 'src'
});
