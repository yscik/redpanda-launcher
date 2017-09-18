
const startTime = new Date(Date.now() - 1000*60*60*24*60);

// import ResultList from './ResultList';
import Entry from './Entry';
import sites from './sites'

export default class Datasource
{

  constructor()
  {
    this.session = [];
    this.topSites = [];
    this.engines = [];
  }

  async search(term)
  {
    let history = this.searchHistory(term);

    let session = this.filter(this.session, term);
    let engines = this.filter(this.engines, term);

    history = await history;

    return {history, session, engines};
  }


  loadLongtermEntries()
  {
    return Promise.all([
      this.loadSession(),
      this.loadSearchEngines(),
      this.loadTopsites()
    ])
  }

  async searchHistory(term) {

    let entries = await browser.history.search({text: term, maxResults: 100, startTime: startTime});

    entries.forEach(e => {e.source = 'history'; e.weight = e.visitCount});
    entries = entries.map(Entry.wrap);
    this.processHistory(entries);
    return entries;

  }

  processHistory(entries)
  {
    const hosts = entries.reduce(aggregateHosts, {});

    function aggregateHosts(hosts, entry) {
      let host = entry.urlo.host;
      if (!hosts[host]) hosts[host] = {url: entry.urlo.origin, weight: 0, source: 'host'};
      hosts[host].weight += entry.weight;

      return hosts;
    }

    entries.push(...Object.values(hosts));

    entries.sort((a,b) => b.weight - a.weight);

    entries.length = Math.min(entries.length, 30);
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
    return this.session = tabs.map(Entry.wrap);

  }

  async loadTopsites()
  {
    let sites = await browser.topSites.get();
    sites.forEach(t => {t.source = 'topsite' });
    sites.length = Math.min(sites.length, 15);
    return this.topSites = sites.map(Entry.wrap);

  }

  filter(collection, term)
  {
    return (collection||[]).filter(s => (s.title && s.title.includes(term))
        || (s.urlo && s.urlo.origin &&
            s.urlo.origin.includes(term)))
  }

  async loadSearchEngines()
  {
    const all = await browser.bookmarks.search({});
    const engines = all.filter(b =>
        b.url && b.url.includes('%s')
    );

    await sites.promise;
    engines.push(...sites.engines);

    engines.map(Entry.wrap);

    engines.forEach(e => {e.source = 'engine'; e.weight = 100; e.opensearch = e.url.includes('{searchTerms}') });

    this.engines = engines;
  }
}