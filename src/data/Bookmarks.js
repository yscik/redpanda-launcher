export default window.bookmarks = new class Bookmarks
{
  constructor()
  {
    this.folders = [];
  }
  async init(rawData)
  {
    let folders = rawData.filter(b => b.type == "folder");

    this.folders = folders.reduce((map, folder) => {
      map[folder.id] = folder;
      folder.children = rawData.filter(b => b.parentId == folder.id);
      return map;
    }, {});

    let byIndex = (a,b) => a.index - b.index;
    this.toolbar = folders.find(f => f.id.startsWith('toolbar_'));
    this.toolbar.children.sort(byIndex);
    this.toolbar.children.forEach(t => flatten(t));

    function flatten(parent)
    {
      let entries = parent.children;
      if(!entries) return;
      entries.sort(byIndex);
      entries.forEach((entry, index) => {
        entry.level = (parent.level||0) + 1;
        if(entry.type == "folder") {
          flatten(entry);
          entries.splice(index+1, 0, ...entry.children)
        }
      })
    }
  }


}