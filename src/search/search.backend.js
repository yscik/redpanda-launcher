
import {days} from "../helpers";
import {Entry} from '../data/Entry';

const weightSort = (a,b) => b.weight - a.weight;
const ageWeight = date => Math.max(0, 30 - days.age(date));

export class SearchBackend
{

  constructor(browsingData)
  {
    this.query = {running: false, pending: null};
    this.data = browsingData;
  }

  async search(term, options)
  {
    term = term.toLowerCase();

    if(this.query.running) {
      this.query.pending = {term, options};
      return;
    }

    this.query.pending = null;
    this.query.running = true;

    performance.mark('search-start-'+term);

    let history = await this.searchHistory(term, this.history);
    let tabs = this.filter(term, this.data.tabs);

    let bookmarks = this.filter(term, this.data.bookmarks);

    history = await history;

    let autocomplete = options.autocomplete ? this.autocomplete(term, history) : null;

    let result = this.compileResults({history, tabs, bookmarks}, term);

    this.onResult({result, autocomplete, term});

    performance.mark('search-end-'+term);
    performance.measure('search-'+term, 'search-start-'+term, 'search-end-'+term);

    this.query.running = false;
    if(this.query.pending) {
      return this.search(this.query.pending.term, this.query.pending.options);
    }

  }

  compileResults(data, term)
  {
    const result = data.history.concat(data.bookmarks, data.tabs);
    result.forEach(SearchBackend.weight.bind(this, term));
    result.sort(weightSort);
    result.length = Math.min(result.length, 15);
    return result;
  }

  async searchHistory(term) {

    const startTime = new Date(Date.now() - days.ms(60));
    let entries = await this.data.searchHistory({text: term, maxResults: 500, startTime});

    entries = Entry.process(entries, {setup: e => {
      e.weight = Math.min(60, e.visitCount) + ageWeight(e.lastVisitTime);
      e.age = days.age(e.lastVisitTime)
    }});

    entries.sort(weightSort);
    entries.length = Math.min(entries.length, 15);

    return entries;

  }

  static weight(term, entry)
  {
    let weight = Math.min(60, entry.weight);
    let urlIndex = entry.url.indexOf(term);
    let domainIndex = entry.domain.indexOf(term);
    let titleIndex = entry.title.toLowerCase().indexOf(term);

    let index = Number.MAX_SAFE_INTEGER;
    [urlIndex, domainIndex, titleIndex].forEach(i => { if(i != -1 && i < index) index = i });

    if(index == 0) weight *= 5;
    else weight += 30 - index;

    return entry.weight = weight;
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

  filter(term, collection)
  {
    return (collection||[]).filter(s => (s.title && s.title.toLowerCase().includes(term))
        || (s.origin &&
            s.origin.toLowerCase().includes(term)))
  }

}