
function consoleLog(method, ...args) { (console[method])('[Red Panda Launcher]', ...args) }

const log = consoleLog.bind(null, 'debug');
log.error = consoleLog.bind(null, 'error');

class storage
{
  static async get(key) {
    return (await browser.storage.local.get(key))[key];
  }
  static async save(key, data) {
    return browser.storage.local.set({[key]: data});
  }
}

try
{
  if(!browser.extension.inIncognitoContext)
    processSite();
}
catch(err) {
  log.error(err);
}

async function processSite()
{
  updateFavicon();

  discoverOpensearch();
}

async function updateFavicon()
{
  const siteKey = new URL(location.href).origin;

  const siteInfo = await storage.get(siteKey);

  let faviconUrl = getFaviconUrl();

  if(!siteInfo.favicon || location.pathname == '/')
    siteInfo.favicon = faviconUrl;

  else if(siteInfo.favicon != faviconUrl && siteInfo[location.pathname] != faviconUrl)
  {
    siteInfo[location.pathname] = faviconUrl;
    log("custom path icon", location.pathname, faviconUrl, siteInfo.favicon)
  }

  else return;

  storage.save(siteKey, siteInfo);

}

function getFaviconUrl()
{
  const faviconNode = document.querySelector("link[rel='shortcut icon'], link[rel='icon']");
  if(faviconNode) {
    log("Favicon: ", faviconNode.href);
    return faviconNode.href;
  }

}

async function discoverOpensearch()
{
  const linkNode = document.querySelector("link[rel='search'][type='application/opensearchdescription+xml']");
  if(!linkNode) return;

  const engineConfigUrl = linkNode.href;

  const savedConfig = await storage.get(engineConfigUrl);

  if(savedConfig) return;

  try
  {
    const descriptorXml = await fetchContent(engineConfigUrl);
    const engineData = parseOpensearchXml(descriptorXml);
    
    storage.save(engineConfigUrl, {opensearch: engineData});

    log("Opensearch: ", engineData.title, engineData.url);

  }
  catch(err) {
    log.error('Opensearch', err);
  }

}

async function fetchContent(url)
{
  return (await fetch(url)).text();
}

function formatSearchUrl(urlNode)
{
  const params = Array.from(urlNode.querySelectorAll('Param'));

  return '' + urlNode.getAttribute('template') + convertToQueryString(params);

  function convertToQueryString(params)
  {
    if(!params.length) return '';
    return  '?' + params.map(p => [p.getAttribute('name'), p.getAttribute('value')].join('=')).join('&');
  }

}

function parseOpensearchXml(configXml)
{
  const parser = new DOMParser();
  const xml = parser.parseFromString(configXml, "application/xml");

  const textOf = (s) =>
  {
    let el = xml.querySelector(s);
    return el ? el.textContent : ""
  };

  const url = xml.querySelector('Url[type="text/html"]');

  return {
    title: textOf("ShortName"),
    desc: textOf("Description"),
    icon: textOf("Image"),
    url: formatSearchUrl(url)
  };
}