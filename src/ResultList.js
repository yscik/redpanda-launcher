
import Entry from './Entry'

export default class ResultList
{
  constructor() {
    this.data = [];
  }

  set(entries)
  {
    this.data.length = 0;
    this.data.push(...entries.map(Entry.wrap));

  }

}