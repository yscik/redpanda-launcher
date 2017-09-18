
import Entry from './Entry';

export default class State
{
  constructor(searchservice)
  {
    this.entry = null;
    this.service = searchservice;
  }

  get term() {
    return (this.engine ? this.engine.prefix : '') + this.service.term;
  }

  get entry()
  {
    return this._entry;
  }

  set entry(entry)
  {
    if(this._entry) this._entry.selected = false;
    this._entry = entry;

    if(entry) entry.selected = true;

    if(!(this.engine && entry == this.engine.entry))
    {
      this.canTab = entry && entry.source === 'engine';
      this.engine = null;
    }

  }

  tab()
  {
    if(this.canTab)
    {
      this.engine = {entry: this.entry, prefix: this.entry.urlo.origin};
      this.service.term = "";

      this.canTab = false;
    }

  }

  enter()
  {
    if(this.engine) {

      const url = this.engine.entry.url.replace(/(%s|{searchTerms})/, this.service.term);
      browser.tabs.update({url})

    }
    else {
      Entry.open(this.entry)
    }
  }

}