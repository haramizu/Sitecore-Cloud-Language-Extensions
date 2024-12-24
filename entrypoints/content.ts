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
  // Replace text in header
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

  // Replace text in Quick Link
  const QuickLinkSelector = 'body > sitecore-region > sitecore-extension > div.css-6rjclo > div > div > div.css-1ha1tj3 > div > div > h2';
  const QuickLinkElement = document.querySelector(QuickLinkSelector);
  if (QuickLinkElement?.textContent?.trim() === "Quick Links") {
    QuickLinkElement.textContent = "クイックリンク";
  }
}