export default class Entry
{

  static open(entry)
  {
    // browser.tabs.getCurrent().then(tab => browser.tabs.remove(tab.id));

    browser.tabs.update({url: entry.url})
  }


  static search(entry, term)
  {
    const url = entry.url.replace(/(%s|{searchTerms})/, encodeURIComponent(term));

    Entry.open({url})
  }

  static wrap(entry)
  {
    if(!entry.urlo)
    try {
      entry.urlo = new URL(entry.url);
    }
    catch(e)
    {
      entry.urlo = {invalid: true}
    }

    entry.selected = false;

    return entry;
  }

}