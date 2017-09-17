
(function focus() {

  const URL = location.href;
  if(true||location.search === '?f') return window.focused = true;

  return browser.tabs.getCurrent((tab) => {
    const tabId = tab.id;
    browser.tabs.create({ url : URL+'?f'}, () => {
      browser.tabs.remove(tabId);
    });
  });

  browser.history.deleteUrl({ url : URL });

})();