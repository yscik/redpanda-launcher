import {isUrl} from './isUrl';
import {SearchState} from "./search.state";
import {Outbound} from "./outbound";

export class SearchService
{
  constructor(backend, engines)
  {
    this.backend = backend;
    this.backend.onResult = (data) => this.update(data);
    this.engines = engines;
    this.searchTerm = null;
    this.entry = null;
    this.state = new SearchState(this);
  }

  attach()
  {
    this.state = new SearchState(this);
    this.state.setTerm("");
    this.update({});
    this.state.home = true;

    return this.state;
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

    return this.engines.find(term, url)
  }

  setTerm(term)
  {
    if(this.state.engine) {
      let [,keyword] = /^(\w+)\s/.exec(term)||[];
      if(keyword && this.state.engine.config.keyword == keyword) return this.setEngine();
    }
    this.searchTerm = term;

    let searchexpr = (this.state.searching ? this.state.engine.domain + ' ' : '') + term;

    let options = {
      autocomplete: !this.state.searching && term && (!this.state.prevTerm || term.length > this.state.prevTerm.length),
      term: term};
    searchexpr ? this.backend.search(searchexpr, options) : this.clear();
  }

  // async search(term, options) {
  //
  //   const data = await this.backend.search(term, options);
  //   this.update(data);
  //
  // }

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
    if(this.state.result) {
      $event.preventDefault();

      if (this.state.engine && !this.state.searching) this.setEngine();

      else this.select($event)
    }

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
      Outbound.open(this.entry, $event)
    }
    else if (this.state.autocomplete) {
      Outbound.open(this.state.autocomplete)
    }
    else if (this.state.searching) {
      Outbound.search(this.state.term, this.state.engine)
    }
    else {
      if (isUrl(this.state.term)) Outbound.open({url: Outbound.formatUrl(this.state.term)});
      else {
        Outbound.search(this.state.term, this.engines.default)
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

  select(direction, $event) {
    if (direction instanceof Object) {
      $event = direction;
      direction = $event.shiftKey ? -1 : 1;
    }

    this.state.index = Math.min(Math.max(-1, this.state.index + direction), this.state.result.length);

    this.entry = this.state.result[this.state.index];
    this.entry ? this.state.setEntry(this.entry) : this.state.term = this.searchTerm;

    $event.preventDefault();
  }
}