import {Entry} from './Entry';

export class Engines {
  constructor() {
    this.engines = [];
  }

  setup(data, engineSettings)
  {
    this.addConfiguration(engineSettings);
    this.addDiscovered(data.storage);
    this.addBookmarked(data.bookmarks);

    this.updateDefault();

    return this.engines;
  }

  updateDefault() {
    return this.default = Object.freeze(this.engines.find(e => e.url == (this.settings.defaultEngine || Engines.defaults[0].url)));
  }

  addConfiguration(engines) {
    this.add(engines);
  }

  addDiscovered(sites)
  {
    let newEngines = [];
    for (let url in sites) {
      let site = sites[url];

      if (url.startsWith('_')) continue;
      if (site.opensearch && !this.find(site.opensearch.url)) {
        let engine = Object.assign({active: true, type: 'opensearch', keyword: null}, site.opensearch);
        newEngines.unshift(engine);
      }
    }

    return this.add(newEngines);

  }

  find(url) {
    return this.engines.find(e => e.url.endsWith(url))
  }

  add(engines, props) {
    engines = Entry.process(engines, {copy: true, props});

    engines.forEach((entry) => {
      if(!this.find(entry.url))
        this.engines.push(entry);
    });

    return engines;
  }

  addBookmarked(entries) {

    let engines = entries.filter(b =>
        b.url && b.url.includes('%s')
    );

    this.add(engines, {type: 'bookmark', active: true, keyword: null});

  }
}

Engines.defaults = [
  {title: 'Google', url: 'https://google.com/search?q=%s'},
  {title: 'Bing', url: 'https://bing.com/search?q=%s'},
  {title: 'Yahoo', url: 'https://yahoo.com/search?p=%s'},
  {title: 'Wikipedia (en)', url: 'https://en.wikipedia.org/w/index.php?title=Special:Search&search=%s', keyword: 'w'},
  {title: 'Amazon.com', url: 'https://www.amazon.com/s?field-keywords=%s'},
  {title: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s'},
  {title: 'Twitter', url: 'https://twitter.com/search?q=%s'},
];
Engines.defaults.forEach(e => {e.active = true; e.type='builtin'});
