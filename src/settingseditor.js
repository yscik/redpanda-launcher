import Storage from './Storage'
import Engines from './Engines'
import settings from "./settings";

const e = document.createElement.bind(document);
const clone = v => JSON.parse(JSON.stringify(v));

export default class SettingsEditor {
  constructor() {

    this.lastAction = {};

    this.engines = Engines.engines;
    this.settings = settings;
    this.data = {settings, engines: this.engines};
    this.changing = {original: clone(this.data)};
    this.defaultEngine = Engines.updateDefault();
  }

  async save() {
    console.log('Saving', clone(this.settings));
    return Storage.save(this.data);
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
    setTimeout(clear, 5000);
    this.lastAction = action;
  }

  change(value, oldvalue)
  {
    if(!oldvalue) return;
    console.log('Change', value);

    if(this.changing.internal) {
      this.changing.internal = false;
      return;
    }

    if(this.changing.timeout) clearTimeout(this.changing.timeout);

    const save_changes = () =>
    {
      let original = this.changing.original;
      this.changing.original = clone(this.data);

      this.commit({message: 'Settings updated.', fresh: true, icon: 'success',
        undo: () =>
        {
          this.changing.internal = true;
          Object.assign(this.data.settings, original.settings);
          this.changing.original = clone(this.data);
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
    this.defaultEngine = Engines.updateDefault();

    this.changing.internal = true;
    this.commit({html: [['b', engine.title], ' set as default search engine.'], favicon: engine,
      undo: () =>  {
        this.changing.internal = true;
        this.settings.search.defaultEngine = previous.url;
        this.defaultEngine = Engines.updateDefault();
    }});
  }

  remove_engine(engine)
  {
    engine.active = false;

    this.commit({html: ['Search engine ', ['b', engine.title], ' removed.'],
      undo: () => engine.active = true});
  }




}