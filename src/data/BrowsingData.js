
import {days} from "../helpers";
import {Entry} from "./Entry";

export class BrowsingData
{
  constructor()
  {
    Object.assign(this, {
      tabs: [],
      session: [],
      topSites: [],
      bookmarks: [],
      bookmarks_all: [],
      storage: null,
    });
  }


  load()
  {
    return Promise.all([
      this.loadBookmarks(),
      this.loadSession(),
      this.loadTopsites(),
      this.loadTabs(),
      this.loadStorage()
    ])
  }

  async history(options)
  {
    return browser.history.search(options)
  }

  async loadSession()
  {
    let tabs = await browser.sessions.getRecentlyClosed({maxResults: 15});
    tabs = tabs.map(t => t.tab || t);
    tabs.length = Math.min(tabs.length, 15);
    return this.session = Entry.process(tabs, {props: {source: 'session'}} );

  }

  async loadTopsites()
  {
    let sites = await browser.topSites.get();
    sites.length = Math.min(sites.length, 15);
    return this.topSites = Entry.process(sites, {props: {source: 'topsite'}});

  }

  async loadTabs()
  {
    let tabs = await browser.tabs.query({});
    return this.tabs.set(Entry.process(tabs, {props: {source: 'tab', type: 'tab', weight: 50}}));
  }

  async loadBookmarks()
  {
    const bookmarks = (await browser.bookmarks.search({}));
    this.bookmarks_all = bookmarks;
    this.bookmarks = Entry.process(bookmarks.filter(b => b.type == 'bookmark'), {props: {source: 'bookmark'}, setup: b => b.weight = age(b), reactive: true});

    function age(b)
    {
      return Math.max(5, 30 - days(days.now - b.dateAdded))
    }
  }

  async loadStorage()
  {
    this.storage = await browser.storage.local.get() || {};
  }
}