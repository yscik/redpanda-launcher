
let key, result;

try {
  if(!browser.extension.inIncognitoContext)
    parse_site();
}
catch(err) {
  console.error("[Red Panda Launcher]", err);
}

async function parse_site()
{
  key = new URL(location.href).origin;
  result = (await browser.storage.local.get(key))[key] || {parsed: Date.now(), count: 0, counting: true, reparse: false};
  if(!result.counting && !result.reparse) return;
  result.count = 1 + (result.count||0);

  await check_opensearch();

  set_favicon();

  browser.storage.local.set({[key]: result});

}

function set_favicon()
{
  if(result.favicon && !result.reparse) return;

  const faviconNode = document.querySelector("link[rel='shortcut icon'], link[rel='icon']");
  if(faviconNode) {
    console.log("Favicon: ", faviconNode.href);
    result.favicon = faviconNode.href;

  }
}

async function check_opensearch()
{
  if(result.opensearch && !result.reparse) return;

  const node = document.querySelector("link[rel='search'][type='application/opensearchdescription+xml']");
  if(!node) return;
  try {
    const body = await (await fetch(node.href)).text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(body, "application/xml");
    const x = (s) => { let el = xml.querySelector(s); return el ? el.textContent : ""};

    const url = xml.querySelector('Url[type="text/html"]');
    const params = Array.from(url.querySelectorAll('Param'));
    
    result.opensearch = {
      title: x("ShortName"),
      desc: x("Description"),
      icon: x("Image"),
      url: [url.getAttribute('template'),
        params.length ? '?'+params.map(p => [p.getAttribute('name'), p.getAttribute('value')].join('=')).join('&') : ''].join('')
    };

    console.log("Opensearch: ", result.opensearch.title, result.opensearch.url);

  }
  catch(err) {
    console.error("[Red Panda Launcher]", 'opensearch', err);
  }

}