import Datasource from './datasource';
import {isUrl, protocol} from './isUrl';
import Entry from './Entry';
import Engines from './Engines';
import Bookmarks from './Bookmarks';
import SearchState from "./searchservice";

function formatUrl(term) {
  if (protocol.test(term)) return term;

  else return 'http://' + term;
}

export default class SearchService
{
  constructor()
  {
    this.state = new SearchState();

    this.init();
  }

  async init()
  {
    this.data = new SearchBackend();

    // this.data = (await browser.runtime.getBackgroundPage()).dataSource;

    this.update({});
    this.state.home = true;
    await this.data.loadLongtermEntries();
    Engines.addBookmarks(this.data.bookmarks);
    Bookmarks.init(this.data.raw.bookmarks);
    this.data.engines = Engines.engines;

    // this.state.bookmarks = Object.freeze([...this.data.bookmarks]);
    this.state.session = Object.freeze([...this.data.session]);
    this.state.topSites = Object.freeze([...this.data.topSites]);
  }

  update({term, autocomplete, result} = {}) {

    this.state.index = -1;
    this.entry = null;
    if(!this.state.searching) {

      this.state.engine = term && this.getEngine(term, autocomplete);
      this.state.autocomplete = autocomplete;
    }
    this.state.selected = null;
    this.state.result = Object.freeze(result);
    this.state.home = false;
    this.state.isUrl = (this.state.autocomplete || this.state.term && isUrl(this.state.term));

  }


  getEngine(term, autocomplete)
  {
    let url = autocomplete ? autocomplete.domain : term;

    return Engines.engines.find(e => e.active && e.keyword == term.trim()) || Engines.engines.find(e => e.active && e.domain.startsWith(url))
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

  enter($event) {
    if (this.entry) {
      Entry.open(this.entry, $event)
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

    // this.port.postMessage({search: {term, options}})
    const data = await this.data.search(term, options);
    this.update(data);

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