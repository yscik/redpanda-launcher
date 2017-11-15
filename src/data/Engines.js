import {Entry} from './Entry';
import {Engine} from "./Engine";

const BOOKMARK_FOLDER = 'Search Engines - Red Panda Launcher';
export class Engines {

  constructor() {
    this.engines = [];
  }

  find(keyword, url)
  {
    keyword = keyword.trim();
    return this.engines.find(e => e.config.active && e.config.keyword == keyword) || this.engines.find(e => e.config.active && e.domain.startsWith(url))
  }

  setup(data)
  {
    this.addSaved(data.bookmarks_all);
    this.addDefaults();
    this.addDiscovered(data.storage);
    this.addBookmarked(data.bookmarks_all);

    this.updateDefault();

    return this.engines;
  }


  save(engine = null)
  {
    const isNew = (engine) => engine.config.active && engine.type == 'opensearch'
        && !this.folder.children.find(b => b.url == engine.url);

    const createBookmark = ({title, url}) => {
      browser.bookmarks.create({title, url, parentId: this.folder.id})
    };

    engine ? createBookmark(engine) : this.engines.filter(isNew).forEach(createBookmark);

  }

  addSaved(bookmarks)
  {
    this.folder = bookmarks.find(b => b.title == BOOKMARK_FOLDER);
    if(this.folder) this.add(this.folder.children, {type: 'opensearch'});
    else this.createBookmarkFolder();
  }

  async createBookmarkFolder() {
    this.folder = await browser.bookmarks.create({
      type: 'folder',
      title: BOOKMARK_FOLDER
    });
  }

  updateDefault() {
    return this.default = this.engines.default = this.engines.find(e => e.url == (this.settings.defaultEngine || Engines.defaults[0].url));
  }

  configure(engines, defaultConfig)
  {
    (engines || this.engines).forEach(engine => {
      this.settings.config[engine.id] = engine.configure(this.settings.config[engine.id] || (defaultConfig && Object.assign({}, defaultConfig)))
    });

  }

  exists(url) {
    return this.engines.find(e => e.url.endsWith(url))
  }

  add(engines, props, config) {
    if(!engines) return;
    engines = engines.filter((entry) => entry.url && !this.exists(entry.url));

    engines = Entry.process(engines, {constructor: Engine, props});

    Array.prototype.push.apply(this.engines, engines);
    this.configure(engines, config);

    return engines;
  }

  addDefaults() {
    let engines = this.add(Engines.defaults, {type: 'builtin'}, {active: true});
    engines.forEach(e => e.keyword && (e.config.keyword = e.keyword))
  }

  addDiscovered(sites)
  {
    let newEngines = [];
    for (let url in sites) {
      let site = sites[url];

      if (url.startsWith('_')) continue;
      if (site.opensearch && !this.exists(site.opensearch.url)) {
        newEngines.unshift(site.opensearch);
      }
    }

    return this.add(newEngines, {type: 'opensearch'}, {active: false, pending: true});

  }

  addBookmarked(entries) {

    let engines = entries.filter(b =>
        b.url && b.url.includes('%s')
    );

    this.add(engines, {type: 'bookmark'}, {active: true});

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
