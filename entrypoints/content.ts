import languages from './resources/languages.json';
import pathMappings from './resources/pathMappings.json';
import { storage } from '@wxt-dev/storage';

type TranslationKeys = keyof typeof String;

export default defineContentScript({
  matches: ['*://*.sitecorecloud.io/*', '*://*.workato.com/*'],
  allFrames: true,
  async main() {
    const browserLang = navigator.language.slice(0, 2);
    const storedLang = (await storage.getItem(`local:preferredLanguage`)) as string;
    const lang = storedLang || browserLang;
    let domain = window.location.hostname;

    // Sitecore Stream
    if (domain.startsWith('stream') && domain.endsWith('sitecorecloud.io')) {
      domain = 'stream.sitecorecloud.io';
    }

    // Sitecore Analytics on xmapps
    if (domain.startsWith('analytics') && domain.endsWith('sitecorecloud.io')) {
      domain = 'analytics.sitecorecloud.io';
    }

    // Sitecore CDP
    // if (domain.startsWith('app-cdp') && domain.endsWith('sitecorecloud.io')) {
    //   domain = 'app-cdp.sitecorecloud.io';
    // }

    // Sitecore Personalize
    // if (domain.startsWith('app-personalize') && domain.endsWith('sitecorecloud.io')) {
    //   domain = 'app-personalize.sitecorecloud.io';
    // }

    // Sitecore Connect
    if (domain.endsWith('workato.com')) {
      domain = 'workato.com';
    }

    console.log('domain: ' + domain);

    // If the language is 'en', do not execute
    if (
      lang.startsWith('en') ||
      !Object.keys(languages).some((language) => lang.startsWith(language))
    ) {
      return;
    }

    // Replace text in HTML
    replaceTextInSelector(lang, domain);

    // Observe changes in the DOM
    const observer = new MutationObserver(() => {
      replaceTextInSelector(lang, domain);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
});

async function replaceTextInSelector(lang: string, domain: string) {
  let selectors: TranslationKeys[] = [];
  let en: Record<string, string>;

  let path = window.location.pathname;

  // Sitecore CDP + Personalize remove hash value
  if (domain === `app-personalize.sitecorecloud.io` || domain === `app-cdp.sitecorecloud.io`) {
    const hashValue = window.location.hash;

    if (hashValue.startsWith('#')) {
      path = hashValue.slice(1).split('?')[0];
    }

    // Load path mappings from JSON file
    for (const [key, value] of Object.entries(pathMappings)) {
      if (path.startsWith(key as string) && !path.startsWith((value + '/list') as string)) {
        path = value as string;
        break;
      }
    }
  }
  console.log('path: ' + path);

  try {
    en = await import(`./resources/${domain}/en.json`)
      .then((module) => module.default)
      .catch(() => null);

    // If the page is not the home page, try to load the page translation
    if (path !== '/') {
      const pathParts = path.split('/').filter(Boolean);
      let pageEn = null;

      if (pathParts.length === 1) {
        pageEn = await import(`./resources/${domain}/${pathParts[0]}/en.json`)
          .then((m) => m.default)
          .catch(() => null);
      } else if (pathParts.length === 2) {
        pageEn = await import(`./resources/${domain}/${pathParts[0]}/${pathParts[1]}/en.json`)
          .then((m) => m.default)
          .catch(() => null);
      } else if (pathParts.length === 3) {
        pageEn = await import(
          `./resources/${domain}/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}/en.json`
        )
          .then((m) => m.default)
          .catch(() => null);
      } else if (pathParts.length === 4) {
        pageEn = await import(
          `./resources/${domain}/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}/${pathParts[3]}/en.json`
        )
          .then((m) => m.default)
          .catch(() => null);
      }
      if (pageEn) {
        en = { ...en, ...pageEn };
      }
    }
    selectors = Object.keys(en) as TranslationKeys[];
  } catch (error) {
    console.error(`English translation file for ${domain} not found.`);
    return;
  }

  let translations: Record<string, string> | null = null;

  try {
    translations = await import(`./resources/${domain}/${lang}.json`)
      .then((module) => module.default)
      .catch(() => null);
    // If the page is not the home page, try to load the page translation
    if (path !== '/') {
      const pathParts = path.split('/').filter(Boolean);
      let pageTranslation = null;

      if (pathParts.length === 1) {
        pageTranslation = await import(`./resources/${domain}/${pathParts[0]}/${lang}.json`)
          .then((m) => m.default)
          .catch(() => null);
      } else if (pathParts.length === 2) {
        pageTranslation = await import(
          `./resources/${domain}/${pathParts[0]}/${pathParts[1]}/${lang}.json`
        )
          .then((m) => m.default)
          .catch(() => null);
      } else if (pathParts.length === 3) {
        pageTranslation = await import(
          `./resources/${domain}/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}/${lang}.json`
        )
          .then((m) => m.default)
          .catch(() => null);
      } else if (pathParts.length === 4) {
        pageTranslation = await import(
          `./resources/${domain}/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}/${pathParts[3]}/${lang}.json`
        )
          .then((m) => m.default)
          .catch(() => null);
      }
      if (pageTranslation) {
        translations = { ...translations, ...pageTranslation };
      }
    }
  } catch (error) {
    console.error(`Translation file for ${lang} not found.`);
    return;
  }

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      if (translations && element.childNodes.length) {
        element.childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim() === en[selector]) {
            if (translations[selector as keyof typeof translations]) {
              child.textContent = translations[selector as keyof typeof translations];
            }
          }
        });
      }
    });
  });
}
