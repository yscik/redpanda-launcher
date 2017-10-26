import {clone, strictDeepCopy} from "../helpers";
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
  }
  async load(storage) {

    let settings = storage[storageKey] = parseIfJson(storage[storageKey]);

    if (settings && settings.sync)
    {
      storage = await browser.storage.sync.get();
      settings = storage[storageKey] = parseIfJson(storage[storageKey]);
    }

    this.settings = strictDeepCopy(Settings.defaults(), settings);
    this.engines = Array.from(Settings.readEngines(storage));

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
    ['engines', 'data', 'search', 'home'].forEach(name =>
        services[name].settings = this.settings[name])
  }

  async save()
  {


    if (!this.settings.sync) {
      browser.storage.sync.set({[storageKey]: {sync: false}});
    }
    let type = this.settings.sync ? 'sync' : 'local';
    let data = Settings.sliceEngines(this.engines);
    data[storageKey] = JSON.stringify(this.settings);
    browser.storage[type].set(data);
  }

  static sliceEngines(items) {
    let result = {};
    items = items.slice();
    let index = 1;
    while (items.length)
      result[`_engines_${index++}`] = JSON.stringify(items.splice(0, 10).map(Settings.stripEngine));

    return result;
  }

  static stripEngine({url, keyword, title, type, active}) { return {url, keyword, title, type, active}};

  static *readEngines(all) {
    let index = 1, e;
    while (e = all[`_engines_${index++}`]) yield* (e && JSON.parse(e) || []);
  }

  static defaults() {
    return schema();
  }

}