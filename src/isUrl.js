
import tld_txt from 'raw-loader!./tlds-alpha-by-domain.txt'

const tldInFile = /^[a-zA-Z]/;

const protocol = /^(about:|.*:\/\/)/;
const urlPattern = /.+\.(\w+)(?:[\/:?#]*)?/;
const tlds = tld_txt.split('\n').filter(t => t && tldInFile.test(t)).map(t => t.toLowerCase());

function isUrl(term)
{
  if(!term || term.includes(' ')) return false;
  if(protocol.test(term)) return true;
  let [,tld] = urlPattern.exec(term)||[];
  return tld && tlds.includes(tld)
};

export { isUrl, protocol}