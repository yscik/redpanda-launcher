export default window.bookmarks = new class Bookmarks
{
  constructor()
  {
    this.folders = [];
  }
  async init(rawData)
  {
    this.folders = rawData.filter(b => b.type == "folder").reduce((map, folder) => {
      map[folder.id] = folder;
      folder.children = rawData.filter(b => b.parentId == folder.id)
      return map;
    }, {});
  }

}