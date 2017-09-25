import Datasource from './datasource';
import {isUrl, protocol} from './isUrl';
import Entry from './Entry';
const defaultEngine = {url: 'https://google.com/search?q=%s'};

function formatUrl(term) {
  if (protocol.test(term)) return term;

  else return 'http://' + term;
}

class SearchService
{
  constructor()
  {
    this.data = new Datasource();

    let self = this;
    this.state = {
      result: null,
      get term() {
        return this._term;
      },
      set term(value) {
        self.setTerm(value);
        this._term = value;
      },

      get label() {
        return this.searching ? this.engine.desc || this.engine.title : 'Search your feelings'
      },
      searching: false,
      engine: null,
      autocomplete: null,
      session: null,
      topSites: null,
      home: true
    };

    this.init();
  }

  async init()
  {
    this.update({});
    this.state.home = true;
    await this.data.loadLongtermEntries();
    this.state.session = Object.freeze([...this.data.session]);
    this.state.topSites = Object.freeze([...this.data.topSites]);
  }

  update({engine, autocomplete, result} = {}) {

    this.state.index = -1;
    this.entry = null;
    if(!this.state.searching) this.state.engine = engine;
    this.state.autocomplete = autocomplete;
    this.state.selected = null;
    this.state.result = Object.freeze(result);
    this.state.home = false;

  }

  setTerm(term)
  {
    term = (this.state.searching ? this.state.engine.urlo.host + ' ' : '') + term;

    let options = {autocomplete: term && (!this.state.term || term.length > this.state.term.length)};
    term ? this.search(term, options) : this.clear();
  }

  clear() {
    this.init();
  }

  get engine() {
    return this.state.engine;
  }

  set engine(value) {
    if (!this.state.searching) this.state.engine = value;
  }

  get isUrl() {
    return this.state.autocomplete || this.state.term && isUrl(this.state.term);
  }

  tab($event) {
    if (this.state.engine && !this.state.searching) {
      this.state.searching = this.state.term;
      this.state.term = "";
    }

    else this.select($event)

  }

  enter() {
    if (this.entry) {
      Entry.open(this.entry)
    }
    else if (this.state.autocomplete) {
      Entry.open(this.state.autocomplete)
    }
    else if (this.state.searching) {
      Entry.search(this.state.engine, this.state.term)
    }
    else {
      if (isUrl(this.state.term)) Entry.open({url: formatUrl(this.state.term)});
      else {
        Entry.search(defaultEngine, this.state.term)
      }
    }
  }

  backspace() {
    if (this.state.term.length == 0 && this.state.searching) {
      this.state.term = this.state.searching;
      this.state.searching = false;
    }
  }


  async search(term, options) {

    const data = await this.data.search(term, options);

    data.result = [...data.history];

    this.update(data);

  }

  select(direction, $event) {
    if (direction instanceof Object) {
      $event = direction;
      direction = $event.shiftKey ? -1 : 1;
    }

    this.state.index = Math.min(Math.max(-1, this.state.index + direction), this.state.result.length);

    this.entry = this.state.result[this.state.index];

    $event.preventDefault();
  }
}

export default (window.service = new SearchService);
