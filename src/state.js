
import Entry from './Entry';
import isUrl from './isUrl';

export default class State
{
  constructor(searchservice)
  {
    this.entry = null;
    this.service = searchservice;
    this.init();

    this.defaultEngine = {entry: {url: 'https://google.com/search?q=%s'}}
  }

  get term() {
    return (this.searching ? this.engine.urlo.host + ' ' : '') + this.service.term;
  }

  get entry()
  {
    return this._entry;
  }

  get engine()
  {
    return this._engine;
  }

  set engine(value)
  {
    if(!this.searching) this._engine = value;
  }

  get isUrl() {
    return isUrl(this.service.term)
  }

  init({engine, autocomplete} = {})
  {
    if(this._entry) this._entry.selected = false;

    this.index = -1;
    // this.searching = false;
    this.engine = engine;
    this.autocomplete = autocomplete;

  }

  set entry(entry)
  {
    if(this._entry) this._entry.selected = false;
    this._entry = entry;

    if(entry) entry.selected = true;

  }

  get label()
  {
    return this.searching ? this.engine.desc || this.engine.title : 'Search your feelings'
  }

  tab($event)
  {
    if(this.engine && !this.searching)
    {
      this.searching = this.service.term;
      this.service.term = "";

    }

    else this.service.select($event)

  }

  enter()
  {
    if(this.entry) {
      Entry.open(this.entry)
    }
    else if(this.autocomplete)
    {
      Entry.open(this.autocomplete)
    }
    else if(this.searching) {
      Entry.search(this.engine, this.service.term)
    }
    else {
      if (this.isUrl) Entry.open({url: this.formatUrl(this.service.term)});
      else {
        Entry.search(this.defaultEngine.entry, this.service.term)
      }
    }
  }

  backspace()
  {
    if(this.service.term.length == 0 && this.searching) {
      this.service.term = this.searching;
      this.searching = false;
    }
  }

  formatUrl(term) {
    if(term.match(/^.+:\/\//)) return term;

    else return 'http://'+term;
  }


}