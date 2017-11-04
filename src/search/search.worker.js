import {days} from "../helpers";

export class SearchWorker
{
  constructor(browsingData)
  {
    this.worker = new Worker("search.backend.worker.js");
    this.data = browsingData;

    this.worker.onmessage = ({data}) => this.onResult && this.onResult(data);
  }

  async updateData()
  {
    const startTime = this.lastUpdate || new Date(Date.now() - days.ms(60));
    this.lastUpdate = Date.now();
    let history = await this.data.loadHistory({text: "", startTime, maxResults: Number.MAX_SAFE_INTEGER});
    console.log("Adding", history.length, "history entries");
    this.worker.postMessage({type: "data", data: this.data, history})
  }

  search(term, options)
  {
    this.worker.postMessage({type: "search", term, options})
  }

}