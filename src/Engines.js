
import Entry from './Entry';
import {default as settings, builtinEngines} from "./settings";

export default new class Engines
{
  constructor()
  {
    this.engines = [];
    this.defaults = builtinEngines;
  }

  addStorage(sites, engines)
  {
    for(let url in sites)
    {
      let site = sites[url];

      if(site.opensearch && !engines.find(e => e.url.endsWith(site.opensearch.url))
      && site.count >= settings.search.opensearch.visits) {
        console.log('Adding engine', site.opensearch.url);
        let engine = Object.assign({active: true, type: 'opensearch'}, site.opensearch);
        engines.unshift(engine);
      }
    }

    return this.add(engines);

  }

  add(engines, props)
  {
    engines = Entry.process(engines, {copy: true, props, setup: e => e.domain = e.urlo.hostname.replace(/^www\./, '')});

    this.engines.unshift(...engines);

    return engines;
  }

  addBookmarks(entries)
  {

    let engines = entries.filter(b =>
        b.url && b.url.includes('%s')
    );

    this.add(engines, {type: 'bookmark', active: true});

  }
}