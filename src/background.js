
import Favicons from "./Favicons";
window.Favicons = Favicons;

// import Datasource from "./datasource";
//
// let data = new Datasource();
// data.loadLongtermEntries();
// window.dataSource = data;
//
// browser.runtime.onConnect.addListener(function(port)
// {
//   port.onMessage.addListener(async function({command, search})
//   {
//     if(command == 'load') data.loadLongtermEntries();
//     if(search) {
//       let result = await data.search(search.term, search.options);
//       port.postMessage(result);
//     }
//   })
// });
