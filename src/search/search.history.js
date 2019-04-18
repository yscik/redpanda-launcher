import {days, weightSort} from "../helpers.js";
import {Entry} from "../data/Entry.js";
import {filter} from "./filter.js";

const ageWeight = date => Math.max(0, 30 - days.age(date));

const HistorySearchLimit = [50,50,50,500];

export class SearchHistory
{

  constructor(browsingData)
  {
    this.cache = {term: null, result: null};
    this.data = browsingData;
  }

  async search(term)
  {
    this.setSearchLimit(term);

    let entries;

    if(this.isCacheValidForTerm(term))
    {
      entries = this.getCachedResults(term);
    }
    else
    {
      entries = await this.runSearch(term);
      this.weightResult(entries);
    }

    this.cacheResult(term, entries);

    return Entry.process(entries.slice(0, 15));

  }

  setSearchLimit(term)
  {
    this.searchLimit = 50 // HistorySearchLimit[Math.min(term.length, HistorySearchLimit.length) - 1];
  }

  async runSearch(term)
  {
    const startTime = new Date(Date.now() - days.ms(60));

    return await this.data.searchHistory({text: term, maxResults: this.searchLimit, startTime});
  }

  cacheResult(term, entries)
  {
    this.cache.term = term;
    this.cache.result = entries.length < this.searchLimit ? entries : null;
  }

  isCacheValidForTerm(term)
  {
    return this.cache.result && this.cache.term && term.startsWith(this.cache.term);
  }

  getCachedResults(term)
  {
    if (!this.cache.result.length)
      return [];
    else
      return filter(term, this.cache.result);
  }


  weightResult(entries)
  {
    entries.forEach(e => {
      e.weight = Math.min(60, e.visitCount) + ageWeight(e.lastVisitTime) * 0.3;
      e.age = days.age(e.lastVisitTime)
    });

    entries.sort(weightSort);
  }


}