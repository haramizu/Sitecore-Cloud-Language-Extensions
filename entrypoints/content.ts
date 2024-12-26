import languages from './resources/languages.json';
import { storage } from "@wxt-dev/storage";

type TranslationKeys = keyof typeof String;

export default defineContentScript({
  matches: ['*://*.sitecorecloud.io/*'],
  async main() {
    const browserLang = navigator.language.slice(0, 2);
    const storedLang = (await storage.getItem(`local:preferredLanguage`)) as string;
    const lang = storedLang || browserLang;

    const domain = window.location.hostname;
    console.log('domain: ' + domain);

    // If the language is 'en', do not execute
    if (lang.startsWith('en') || !Object.keys(languages).some(language => lang.startsWith(language))) {
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

  try {
    en = await import(`./resources/${domain}/en.json`).then(module => module.default).catch(() => null);
    selectors = Object.keys(en) as TranslationKeys[];
  } catch (error) {
    console.error(`English translation file for ${domain} not found.`);
    return;
  }

  let translations: Record<string, string> | null = null;

  try {
    const module = await import(`./resources/${domain}/${lang}.json`);
    translations = module.default;
  } catch (error) {
    console.error(`Translation file for ${lang} not found.`);
    return;
  }

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (translations && element.childNodes.length) {
        element.childNodes.forEach(child => {
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