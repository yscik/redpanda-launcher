export class Entry
{

  static process(entries, {copy = false, props = null, setup = null, reactive = false, constructor = null} = {})
  {
    return entries && entries.reduce((result,entrydata) =>
    {
      let entry = copy ? Object.assign({}, entrydata, props) : props ? Object.assign(entrydata, props) : entrydata;
      try {
        if(entry.url.startsWith('moz-extension://')) return result;

        entry.url = entry.url.replace(/^\/\//, 'https://');
        let urlo = new URL(entry.url);
        entry.domain = urlo.hostname.replace(/^www\./, '');
        entry.origin = urlo.origin;
        entry.protocol = urlo.protocol;
        entry.pathname = urlo.pathname;

        if(setup) setup(entry);
        if(constructor) entry = new constructor(entry);
        if(!reactive) Object.seal(entry);
        result.push(entry);
      }
      catch (e) {
        // Invalid entry, discarded
      }

      return result;
    }, []) || []
  }

}