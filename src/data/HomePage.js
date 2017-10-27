
export class HomePage {

  constructor(browsingData)
  {
    this.data = browsingData;
    this.state = null;
  }

  attach()
  {
    let self = this;
    this.state = {};
    this.updateState();
    return this.state;
  }

  updateState()
  {
    if(!this.state) return;
    this.state.session = this.data.session.slice();
    this.state.topSites = this.data.topSites.slice();
  }

  async update()
  {
    await this.data.loadSession();
    await this.data.loadTopsites();
    this.updateState();
  }
}