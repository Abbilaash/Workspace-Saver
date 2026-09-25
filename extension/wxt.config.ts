import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Workspace Saver',
    description: 'Save your browser workspace. Restore your context.',
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
      'activeTab'
    ],
    host_permissions: [
      '<all_urls>'
    ],
    action: {
      default_title: 'Workspace Saver',
      default_popup: 'popup.html'
    }
  },
  srcDir: 'src'
});
