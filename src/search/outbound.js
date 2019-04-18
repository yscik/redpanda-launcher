import {protocol} from './isUrl';

export class Outbound {

  static open(entry, $event)
  {
    switch(entry.type)
    {
      case 'tab':
        browser.windows.update(entry.windowId, {active: true});
        browser.tabs.update(entry.id, {focused: true});
        break;
      default:
        ($event && $event.ctrlKey ? browser.tabs.create : browser.tabs.update)({url: entry.url})
    }

  }

  static search(term, engine)
  {
    Outbound.open({url: Outbound.prepareSearch(term, engine)})
  }

  // static transformSearch(term) {
  //   settings.search.transforms.forEach(trans => term.includes(trans.pattern) && (term += ' ' + trans.append));
  //
  //   return term;
  // }

  static prepareSearch(term, engine) {
    // term = Outbound.transformSearch(term);
    const url = engine.url.replace(/(%s|{searchTerms})/, encodeURIComponent(term));
    return url;
  }

  static formatUrl(term) {
    if (protocol.test(term)) return term;

    else return 'http://' + term;
  }

}