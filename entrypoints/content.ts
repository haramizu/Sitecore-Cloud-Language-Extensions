export default defineContentScript({
  matches: ['*://*.sitecorecloud.io/*'],
  main() {
    console.log('Hello content.');

    // Log the domain name
    console.log('Current domain:', window.location.hostname);

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
  const selector = 'body > form > header';
  const element = document.querySelector(selector);
  if (element?.textContent?.trim() === "Select organization") {
    element.textContent = "組織の選択";
  }
  // Replace text in footer link
  const footerLinkSelector = 'body > form > footer > a';
  const footerLinkElement = document.querySelector(footerLinkSelector);
  if (footerLinkElement?.textContent?.trim() === "Cancel") {
    footerLinkElement.textContent = "取り消し";
  }

}