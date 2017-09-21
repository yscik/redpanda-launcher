

(async function focus () {

  const URL = location.href;
  if(location.search.startsWith('?f'))
  {
    browser.history.deleteUrl({ url : URL.replace(/\?.*$/, '') });
    return window.focused = true;
  }

  browser.tabs.getCurrent((tab) => {
    const tabId = tab.id;
    browser.tabs.create({ url : URL+'?f'}, () => {
      browser.tabs.remove(tabId);
    });
  });

})();