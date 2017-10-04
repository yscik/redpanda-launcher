
import Engines from './Engines';

export default new class Storage {

  constructor()
  {
    this.engines = [];
    this.icons = [];
    this.promise = this.load()
  }

  async load()
  {
    const storage = await browser.storage.local.get() || {};

    this.settings = storage._settings && JSON.parse(storage._settings) || {};

    let engines = Engines.default;

    this.engines = Engines.addStorage(storage, engines);
    this.icons = storage;

    return this
  }

  async save()
  {

    let data = {'_settings': JSON.stringify(this.settings),
      '_engines': JSON.stringify(this.engines)};

    return browser.storage.local.set(data)
  }


};