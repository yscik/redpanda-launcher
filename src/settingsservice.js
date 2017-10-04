import Storage from './Storage'
import Engines from './Engines'


export default window.settings = new class Settings {
  constructor() {

    this.settings = null;
    this.engines = null;

    this.load();

    this.lastAction = {};
  }

  async load() {
    await Storage.promise;

    this.engines = Engines.engines;
    this.settings = Storage.settings = Object.assign(Settings.schema(), Storage.settings);
    this.defaultEngine = this.engines.find(e => e.url == this.settings.search.defaultEngine);
  }

  async save() {
    return Storage.save();
  }

  async commit(action)
  {
    await this.save();
    let clear = () => this.lastAction == action && (this.lastAction = {});

    if(action.undo) {
      let undo = action.undo;
      action.undo = () => {undo(); clear()}
    }
    setTimeout(clear, 5000);
    this.lastAction = action;
  }

  set_default_engine(engine)
  {
    let previous = this.defaultEngine;
    this.settings.search.defaultEngine = engine.url;
    this.defaultEngine = engine;

    this.commit({message: `${engine.title} is now the default search engine.`,
      undo: () =>  {
        this.settings.search.defaultEngine = previous.url;
        this.defaultEngine = previous;
    }});
  }

  remove_engine(engine)
  {
    engine.active = false;

    this.commit({message: `${engine.title} removed.`, undo: () => engine.active = true});
  }

  static schema()
  {
    return {
      search: {
        defaultEngine: Engines.engines[Engines.engines.length-1].url,
        opensearch: {
          autoadd: true,
          visits: 4,
        }
      },
      data: {
        history: {
          days: 30,
          autoextend: false
        }
      },
      topSites: {
        source: 'topSites'
      },
      autocomplete: {
        url: true,
        selected: true,
      }
    }
  }


}