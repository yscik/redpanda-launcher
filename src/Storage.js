
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
    browser.storage.local.set(sites);

    let engines =
        sites._engines ? JSON.parse(sites._engines) :
        Engines.defaults;

    Engines.addStorage(sites, engines);
    this.icons = sites;


    return this
  }

  async save({settings, engines})
  {

    let data = {'_settings': JSON.stringify(settings),
      '_engines': JSON.stringify(engines)};

    return browser.storage.local.set(data)
  }


};