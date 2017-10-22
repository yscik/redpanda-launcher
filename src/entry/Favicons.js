
import Storage from '../data/Storage'

const defaultIcon = require('!!url-loader!../../icons/globe.png');

const fetch_options = {method: 'GET', cache: 'force-cache', credentials: 'omit', redirect: 'manual',
  headers: {Accept: 'image/*'}};

export default new class FaviconService
{
  constructor()
  {
    this.icons = {};
  }

  async get(site)
  {
    if(!site || !site.protocol || !site.protocol.startsWith('http')) return defaultIcon;
    const url = site && (Storage.icons[site.origin] && Storage.icons[site.origin].favicon) || `${site.origin}/favicon.ico`;

    if(!this.icons[url]) this.icons[url] = this.fetch(url);
    return await this.icons[url];

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