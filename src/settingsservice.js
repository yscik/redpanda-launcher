import Storage from './Storage'
import Engines from './Engines'


export default new class Settings {
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

  remove_engine(engine)
  {
    engine.active = false;

    this.commit({message: `${engine.title} removed.`, undo: () => engine.active = true});
  }

  static schema()
  {
    return {
      search: {
        defaultEngine: Engines.engines[Engines.engines.length-1],
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