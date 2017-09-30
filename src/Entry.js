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

  static process(entries)
  {
    return entries.reduce((result,entry) =>
    {
      if (!entry.urlo)
        try {
          entry.url = entry.url.replace(/^\/\//, 'https://');
          entry.urlo = new URL(entry.url);
          result.push(entry);
          entry.selected = false;
        }
        catch (e) {
          // Invalid entry, discarded
        }


      return result;
    }, [])
  }

}