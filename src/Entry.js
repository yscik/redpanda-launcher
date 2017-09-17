export default class Entry
{
  constructor(data)
  {

    ({url: this.url, weight: this.weight, title: this.title, source: this.source} = data);
    try {
      this.urlo = new URL(data.url);
    }
    catch(e)
    {
      this.urlo = {invalid: true}
    }

    this.selected = false;
  }

  open()
  {
    browser.tabs.update({url: this.url})
  }

  static wrap(entry)
  {
      return entry instanceof Entry ? entry : new Entry(entry);
  }

}