import {settingsService, engines} from "../app/app";
import {clone} from "../helpers";

const e = document.createElement.bind(document);

export default class SettingsEditor {
  constructor() {

    this.lastAction = {};

    this.engines = settingsService.state.engines;
    this.settings = settingsService.state.settings;
    this.data = settingsService.state;
    this.changing = {original: clone(this.data)};
    this.defaultEngine = engines.default;
  }

  async save() {
    return settingsService.save();
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

    settingsService.applyChanges();

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
        }
      });

    };

    this.changing.timeout = setTimeout(save_changes, 1000);

  }

  set_default_engine(engine)
  {
    let previous = this.defaultEngine;
    this.settings.search.defaultEngine = engine.url;
    this.defaultEngine = engines.updateDefault();

    this.changing.internal = true;
    this.commit({html: [['b', engine.title], ' set as default search engine.'], favicon: engine,
      undo: () =>  {
        this.changing.internal = true;
        this.settings.search.defaultEngine = previous.url;
        this.defaultEngine = engines.updateDefault();
    }});
  }

  remove_engine(engine)
  {
    engine.active = false;

    this.commit({html: ['Search engine ', ['b', engine.title], ' removed.'],
      undo: () => engine.active = true});
  }




}