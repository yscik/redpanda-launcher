import {clone, deepCopy, strictDeepCopy} from "../helpers";
import schema from './settings.schema'

const storageKey = '_settings';

function parseIfJson(data) {
  if (data instanceof Object || data == null) return data;
  else return JSON.parse(data);
}

export class Settings {

  constructor()
  {
    this.state = null;
    this.settings = Settings.defaults();
  }

  async load(storage) {

    let settings = storage[storageKey] = parseIfJson(storage[storageKey]);

    if (settings && settings.sync)
    {
      storage = await browser.storage.sync.get();

      settings = storage[storageKey] = parseIfJson(storage[storageKey]);
    }

    deepCopy(this.settings, settings);

    // this.engines = Array.from(Settings.readEngines(storage));
  }


  attach()
  {
    return this.state = clone(this.settings);
  }

  applyChanges()
  {
    strictDeepCopy(this.settings, this.state);
  }

  configureServices(services)
  {
    ['engines', 'data', 'home'].forEach(name =>
        services[name].settings = this.settings[name])
  }

  async save()
  {

    if (!this.settings.sync) {
      browser.storage.sync.set({[storageKey]: {sync: false}});
    }
    else {
      browser.storage.local.set({[storageKey]: {sync: true}});
    }

    let type = this.settings.sync ? 'sync' : 'local';

    browser.storage[type].set({[storageKey]: this.settings});
  }


  static defaults() {
    return schema();
  }

}