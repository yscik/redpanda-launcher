export default class Entry
{

  static open(entry)
  {
    browser.tabs.update({url: entry.url})
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