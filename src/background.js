
import Datasource from "./datasource";

console.log("Running background page");

let data = new Datasource();
data.loadLongtermEntries().then(()=> console.log(data.bookmarks));


browser.runtime.onConnect.addListener(function(port)
{
  port.onMessage.addListener(async function(message)
  {
    let result = await data.search(message.term, message.options);

    console.log(JSON.stringify(result));
    port.postMessage(result);
    console.log('Sent result');
  })
});
