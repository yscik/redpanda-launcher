export default class SearchState
{
  constructor(service)
  {
    Object.assign(this, {
      result: null,
      index: 0,
      searching: false,
      engine: null,
      autocomplete: null,
      session: null,
      topSites: null,
      home: true,
      isUrl: false
    });

    // prevent Vue observation
    Object.defineProperty(this, 'service', {
      value: service
    })

  };

  get term()
  {
    return this._term
  }
  set term(value)
  {
    let entry = value.url;
    if(!entry)
      this.service.setTerm(value);
    else this._term = entry;
  }
  get label() {
    return this.searching ? this.engine.desc || this.engine.title : 'Search your feelings'
  }

}
