
const days = ms => ms / days.ratio;
  days.ratio = 1000*60*60*24;
  days.ms = day => day * days.ratio,
  days.now = Date.now()

const startTime = new Date(days.now - days.ms(60));

import Entry from './Entry';
import Storage from './Storage'
import Engines from './Engines'

const weightSort = (a,b) => b.weight - a.weight;
const visitSort = (a,b) => b.visitCount - a.visitCount;

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
    this._current = term;

    let history = this.searchHistory(term);
    let tabs = this.searchTabs(term);

    let session = this.filter(term, this.session);
    let bookmarks = this.filter(term, this.bookmarks);

    [history, tabs] = await Promise.all([history, tabs]);

    if(!history || !this.active(term)) return;

    let autocomplete = options.autocomplete ? this.autocomplete(term, history) : null;

    let engine = this.engine(term, autocomplete);

    return this.compile({history, tabs, session, bookmarks, engine, autocomplete});
  }

  compile(data, term)
  {
    data.result = data.history.concat(data.session, data.bookmarks, data.tabs);
    data.result.forEach(this.weight.bind(this, term));
    data.result.sort(weightSort);
    data.result.length = Math.min(data.result.length, 15);
    return data;
  }

  active(term)
  {
    return term == this._current;
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
    if(!this.active(term)) return;


    entries = Entry.process(entries, {setup: e => {e.weight = e.visitCount}});
    entries.sort(weightSort);
    entries.length = Math.min(entries.length, 15);

    return entries;

  }

  weight(term, entry)
  {
    let weight = Math.min(100, entry.weight);
    if(entry.domain.startsWith(term) || entry.title.toLowerCase().startsWith(term)) return entry.weight = weight * 5;
    else return entry.weight = weight;
  }

  autocomplete(term, entries)
  {
    const hosts = Object.values(entries.reduce(aggregateHosts, {}));

    function aggregateHosts(hosts, entry) {
      let host = entry.urlo.host;
      if (!hosts[host]) hosts[host] = {url: entry.urlo.origin, domain: entry.domain, weight: 0, source: 'host'};
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

  async searchTabs(term)
  {
    let tabs = (await browser.tabs.query({})).filter(t => t.url.toLowerCase().includes(term) || t.title.toLowerCase().includes(term))

    tabs = Entry.process(tabs, {props: {weight: 50, type: 'tab', source: 'tab'}});

    return tabs;
  }

  async loadSession()
  {
    let tabs = await browser.sessions.getRecentlyClosed({maxResults: 15});
    tabs = tabs.map(t => t.tab || t);
    tabs.length = Math.min(tabs.length, 15);
    return this.session = Entry.process(tabs, {props: {source: 'session', weight: 30}} );

  }

  async loadTopsites()
  {
    let sites = await browser.topSites.get();
    sites.length = Math.min(sites.length, 15);
    return this.topSites = Entry.process(sites, {props: {source: 'topsite'}});

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
    const bookmarks = (await browser.bookmarks.search({})).filter(b => b.type == 'bookmark');
    Engines.addBookmarks(bookmarks);
    this.bookmarks = Entry.process(bookmarks, {props: {source: 'bookmark'}, setup: b => b.weight = age(b)});
    this.engines = Engines.engines;

    function age(b)
    {
      return Math.max(5, 30 - days(days.now - b.dateAdded))
    }
  }
}