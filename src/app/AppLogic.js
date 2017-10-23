
import {SearchService} from "../search/search.service";
import {BrowsingData} from "../data/BrowsingData";
import {Settings} from "../data/Settings";
import {Engines} from "../data/Engines";
import {Bookmarks} from "../data/Bookmarks";
import {FaviconLoader} from "../entry/Favicons";
import {HomePage} from "../data/HomePage";

export class AppLogic {

  constructor() {

    console.log("Creating AppLogic");

    this.data = new BrowsingData();
    this.engines = new Engines();
    this.search = new SearchService(this.data, this.engines.engines);
    this.home = new HomePage(this.data);
    this.bookmarks = new Bookmarks();
    this.settingsService = new Settings();
    this.favicons = new FaviconLoader(this.data);
  }

  async fastload()
  {
    await this.init();
  }

  attach()
  {
    return {
      search: this.search.attach(),
      home: this.home.attach(),
      settings: this.settingsService.attach()
    };
  }

  async init()
  {

    await this.data.load();

    await this.settingsService.load(this.data.storage);
    this.settingsService.configureServices(this);

    this.engines.setup(this.data, this.settingsService.engines);

    this.bookmarks.init(this.data.bookmarks_all);

    for(let name in this) {
      Object.seal(this[name]);
    }

  }

  async update()
  {
    this.home.update();
  }
}