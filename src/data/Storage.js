
import Engines from './data/Engines';
import {default as settings, readEngines} from './settings';

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

    await settings.promise;

    let engines = !settings.sync ? sites : (await browser.storage.sync.get());
    Engines.addConfigured(engines);

    Engines.addDiscovered(sites);

    return this
  }

};