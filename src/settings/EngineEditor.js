import {settingsService, engines} from "../app/app";
import {clone} from "../helpers";
import SettingsEditor from './settingseditor';

export default class EngineSettingsEditor extends SettingsEditor {
  constructor() {
    super();

    this.data.engines = clone(engines.engines);
    this.defaultEngine = engines.default;
  }

  async save() {
    engines.set(this.data.engines);
    settingsService.engines = engines.engines;
    await super.save();

  }

  set_default_engine(engine)
  {
    let previous = this.defaultEngine;
    let set = (engine) => {
      this.settings.engines.defaultEngine = engine.url;
      settingsService.applyChanges();
      this.defaultEngine = engine;
      engines.updateDefault();
    };

    set(engine);

    this.settingsEditor.changing.internal = true;
    this.commit({html: [['b', engine.title], ' set as default search engine.'], favicon: engine,
      undo: () =>  {
        this.settingsEditor.changing.internal = true;
        set(previous);
      }});
  }

  remove_engine(engine)
  {
    engine.active = engine.pending = false;

    this.commit({html: ['Search engine ', ['b', engine.title], ' removed.'],
      undo: () => engine.active = true});
  }

  enable_engine(engine)
  {
    engine.active = true;
    engine.pending = false;

    this.commit({html: ['Search engine ', ['b', engine.title], ' enabled.'],
      undo: () => {
        engine.active = false;
        engine.pending = true;
      }});
  }




}