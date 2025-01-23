import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react', '@wxt-dev/i18n/module'],
  manifest: {
    name: 'Sitecore Language Switcher',
    description:
      'By using the Sitecore Language Switcher, you can switch the administration screen to each language.',
    default_locale: 'en',
    version: '0.5.2',
    permissions: ['storage'],
  },
  runner: {
    startUrls: ['https://portal.sitecorecloud.io/'],
  },
});
