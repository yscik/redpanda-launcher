
import {AppLogic} from "./AppLogic";
import {attach} from "./state"

let app = null;

async function loadApp()
{
  let background = await browser.runtime.getBackgroundPage();

  if(background && background.app) {
    app = background.app;
    app.update();
  }

  else {
    app = new AppLogic();
    await app.fastload();
  }

  attach(app);

  ({data, home, engines, bookmarks, settingsService, favicons} = app);
}

let data, home, engines, bookmarks, settingsService, favicons;
export {data, home, engines, bookmarks, settingsService, favicons};


export {app, loadApp};
