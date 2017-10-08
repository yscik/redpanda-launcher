
const startTime = new Date(Date.now() - 1000*60*60*24*60);

import Entry from './Entry';
import Storage from './Storage'
import Engines from './Engines'

const weightSort = (a,b) => b.weight - a.weight;

export default class Datasource
{

  constructor()
  {
    this.session = [];
    this.topSites = [];
    this.engines = [];
  }

  async search(term, options)
  {
    term = term.toLowerCase();

    let history = this.searchHistory(term);

    let session = this.filter(term, this.session);

    history = await history;

    this.processHistory(history);
    let autocomplete = options.autocomplete ? this.autocomplete(term, history) : null;

    let engine = this.engine(term, autocomplete);

    return {history, session, engine, autocomplete};
  }


  loadLongtermEntries()
  {

    return Promise.all([
      this.loadBookmarksAndSearchEngines(),
      this.loadSession(),
      this.loadTopsites()
    ])
  }

  async searchHistory(term) {

    let entries = await browser.history.search({text: term, maxResults: 100, startTime: startTime});

    entries.forEach(e => {e.source = 'history'; e.weight = e.visitCount});
    entries = Entry.process(entries);

    return entries;

  }

  autocomplete(term, entries)
  {
    const hosts = Object.values(entries.reduce(aggregateHosts, {}));

    function aggregateHosts(hosts, entry) {
      let host = entry.urlo.host;
      if (!hosts[host]) hosts[host] = {url: entry.urlo.origin, domain: entry.urlo.hostname.replace(/^www\./, ''), weight: 0, source: 'host'};
      hosts[host].weight += entry.weight;

      return hosts;
    }

    hosts.sort(weightSort);

    return hosts.find(h => h.domain.startsWith(term));
  }

  engine(term, autocomplete)
  {
    let url = autocomplete ? autocomplete.domain : term;

    return this.engines.find(e => e.active && e.keyword == term.trim()) || this.engines.find(e => e.active && e.domain.startsWith(url))
  }

  processHistory(entries)
  {
    entries.sort(weightSort);

    entries.length = Math.min(entries.length, 15);
  }

  async searchTabs()
  {

  }

  async loadSession()
  {
    let tabs = await browser.sessions.getRecentlyClosed();
    tabs = tabs.map(t => t.tab || t);
    tabs.length = Math.min(tabs.length, 15);
    tabs.forEach(t => {t.source = 'session' });
    return this.session = Entry.process(tabs);

  }

  processBookmarks(bookmarks)
  {
    return bookmarks;

  }

  async loadTopsites()
  {
    let sites = await browser.topSites.get();
    sites.forEach(t => {t.source = 'topsite' });
    sites.length = Math.min(sites.length, 15);
    return this.topSites = Entry.process(sites);

  }

  filter(term, collection)
  {
    return (collection||[]).filter(s => (s.title && s.title.includes(term))
        || (s.urlo && s.urlo.origin &&
            s.urlo.origin.includes(term)))
  }

  async loadBookmarksAndSearchEngines()
  {
    await Storage.promise;
    const bookmarks = await browser.bookmarks.search({});
    this.bookmarks = this.processBookmarks(bookmarks);
    Engines.addBookmarks(bookmarks);
    this.engines = Engines.engines;
  }
}