
function deepCopy(target, source)
{
  for(let key in source)
  {
    if(source[key] instanceof Object) {
      if (!target[key]) target[key] = source[key];
      else deepCopy(target[key], source[key]);
    }
    else target[key] = source[key];
  }
}
const builtinEngines = [
  {title: 'Google', url: 'https://google.com/search?q=%s'},
  {title: 'Bing', url: 'https://bing.com/search?q=%s'},
  {title: 'Yahoo', url: 'https://yahoo.com/search?p=%s'},
  {title: 'Wikipedia (en)', url: 'https://en.wikipedia.org/w/index.php?title=Special:Search&search=%s', keyword: 'w'},
  {title: 'Amazon.com', url: 'https://www.amazon.com/s?field-keywords=%s'},
  {title: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s'},
  {title: 'Twitter', url: 'https://twitter.com/search?q=%s'},
];
builtinEngines.forEach(e => {e.active = true; e.type='builtin'});

async function load()
{
  let storage = await browser.storage.local.get('_settings');

  if(storage._settings) try {
    storage = JSON.parse(storage._settings);
    deepCopy(settings, storage);
  }
  catch(err) {
    console.error('Error parsing stored settings', storage)
  }
}

const settings = defaults();
settings.promise = load();
window.settings = settings;

function defaults()
{
  return {
    search: {
      defaultEngine: builtinEngines[0].url,
      opensearch: {
        autoadd: true,
        visits: 4,
      },
      transforms: []
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

export {settings as default, builtinEngines};