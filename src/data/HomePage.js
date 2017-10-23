
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
    this._updateState();
    return this.state;
  }

  _updateState()
  {
    this.state.session = this.data.session.slice();
    this.state.topSites = this.data.topSites.slice();
  }

  async update()
  {
    await this.data.loadSession();
    await this.data.loadTopsites();
    this._updateState();

  }
}