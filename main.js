// Function to get all links on the page
function getAllLinks() {
  return Array.from(document.getElementsByTagName('a')).map(a => a.href);
}

// Get initial links from the static HTML
const initialLinks = getAllLinks();

// Return a promise that resolves after JavaScript execution
return new Promise((resolve) => {
  // Use MutationObserver to detect changes in the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        const newLinks = addedNodes
          .filter(node => node.nodeName === 'A')
          .map(a => a.href);
        if (newLinks.length > 0) {
          resolve(newLinks);
        }
      }
    });
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });

  // Fallback timeout in case no new links are added
  setTimeout(() => {
    const currentLinks = getAllLinks();
    const jsGeneratedLinks = currentLinks.filter(link => !initialLinks.includes(link));
    resolve(jsGeneratedLinks);
  }, 5000); // Wait for 5 seconds, adjust as needed
}).then(jsGeneratedLinks => {
  // Return the JavaScript-generated links to Screaming Frog
  return seoSpider.data(jsGeneratedLinks);
});
