import Datasource from './datasource';
import {isUrl, protocol} from './isUrl';
import Entry from './Entry';
import Engines from './Engines';

function formatUrl(term) {
  if (protocol.test(term)) return term;

  else return 'http://' + term;
}

class SearchService
{
  constructor()
  {


    let self = this;
    this.state = {
      result: null,
      get term()
      {
        return this._term
      },
      set term(value)
      {
        let entry = value.url;
        if(!entry)
          self.setTerm(value);
        else this._term = entry;
      },
      get label() {
        return this.searching ? this.engine.desc || this.engine.title : 'Search your feelings'
      },
      index: 0,
      searching: false,
      engine: null,
      autocomplete: null,
      session: null,
      topSites: null,
      home: true,
      isUrl: false
    };

    this.init();

    this.port = browser.runtime.connect();
    this.port.onMessage.addListener((result) => {
      this.update(result)});

  }

  async init()
  {
    this.data = new Datasource();

    this.update({});
    this.state.home = true;
    await this.data.loadLongtermEntries();
    Engines.addBookmarks(this.data.bookmarks);
    this.data.engines = Engines.engines;

    // this.state.bookmarks = Object.freeze([...this.data.bookmarks]);
    this.state.session = Object.freeze([...this.data.session]);
    this.state.topSites = Object.freeze([...this.data.topSites]);
  }

  update({engine, autocomplete, result} = {}) {

    this.state.index = -1;
    this.entry = null;
    if(!this.state.searching) {
      this.state.engine = engine;
      this.state.autocomplete = autocomplete;
    }
    this.state.selected = null;
    this.state.result = Object.freeze(result);
    this.state.home = false;
    this.state.isUrl = (this.state.autocomplete || this.state.term && isUrl(this.state.term));

  }

  setTerm(term)
  {
    if(this.state.engine) {
      let [,keyword] = /^(\w+)\s/.exec(term)||[];
      if(keyword && this.state.engine.keyword == keyword) return this.setEngine();
    }
    this.searchTerm = term;

    let searchexpr = (this.state.searching ? this.state.engine.host + ' ' : '') + term;

    let options = {
      autocomplete: !this.state.searching && term && (!this.state.term || term.length > this.state.term.length),
      term: term};
    searchexpr ? this.search(searchexpr, options) : this.clear();

    this.state._term = term;
  }

  clear() {
    this.update({});
    this.state.home = true;

  }

  get engine() {
    return this.state.engine;
  }

  set engine(value) {
    if (!this.state.searching) this.state.engine = value;
  }

  tab($event) {
    if (this.state.engine && !this.state.searching) this.setEngine();

    else this.select($event)

  }

  setEngine()
  {
    this.state.searching = this.state.term;
    this.state.autocomplete = null;
    this.state.term = "";
    this.state.isUrl = false;
  }

  enter() {
    if (this.entry) {
      Entry.open(this.entry)
    }
    else if (this.state.autocomplete) {
      Entry.open(this.state.autocomplete)
    }
    else if (this.state.searching) {
      Entry.open({url: Engines.prepare(this.state.term, this.state.engine)})
    }
    else {
      if (isUrl(this.state.term)) Entry.open({url: formatUrl(this.state.term)});
      else {
        Entry.open({url: Engines.prepare(this.state.term, Engines.default)})
      }
    }
  }

  backspace() {
    if (this.state.term.length == 0 && this.state.searching) {
      let lastTerm = this.state.searching;
      this.state.searching = false;
      this.state.term = lastTerm;
    }
  }


  async search(term, options) {

    this.port.postMessage({term, options})
    // const data = await this.data.search(term, options);
    // this.update(data);

  }

  select(direction, $event) {
    if (direction instanceof Object) {
      $event = direction;
      direction = $event.shiftKey ? -1 : 1;
    }

    this.state.index = Math.min(Math.max(-1, this.state.index + direction), this.state.result.length);

    this.entry = this.state.result[this.state.index];
    this.state.term = this.entry || this.searchTerm;

    $event.preventDefault();
  }
}

export default (window.service = new SearchService);
