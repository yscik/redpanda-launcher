import {settingsService, engines} from "../app/app";
import {clone} from "../helpers";

export default class EngineEditor{
  constructor(settingsEditor) {
    this.settingsEditor = settingsEditor;

    this.engines = settingsEditor.data.engines = clone(engines.engines);
    this.settings = settingsEditor.data.settings;
    this.defaultEngine = engines.default;
  }

  save() {

    engines.set(this.engines);
    settingsService.engines = engines.engines;
  }
  change(...args)
  {
    this.settingsEditor.change(...args)
  }

  commit(action)
  {
    this.save();
    this.settingsEditor.commit(action);
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

    set(engine)

    this.settingsEditor.changing.internal = true;
    this.commit({html: [['b', engine.title], ' set as default search engine.'], favicon: engine,
      undo: () =>  {
        this.settingsEditor.changing.internal = true;
        set(previous);
      }});
  }

  remove_engine(engine)
  {
    engine.active = false;

    this.commit({html: ['Search engine ', ['b', engine.title], ' removed.'],
      undo: () => engine.active = true});
  }




}