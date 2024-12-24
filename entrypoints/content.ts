import en from './resources/en.json';
import ja from './resources/ja.json';

type TranslationKeys = keyof typeof en;

export default defineContentScript({
  matches: ['*://*.sitecorecloud.io/*'],
  main() {
    console.log('Hello content.');

    // Replace text in HTML
    replaceTextInSelector();

    // Observe changes in the DOM
    const observer = new MutationObserver(() => {
      replaceTextInSelector();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
});

function replaceTextInSelector() {
  const selectors = Object.keys(en) as TranslationKeys[];

  selectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim() === en[selector]) {
      if (ja[selector as keyof typeof ja]) {
        element.textContent = ja[selector as keyof typeof ja];
      }
    }
  });
}