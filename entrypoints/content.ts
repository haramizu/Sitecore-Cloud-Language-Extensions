import en from './resources/en.json';
import languages from './resources/languages.json';

type TranslationKeys = keyof typeof en;

export default defineContentScript({
  matches: ['*://*.sitecorecloud.io/*'],
  main() {
    const lang = navigator.language.slice(0, 2);

    console.log('lang: ' + lang);

    // If the language is 'en', do not execute
    if (lang.startsWith('en') || !Object.keys(languages).some(language => lang.startsWith(language))) {
      console.log('Original');

      return;
    }

    // Replace text in HTML
    replaceTextInSelector(lang);

    // Observe changes in the DOM
    const observer = new MutationObserver(() => {
      replaceTextInSelector(lang);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
});

async function replaceTextInSelector(lang: string) {
  const selectors = Object.keys(en) as TranslationKeys[];
  let translations: Record<string, string> | null = null;

  try {
    const module = await import(`./resources/${lang}.json`);
    translations = module.default;
  } catch (error) {
    console.error(`Translation file for ${lang} not found.`);
    return;
  }

  selectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (translations && element?.textContent?.trim() === en[selector]) {
      if (translations[selector as keyof typeof translations]) {
        element.textContent = translations[selector as keyof typeof translations];
      }
    }
  });
}