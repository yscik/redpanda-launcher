
let key, result;

try {
  find_searchengine();
}
catch(err) {
  console.error("[Red Panda Launcher]", err);
}


async function find_searchengine()
{
  key = new URL(location.href).origin;
  result = {parsed: Date.now()};

  // if(await already_stored()) return;

  await check_opensearch();

  set_favicon();

  browser.storage.local.set({[key]: result});

}

async function already_stored()
{
  const current = await browser.storage.local.get(key);
  return !!current[key] //&& current[key].parsed > TIME_BETWEEN_PARSES;
}

function set_favicon()
{
  const faviconNode = document.querySelector("link[rel='shortcut icon'], link[rel='icon']");
  if(faviconNode) {
    console.log("Favicon: ", faviconNode.href);
    result.favicon = faviconNode.href;

  }
}

async function check_opensearch()
{
  const node = document.querySelector("link[rel='search'][type='application/opensearchdescription+xml']");
  if(!node) return;
  try {
    const body = await (await fetch(node.href)).text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(body, "application/xml");
    const x = (s) => { let el = xml.querySelector(s); return el ? el.textContent : ""};

    result.opensearch = {
      title: x("ShortName"),
      desc: x("Description"),
      icon: x("Image"),
      url: xml.querySelector('Url[type="text/html"]').getAttribute('template')
    }

    console.log("Opensearch: ", result.opensearch.title, result.opensearch.url);

  }
  catch(err) {
    console.error("[Red Panda Launcher]", 'opensearch', err);
  }

}