export default function () {
  return {
    sync: false,
    focusHack: true,
    nightmode: false,
    engines: {
      defaultEngine: null,
      opensearch: {
        discover: true,
        activate: true,
        visits: 5
      },
      transforms: [],
      config: {}
    },
    data: {
      history: {
        days: 30,
        autoextend: false
      }
    },
    search: {
      autocomplete: {
        url: true,
        selected: true,
      }
    },
    home: {
      bookmarks: {
        enabled: false,
        folder: null,
      },
      bookmarkstoolbar: {
        enabled: false,
        icons: false
      },
      recent: true,
      topSites: {
        source: 'topSites'
      },
      urls: true
    }
  }
}