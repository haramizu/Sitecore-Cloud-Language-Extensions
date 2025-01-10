import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react', '@wxt-dev/i18n/module'],
  manifest: {
    name: 'Language Switcher',
    description: 'Sitecore Language Switcher',
    default_locale: 'en',
    version: '0.2.0',
    permissions: ['storage'],
  },
});
