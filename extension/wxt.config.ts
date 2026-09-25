import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Workspace Saver',
    description: 'Save your browser workspace. Restore your context.',
    version: '1.0.0',
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
