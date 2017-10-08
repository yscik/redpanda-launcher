import Engines from './Engines';

export default class Entry
{

  static open(entry)
  {
    // browser.tabs.getCurrent().then(tab => browser.tabs.remove(tab.id));

    browser.tabs.update({url: entry.url})
  }


  static search(entry, term)
  {
    Entry.open({url: Engines.prepare(term, entry)})
  }

  static process(entries, {copy = false, props = null, setup = null} = {})
  {
    return entries.reduce((result,entrydata) =>
    {
      let entry = copy ? Object.assign({}, entrydata, props) : props ? Object.assign(entrydata, props) : entrydata;

      try {
        entry.url = entry.url.replace(/^\/\//, 'https://');
        entry.urlo = new URL(entry.url);
        result.push(entry);
        entry.selected = false;
        if(setup) setup(entry);
      }
      catch (e) {
        // Invalid entry, discarded
      }

      return result;
    }, [])
  }

}