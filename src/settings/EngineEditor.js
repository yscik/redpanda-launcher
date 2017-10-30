import {settingsService, engines} from "../app/app";
import {clone} from "../helpers";
import SettingsEditor from './settingseditor';

export default class EngineSettingsEditor extends SettingsEditor {
  constructor() {
    super();

    this.engines = engines.engines.map(e => this.wrap(e));
    this.defaultEngine = engines.default;
    this.config = this.data.settings.engines.config;
  }

  wrap(engine)
  {
    return new Proxy(engine, {
      get: (target, name) => {
        return name == 'config' ? this.config[target.id] : target[name]
      }
    })
  }

  set_default(engine)
  {
    let previous = this.defaultEngine;
    let set = (engine) => {
      this.data.settings.engines.defaultEngine = engine.url;
      settingsService.applyChanges();
      this.defaultEngine = engine;
      engines.updateDefault();
    };

    set(engine);

    this.changing.internal = true;
    this.commit({html: [['b', engine.title], ' set as default search engine.'], favicon: engine,
      undo: () =>  {
        this.changing.internal = true;
        set(previous);
      }});
  }

  remove(engine)
  {
    let pending = engine.config.pending;
    engine.config.active = engine.config.pending = false;

    this.commit({html: ['Search engine ', ['b', engine.title], ' removed.'],
      undo: () => {
        engine.config.active = true;
        engine.config.pending = pending
    }});
  }

  enable(engine)
  {
    engine.config.pending = false;
    engine.config.active = true;

    engines.save(engine);

    // settingsService.change({engine: engine});

    this.commit({html: ['Search engine ', ['b', engine.title], ' enabled.'],
      undo: () => {
        engine.config.pending = true;
        engine.config.active = false;
      }});
  }



}