
import Entry from './Entry';
import {default as settings, builtinEngines} from "./settings";

export default new class Engines
{
  constructor()
  {
    this.engines = [];
    this.defaults = builtinEngines;

  }

  updateDefault()
  {
    return this.default = this.engines.find(e => e.url == (settings.search.defaultEngine || this.defaults[0].url));
  }

  addStorage(sites, engines)
  {
    for(let url in sites)
    {
      let site = sites[url];

      if(url.startsWith('_')) continue;
      if(site.opensearch && !engines.find(e => e.url.endsWith(site.opensearch.url))
      && (site.count||0) >= settings.search.opensearch.visits) {
        console.log('Adding engine', site.opensearch.url);
        let engine = Object.assign({active: true, type: 'opensearch', keyword: null}, site.opensearch);
        engines.unshift(engine);
      }
    }

    return this.add(engines);

  }

  add(engines, props)
  {
    engines = Entry.process(engines, {copy: true, props, setup: e => e.domain = e.urlo.hostname.replace(/^www\./, '')});

    this.engines.unshift(...engines);

    this.updateDefault();
    return engines;
  }

  addBookmarks(entries)
  {

    let engines = entries.filter(b =>
        b.url && b.url.includes('%s')
        && !this.engines.find(e => e.url.endsWith(b.url))
    );

    this.add(engines, {type: 'bookmark', active: true, keyword: null});

  }

  transform(term)
  {
    settings.search.transforms.forEach(trans => term.includes(trans.pattern) && (term += ' ' + trans.append));

    return term;
  }

  prepare(term, engine)
  {
    term = this.transform(term);
    const url = engine.url.replace(/(%s|{searchTerms})/, encodeURIComponent(term));
    return url;
  }
}