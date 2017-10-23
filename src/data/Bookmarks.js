export class Bookmarks
{
  constructor()
  {
    this.folders = [];
    this.toolbar = null;
  }

  init(rawData) {
    let folders = rawData.filter(b => b.type == "folder");

    this.folders = Object.seal(folders.reduce((map, folder) => {
      map[folder.id] = folder;
      folder.children = rawData.filter(b => b.parentId == folder.id);
      return map;
    }, {}));

    this.setupToolbar(folders);
  }

  setupToolbar(folders)
  {

    let byIndex = (a,b) => a.index - b.index;
    this.toolbar = folders.find(f => f.id.startsWith('toolbar_'));
    this.toolbar.children.sort(byIndex);
    this.toolbar.children.forEach(flattenFolder);

    Object.seal(this.toolbar);

    function flattenFolder(folder)
    {

      Object.seal(folder);
      let entries = folder.children;
      if(!entries) return;
      entries.sort(byIndex);
      entries.forEach((entry, index) => {
        entry.level = (folder.level||0) + 1;
        if(entry.type == "folder") {
          flattenFolder(entry);
          entries.splice(index+1, 0, ...entry.children)
        }
      })
    }
  }

}