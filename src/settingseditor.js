import Storage from './Storage'
import Engines from './Engines'
import settings from "./settings";

const e = document.createElement.bind(document);
const clone = v => JSON.parse(JSON.stringify(v));

export default window.settingseditor = new class SettingsEditor {
  constructor() {

    this.settings = null;
    this.engines = null;

    this.load();

    this.lastAction = {};
  }

  async load() {
    await Storage.promise;

    this.engines = Engines.engines;
    this.settings = settings;
    this.changing = {original: clone(settings)};
    this.defaultEngine = this.engines.find(e => e.url == this.settings.search.defaultEngine) || Engines.defaults[0].url;
  }

  async save() {
    console.log('Saving', clone(this.settings));
    return Storage.save();
  }

  async commit(action)
  {
    await this.save();
    let clear = () => this.lastAction == action && (this.lastAction = {});
    let decay = () => this.lastAction == action && (this.lastAction.fresh = false);

    if(action.undo) {
      let undo = action.undo;
      action.undo = () => {undo(); clear(); this.save();}
    }

    action.active = true;
    if(action.html) {
      let node = action.node = e('span');
      action.html.forEach(item => {
        if(item instanceof Array) {
          let el = e(item[0]);
          el.innerText = item[1];
          node.appendChild(el)
        }
        else node.appendChild(document.createTextNode(item))
      })
    }

    if(action.fresh) setTimeout(decay, 1000);
    // setTimeout(clear, 5000);
    this.lastAction = action;
  }

  change(value, oldvalue)
  {
    if(!oldvalue) return;

    if(this.changing.internal) {
      this.changing.internal = false;
      return;
    }

    if(this.changing.timeout) clearTimeout(this.changing.timeout);
    console.log('Settings changed', this.changing.timeout, this.changing.original.search.opensearch.visits);

    const save_changes = () =>
    {
      console.log('Commiting settings');
      let original = this.changing.original;
      this.changing.original = clone(this.settings);
      console.log('Current', clone(this.settings).search.opensearch.visits, 'Original', original.search.opensearch.visits);

      this.commit({message: 'Settings updated.', fresh: true, icon: 'success',
        undo: () =>
        {
          this.changing.internal = true;
          Object.assign(this.settings, original);
          this.changing.original = clone(this.settings);
          console.log('Undoing');
        }
      });

    };

    this.changing.timeout = setTimeout(save_changes, 1000);

  }

  set_default_engine(engine)
  {
    let previous = this.defaultEngine;
    this.settings.search.defaultEngine = engine.url;
    this.defaultEngine = engine;

    this.changing.internal = true;
    this.commit({html: [['b', engine.title], ' is now the default search engine.'],
      undo: () =>  {
        this.changing.internal = true;
        this.settings.search.defaultEngine = previous.url;
        this.defaultEngine = previous;
    }});
  }

  remove_engine(engine)
  {
    engine.active = false;

    this.commit({html: ['Search engine ', ['b', engine.title], ' removed.'],
      undo: () => engine.active = true});
  }




}