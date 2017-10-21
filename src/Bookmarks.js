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

    this.toolbar = folders.find(f => f.id.startsWith('toolbar_'));
    this.toolbar.children.sort((a,b) => a.index - b.index)
  }


}