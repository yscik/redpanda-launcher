
import {SearchBackend} from "./search.backend";

class SearchWorkerBackend extends SearchBackend
{
  constructor()
  {
    super(null);
    self.onmessage = this.onmessage.bind(this);
  }

  async onmessage({data})
  {
    let {type} = data;
    this['on'+type](data);
  }

  async onsearch({term, options})
  {
    this.search(term, options);
  }

  onresult(result)
  {
    result && self.postMessage(result);
  }

  ondata({data, history})
  {
    this.data = data;
    if (!this.history) this.history = history;
    else Array.prototype.push.apply(this.history, history);
  }
}

new SearchWorkerBackend();
