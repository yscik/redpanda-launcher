
import {AppLogic} from "./AppLogic";
import {attach} from "./state"

let app = null;

async function loadApp()
{
  let background = await browser.runtime.getBackgroundPage();

  if(background && background.app)
    app = background.app;

  else {
    app = new AppLogic();
    await app.fastload();
  }

  attach(app);
  app.update();

  ({search, data, home, engines, bookmarks, settingsService, favicons} = app);
}

let search, data, home, engines, bookmarks, settingsService, favicons;
export {search, data, home, engines, bookmarks, settingsService, favicons};


export {app, loadApp};
