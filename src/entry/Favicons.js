
export const defaultIcon = require('!!url-loader!../../icons/globe.png');

const fetch_options = {method: 'GET', cache: 'force-cache', credentials: 'omit', redirect: 'manual',
  headers: {Accept: 'image/*'}};

export class FaviconLoader
{
  constructor(browsingData)
  {
    this.data = browsingData;
    this.cache = {};
  }

  getUrl(site) {
    if (!site || !site.protocol || !site.protocol.startsWith('http')) return defaultIcon;
    return site && (this.data.storage[site.origin] && this.data.storage[site.origin].favicon) || `${site.origin}/favicon.ico`;
  }

  getFromCache(site)
  {
    let url = this.getUrl(site);
    if(this.cache[url] && !this.cache[url].then) return this.cache[url];
  }

  async load(site)
  {
    let url = this.getUrl(site);
    if(!this.cache[url]) this.cache[url] = this.fetch(url);
    return this.cache[url].then ? (this.cache[url] = await this.cache[url]) : this.cache[url];
  }

  async fetch(url)
  {
    try {
      const response = await fetch(url, fetch_options);
      return response.status == 200 ? URL.createObjectURL(await response.blob()) : defaultIcon;
    }
    catch(err)
    {
      return defaultIcon;
    }

  }

}