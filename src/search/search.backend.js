
import {days} from "../helpers";

import {Entry} from '../data/Entry';

const weightSort = (a,b) => b.weight - a.weight;
const visitSort = (a,b) => b.visitCount - a.visitCount;

const QUERY_LIMIT = 2;
const ABORT_TRESHOLD = 3;

export class SearchBackend
{

  constructor(browsingData)
  {
    this.queries = {pending: 0, latest: null, lastFinished: null};
    this.data = browsingData;

  }

  search(term, options)
  {
    console.log('Search', term, options);
    term = term.toLowerCase();
    // this.queries.latest = {term, options};
    //
    // if(this.queries.pending >= QUERY_LIMIT)
    // {
    //   await (new Promise((resolve, reject) => this.queries.latest.run = resolve));
    // }
    // this.queries.pending++;

    let history = SearchBackend.filter(term, this.history);
    let tabs = SearchBackend.filter(term, this.data.tabs);

    let bookmarks = SearchBackend.filter(term, this.data.bookmarks);

    // history = await history;

    // await this.continueOrSkipToLatest(term);

    let autocomplete = options.autocomplete ? this.autocomplete(term, history) : null;

    let result = this.compileResults({history, tabs, bookmarks}, term);
    // this.finish(term);

    this.onresult({result, autocomplete, term});
  }

  async continueOrSkipToLatest(term)
  {
    if(term == this.queries.latest.term
      || !this.queries.lastFinished
      || (term.length - this.queries.lastFinished.length >= ABORT_TRESHOLD && this.queries.latest.term.startsWith(term)))
        return true;
    else {
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
    let entries = await this.data.searchHistory({text: term, maxResults: 100, startTime});
    await this.continueOrSkipToLatest(term);

    entries = Entry.process(entries, {setup: e => {e.weight = e.visitCount}});
    entries.sort(weightSort);
    entries.length = Math.min(entries.length, 15);

    return entries;

  }

  static weight(term, entry)
  {
    let weight = Math.min(60, entry.weight);
    let urlIndex = entry.url.indexOf(term);
    let title = entry.title.toLowerCase().indexOf(term);

    if(urlIndex == 0 || title == 0) weight *= 5;

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

  static filter(term, collection)
  {
    return (collection||[]).filter(s => (s.title && s.title.includes(term))
        || (s.origin &&
            s.origin.includes(term)))
  }

}