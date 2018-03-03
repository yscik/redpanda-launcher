
import {SearchHistory} from "./search.history.js";
import {filter} from "./filter.js";
import {weightSort} from "../helpers.js";

export class SearchBackend
{

  constructor(browsingData)
  {
    this.query = {running: false, pending: null, last: {}};
    this.data = browsingData;
    this.history = new SearchHistory(browsingData);
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

    let history = await this.history.search(term);
    let tabs = filter(term, this.data.tabs);

    let bookmarks = filter(term, this.data.bookmarks);

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

    // result.forEach(entry => this.adjustWeightForTermPosition(entry, term));

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


  adjustWeightForTermPosition(entry, term)
  {
    let weight = entry.weight;
    let urlIndex = entry.url.indexOf(term);
    let domainIndex = entry.domain.indexOf(term);
    let titleIndex = entry.title.toLowerCase().indexOf(term);

    let index = 30;
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

}