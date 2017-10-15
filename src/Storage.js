
import Engines from './Engines';
import settings from './settings';

const enginesKey = '_engines';

export default new class Storage
{

  constructor()
  {
    this.icons = [];
    this.promise = this.load()
  }

  async load()
  {
    const sites = await browser.storage.local.get() || {};

    this.icons = sites;

    let engines = (!settings.sync ? sites[enginesKey] : (await browser.storage.sync.get(enginesKey))[enginesKey]);

    Engines.addStorage(sites, engines ? JSON.parse(engines) : Engines.defaults);

    return this
  }

};