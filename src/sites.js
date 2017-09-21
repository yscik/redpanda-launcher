
export default new class Sites {

  constructor()
  {
    this.enginges = [];
    this.icons = [];
    this.promise = this.load()
  }

  async load()
  {
    const storage = await browser.storage.local.get() || {};

    let engines = [];
    for(let url in storage)
    {
      let site = storage[url];
      if(site.opensearch)
        engines.push(site.opensearch)
    }

    this.engines = engines;
    this.icons = storage;

    return this
  }

};