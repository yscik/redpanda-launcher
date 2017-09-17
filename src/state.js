
export default class State
{
  constructor(searchservice)
  {
    this.entry = null;
    this.service = searchservice;
    this.term = null;
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

    this.canTab = entry && entry.source === 'engine';
    this.engine = null;

  }

  tab()
  {
    if(this.canTab)
    {
      this.engine = this.entry;
      this.term = "";

      this.canTab = false;
    }

  }

}