
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
    let options = {autocomplete: value && (!this._term || value.length > this._term.length)};
    this._term = value;
    this.state && this.state.term ? this.search(this.state.term, options) : this.clear();
  }

  clear()
  {
    this.s.result.set([]);
    this.state = new State(this);
  }

  async search(term, options)
  {
    const data = await this.data.search(term, options);

    const result = [...data.history];

    this.state.init(data);

    this.s.result.set(result);

  }

  select(direction, $event)
  {
    if(direction instanceof Object)
    {
      $event = direction;
      direction = $event.shiftKey ? -1 : 1;
    }

    this.state.index = Math.min(Math.max(-1, this.state.index + direction), this.result.length);

    this.state.entry = this.result[this.state.index];

    $event.preventDefault();
  }

  open(entry)
  {
    location.href = entry.url
  }
}