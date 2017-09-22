
const startTime = new Date(Date.now() - 1000*60*60*24*60);

// import ResultList from './ResultList';
import Entry from './Entry';
import sites from './sites'

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
    let history = this.searchHistory(term);

    let session = this.filter(term, this.session);
    let engine = this.engine(term, this.engines);

    history = await history;

    this.processHistory(history);
    let autocomplete = options.autocomplete ? this.autocomplete(term, history) : null;

    return {history, session, engine, autocomplete};
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

    let entries = await browser.history.search({text: term, maxResults: 300, startTime: startTime});

    entries.forEach(e => {e.source = 'history'; e.weight = e.visitCount});
    entries = entries.map(Entry.wrap);

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

    console.log(hosts.map(h => h.domain));
    return hosts.find(h => h.domain.startsWith(term));
  }

  engine(term, engines)
  {
    return engines.find(e => e.domain.startsWith(term))
  }

  processHistory(entries)
  {
    entries.sort(weightSort);

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

  filter(term, collection)
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

    engines.forEach(e => {e.source = 'engine'; e.weight = 100; e.opensearch = e.url.includes('{searchTerms}'); e.domain = e.urlo.hostname.replace(/^www\./, '') });

    this.engines = engines;
  }
}