import placeholderList from '../data/placeholder-eastereggs.txt'
const placeholders = placeholderList.split('\n');

export class SearchState
{
  constructor(service)
  {
    Object.assign(this, {
      result: null,
      index: 0,
      searching: false,
      engine: null,
      autocomplete: null,
      home: true,
      isUrl: false,
      term: "",
    });

    // prevent Vue observation
    Object.defineProperty(this, 'service', {
      value: service
    });

    this.placeholder = placeholders[Math.round(Math.random()*100)] || ''

  };

  setTerm(term)
  {
    this.prevTerm = this.term;
    this.term = term;
    this.service.setTerm(term)
  }
  setEntry(entry)
  {
    this.term = entry.url;
  }
  get label() {
    return this.searching ? this.engine.desc || this.engine.title : this.placeholder
  }

}
