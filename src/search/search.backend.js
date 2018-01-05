
import {days} from "../helpers";
import {Entry} from '../data/Entry';

const weightSort = (a,b) => b.weight - a.weight;
const ageWeight = date => Math.max(0, 30 - days.age(date));

const HistorySearchLimit = 1000;

export class SearchBackend
{

  constructor(browsingData)
  {
    this.query = {running: false, pending: null, last: {}};
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

    let history = await this.searchHistory(term, this.history);
    let tabs = this.filter(term, this.data.tabs);

    let bookmarks = this.filter(term, this.data.bookmarks);

    history = await history;

    let autocomplete = options.autocomplete ? this.autocomplete(term, history) : null;

    let result = this.compileResults({history, tabs, bookmarks}, term);

    this.onResult({result, autocomplete, term});

    this.query.running = false;
    if(this.query.pending) {
      return this.search(this.query.pending.term, this.query.pending.options);
    }

    this.query.last.term = term;
  }

  compileResults(data, term)
  {
    let result = data.history.concat(data.bookmarks, data.tabs);
    result = this.removeDuplicates(result);

    result.forEach(SearchBackend.weight.bind(this, term));

    result.sort(weightSort);
    result.length = Math.min(result.length, 15);
    return result;
  }

  removeDuplicates(data)
  {
    return data.filter(a => {
      return !data.find(b => {

        if (a != b && b.url == a.url) {
          return (b.source == "tab" || !a.source)
        }
        else return false;
      });

    })
  }

  async searchHistory(term) {

    const finalizeResult = (entries) =>
    {
      this.query.last.history = entries.length < HistorySearchLimit ? entries : null;
      return Entry.process(entries.slice(0, 15));
    };

    if(this.query.last.history && this.query.last.term && term.startsWith(this.query.last.term) && this.query.last.history)
    {
      if(!this.query.last.history.length)
      {
        return [];
      }
      else
      {
        const entries = this.filter(term, this.query.last.history);
        return finalizeResult(entries);
      }
    }

    const startTime = new Date(Date.now() - days.ms(60));

    let entries = await this.data.searchHistory({text: term, maxResults: HistorySearchLimit, startTime});

    entries.forEach(e => {
      e.weight = Math.min(60, e.visitCount) + ageWeight(e.lastVisitTime);
      e.age = days.age(e.lastVisitTime)
    });

    entries.sort(weightSort);

    return finalizeResult(entries);

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
    const terms = term.split(' ');

    return (collection||[]).filter(s => containsTerms(s.title) || containsTerms(s.url));

    function containsTerms(value)
    {
      if(!value) return false;
      value = value.toLowerCase();
      return terms.every(term => value.includes(term))
    }
  }

}