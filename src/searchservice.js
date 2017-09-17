
import Datasource from './datasource';
import State from './state';
import ResultList from './ResultList';

export default class SearchService
{
  constructor()
  {
    this.data = new Datasource();

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
    value ? this.search() : this.clear();
  }

  clear()
  {
    this.s.result.set([]);
    this.state = new State(this);
  }

  async search()
  {
    const result = await this.data.search(this.term);

    this.state.index = 0;
    this.s.result.set([...result.engines, ...result.history]);
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

  act()
  {
    this.open(this.state.entry)
  }

  open(entry)
  {
    location.href = entry.url
  }
}