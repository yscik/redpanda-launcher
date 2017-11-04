
import {BrowsingData} from "../data/BrowsingData";
import {Settings} from "../data/Settings";
import {Engines} from "../data/Engines";
import {Bookmarks} from "../data/Bookmarks";
import {FaviconLoader} from "../entry/Favicons";
import {HomePage} from "../data/HomePage";
import {SearchWorker} from "../search/search.worker";

export class AppLogic {

  constructor() {

    console.log("Creating AppLogic");

    this.data = new BrowsingData();
    this.engines = new Engines();
    this.home = new HomePage(this.data);
    this.bookmarks = new Bookmarks();
    this.settingsService = new Settings();
    this.favicons = new FaviconLoader(this.data);
    this.backend = new SearchWorker(this.data);
  }

  async fastload()
  {
    await this.init();
  }

  attach()
  {
    return {
      home: this.home.attach(),
      settings: this.settingsService.attach()
    };
  }

  async init()
  {
    this.settingsService.configureServices(this);
    await this.update();

    // for(let name in this) {
    //   Object.seal(this[name]);
    // }

  }

  async update()
  {
    await this.data.load();

    this.backend.updateData();
    await this.settingsService.load(this.data.storage);

    this.bookmarks.init(this.data.bookmarks_all);
    this.engines.setup(this.data, this.settingsService.engines);

    this.home.updateState();


  }
}