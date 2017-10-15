
import Engines from './Engines';
import settings from './settings';

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

    let engines =
        sites._engines ? JSON.parse(sites._engines) :
        Engines.defaults;

    Engines.addStorage(sites, engines);
    this.icons = sites;


    return this
  }

};