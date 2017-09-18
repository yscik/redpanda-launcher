
import Datasource from './datasource';
import State from './state';
import ResultList from './ResultList';

export default class SearchService
{
  constructor()
  {
    this.data = new Datasource();
    this.state = null;

    this.data.loadLongtermEntries();
    this.s = {
      result: new ResultList()
    };

    this.result = this.s.result.data;

    this.term = '';

  }

  get term()
  {
    return this._term;
  }

  set term(value)
  {
    this._term = value;
    this.state && this.state.term ? this.search(this.state.term) : this.clear();
  }

  clear()
  {
    this.s.result.set([]);
    this.state = new State(this);
  }

  async search(term)
  {
    const data = await this.data.search(term);

    const result = [...data.history];
    if(this.state.engine) {
      result.unshift(this.state.engine.entry);
    }
    else {
      result.unshift(...data.engines);
      this.state.index = 0;
    }

    this.s.result.set(result);
    this.select(0);

  }

  select(direction)
  {
    this.state.index = Math.min(Math.max(0, (this.state.index||0) + direction), this.result.length);

    this.state.entry = this.result[this.state.index];
  }

  tab($event)
  {
    if(this.state.canTab) this.state.tab();
    else this.select($event.shiftKey ? -1 : 1)
  }

  enter()
  {
    this.state.enter();
  }

  open(entry)
  {
    location.href = entry.url
  }
}