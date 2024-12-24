export default defineContentScript({
  matches: ['*://*.sitecorecloud.io/*'],
  main() {
    console.log('Hello content.');

    // Observe changes in the DOM
    const observer = new MutationObserver(() => {
      replaceTextInSelector();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
});

function replaceTextInSelector() {
  const selector = 'a[data-targetid="home_1"]';
  const element = document.querySelector(selector);
  if (element && element.textContent) {
    element.textContent = element.textContent.replace(/Home/, 'ホーム');
  }
}