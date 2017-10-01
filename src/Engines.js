
const builtinEngines = [
  {title: 'Google', url: 'https://google.com/search?q=%s'},
  {title: 'Bing', url: 'https://bing.com/search?q=%s'},
  {title: 'Yahoo', url: 'https://yahoo.com/search?p=%s'},
  {title: 'Wikipedia (en)', url: 'https://en.wikipedia.org/w/index.php?title=Special:Search&search=%s'},
  {title: 'Amazon.com', url: 'https://www.amazon.com/s?field-keywords=%s'},
  {title: 'DuckDuckGo', url: 'https://duckduckgo.com/search?q=%s'},
  {title: 'Twitter', url: 'https://twitter.com/search?q=%s'},
];
builtinEngines.forEach(e => {e.active = true; e.type='opensearch'});

import Entry from './Entry';

export default new class Engines
{
  constructor()
  {
    this.engines = [];
    this.default = builtinEngines;
  }

  addStorage(sites, engines)
  {
    for(let url in sites)
    {
      let site = sites[url];
      if(site.opensearch && !engines.find(e => e.url.endsWith(site.opensearch.url))) {
        console.log("Adding ", site.opensearch.url);
        let engine = Object.assign({active: true}, site.opensearch);
        engines.unshift(engine);
      }
    }

    return this.add(engines, {type: 'opensearch'});

  }

  add(engines, props)
  {
    engines = Entry.process(engines, {copy: true, props, setup: e => e.domain = e.urlo.hostname.replace(/^www\./, '')});

    this.engines.push(...engines);

    return engines;
  }

  addBookmarks(entries)
  {

    let engines = entries.filter(b =>
        b.url && b.url.includes('%s')
    );
    engines.reverse();

    this.add(engines, {type: 'bookmark', active: true});

  }
}