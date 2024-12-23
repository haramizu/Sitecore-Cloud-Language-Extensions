import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'WXT React',
    description: 'WXT + React',
    version: '0.1.0',
    permissions: ['storage'],
  },
});
