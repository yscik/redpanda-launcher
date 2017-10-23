export class Entry
{

  static process(entries, {copy = false, props = null, setup = null, reactive = false} = {})
  {
    return entries.reduce((result,entrydata) =>
    {
      let entry = copy ? Object.assign({}, entrydata, props) : props ? Object.assign(entrydata, props) : entrydata;
      try {
        if(entry.url.startsWith('moz-extension://')) return result;

        entry.url = entry.url.replace(/^\/\//, 'https://');
        let urlo = new URL(entry.url);
        entry.domain = urlo.hostname.replace(/^www\./, '');
        entry.origin = urlo.origin;
        entry.protocol = urlo.protocol;

        result.push(entry);
        entry.selected = false;
        if(setup) setup(entry);
        if(!reactive) Object.seal(entry);
      }
      catch (e) {
        // Invalid entry, discarded
      }

      return result;
    }, [])
  }

}