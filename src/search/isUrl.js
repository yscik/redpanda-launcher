import tld_txt from 'raw-loader!../data/tlds-alpha-by-domain.txt'

const tldInFile = /^[a-zA-Z]/;

const protocol = /^(about:|.*:\/\/)/;
const tlds = tld_txt.split('\n').filter(t => t && tldInFile.test(t)).map(t => t.toLowerCase());

function isUrl(term)
{
  if(!term) return false;
  term = term.trim();
  if(term.includes(' ')) return false;
  if(protocol.test(term)) return true;
  try {
    const {hostname, port} = new URL('http://'+term);
    if(port) return true;
    const tldDot = hostname.lastIndexOf('.');
    if(tldDot < 0) return false;
    let tld = hostname.substr(tldDot+1);
    return tlds.includes(tld)
  }
  catch(err) {
    return false;
  }
}

export { isUrl, protocol}