
import tld_txt from 'raw-loader!./tlds-alpha-by-domain.txt'

const tldInFile = /^[a-zA-Z]/;

const urlPattern = /.+\.(.+)(?:[\/:?#].*)?/;
const tlds = tld_txt.split('\n').filter(t => t && tldInFile.test(t)).map(t => t.toLowerCase());

export default function isUrl(term)
{
  let [,tld] = urlPattern.exec(term)||[];
  return tld && tlds.includes(tld)
}