import {settingsService, engines} from "../app/app";
import {clone} from "../helpers";


export default class SettingsEditor {
  constructor(state) {

    this.state = state || {};

    this.data = {settings: settingsService.state, engines: engines.engines};
    this.changing = {original: clone(this.data)};
    this.defaultEngine = engines.default;
  }

  async save() {

    this.state.changes = 'saving';
    await settingsService.save();
    this.state.changes = 'saved';
  }

  async commit(action)
  {
    await this.save();

    if(action.undo) {
      let undo = action.undo;
      action.undo = async () => {
        undo();
        await this.save();
        this.state.changes = 'undid';
      }
    }

    this.state.lastAction = action;
  }

  change(value, oldvalue)
  {
    if(!oldvalue) return;

    this.state.changes = 'dirty';
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