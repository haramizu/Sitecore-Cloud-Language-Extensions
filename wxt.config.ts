import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Language Switcher',
    description: 'Sitecore Language Switcher',
    version: '0.1.1',
    permissions: ['storage'],
  },
});
