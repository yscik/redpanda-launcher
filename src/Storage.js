
import Engines from './Engines';
import settings from './settings';

export default new class Storage
{

  constructor()
  {
    this.engines = [];
    this.icons = [];
    this.promise = this.load()
  }

  async load()
  {
    const sites = await browser.storage.local.get() || {};
    browser.storage.local.set(sites);

    let engines =
        //sites._engines ? JSON.parse(sites._engines) :
        Engines.defaults;

    this.engines = Engines.addStorage(sites, engines);
    this.icons = sites;


    return this
  }

  async save()
  {

    let data = {'_settings': JSON.stringify(settings),
      '_engines': JSON.stringify(this.engines)};

    return browser.storage.local.set(data)
  }


};