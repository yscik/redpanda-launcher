
const days = ms => ms / days.ratio;
  days.ratio = 1000*60*60*24;
  days.ms = day => day * days.ratio,
  days.now = Date.now()

const startTime = new Date(days.now - days.ms(60));

import Entry from './Entry';

const weightSort = (a,b) => b.weight - a.weight;
const visitSort = (a,b) => b.visitCount - a.visitCount;

const QUERY_LIMIT = 2;
const ABORT_TRESHOLD = 3;

export default class Datasource
{

  constructor()
  {
    this.session = [];
    this.topSites = [];
    this.engines = [];
    this.queries = {pending: 0, latest: null, lastFinished: null};
  }

  async search(term, options)
  {
    term = term.toLowerCase();
    this.queries.latest = {term, options};

    if(this.queries.pending >= QUERY_LIMIT)
    {
      console.log('Delaying', term);
      await (new Promise((resolve, reject) => this.queries.latest.run = resolve));
    }
    this.queries.pending++;
    let t = performance.now();

    console.log('Querying', term);

    let history = this.searchHistory(term);
    let tabs = Datasource.filter(term, this.tabs);

    let session = Datasource.filter(term, this.session);
    let bookmarks = Datasource.filter(term, this.bookmarks);

    [history, tabs] = await Promise.all([history, tabs]);

    await this.continueOrSkipToLatest(term);

    let autocomplete = options.autocomplete ? this.autocomplete(term, history) : null;

    let engine = this.engine(term, autocomplete);

    let result = this.compile({history, tabs, session, bookmarks, engine, autocomplete});
    console.log('Time', term, performance.now() - t);
    this.finish(term);

    return result;
  }

  async continueOrSkipToLatest(term)
  {
    console.log([this.queries.lastFinished, term, this.queries.latest.term].join(':'), );
    if(term == this.queries.latest.term
      || !this.queries.lastFinished
      || (term.length - this.queries.lastFinished.length >= ABORT_TRESHOLD && this.queries.latest.term.startsWith(term)))
        return true;
    else {
      console.log('Aborting', term);
      this.finish();
      await new Promise(function() {});
    }
  }

  finish(term)
  {
    this.queries.pending--;
    if(term) this.queries.lastFinished = term;
    this.queries.latest.run && this.queries.latest.run();
  }

  compile(data, term)
  {
    data.result = data.history.concat(data.session, data.bookmarks, data.tabs);
    data.result.forEach(this.weight.bind(this, term));
    data.result.sort(weightSort);
    data.result.length = Math.min(data.result.length, 15);
    return data;
  }

  async searchHistory(term) {

    let entries = await browser.history.search({text: term, maxResults: 100, startTime: startTime});
    await this.continueOrSkipToLatest(term);

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
      let host = entry.origin;
      if (!hosts[host]) hosts[host] = {url: entry.origin, domain: entry.domain, weight: 0, source: 'host'};
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

  // async searchTabs(term)
  // {
  //   let tabs = this.tabs.filter(t => t.url.toLowerCase().includes(term) || t.title.toLowerCase().includes(term))
  //
  //   tabs = Entry.process(tabs, {props: {weight: 50, type: 'tab', source: 'tab'}});
  //
  //   return tabs;
  // }

  static filter(term, collection)
  {
    return (collection||[]).filter(s => (s.title && s.title.includes(term))
        || (s.origin &&
            s.origin.includes(term)))
  }

  loadLongtermEntries()
  {

    return Promise.all([
      this.loadBookmarks(),
      this.loadSession(),
      this.loadTopsites(),
      this.loadTabs()
    ])
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

  async loadTabs()
  {
    let tabs = await browser.tabs.query({});
    return this.tabs = Entry.process(tabs, {props: {source: 'tab', type: 'tab', weight: 50}});

  }

  async loadBookmarks()
  {
    const bookmarks = (await browser.bookmarks.search({})).filter(b => b.type == 'bookmark');
    this.bookmarks = Entry.process(bookmarks, {props: {source: 'bookmark'}, setup: b => b.weight = age(b)});

    function age(b)
    {
      return Math.max(5, 30 - days(days.now - b.dateAdded))
    }
  }
}