<template lang="pug">
.home-page
  .group.home-session(v-if="settings.recent")
    h3
      icon(type='session')
      span Recent tabs
    results.session-tabs(:entries='entries.session')
  .group.home-bookmarks(v-if='bookmarks')
    h3
      icon(type='bookmark')
      span {{bookmarks.title}}
    results.bookmarks(:entries='bookmarks.children')
  .group.home-topsites
    h3
      icon(type='topsite')
      span Top sites
    results.top-sites(:entries='entries.topSites')
</template>
<script>

  import {bookmarks, home} from '../app/app';
  import {settings} from '../app/state';

  export default {
    data: () => ({
      settings: settings.home,
      entries: home.state
    }),
    computed: {
      bookmarks() {
        return bookmarks.folders && settings.home.bookmarks.enabled && bookmarks.folders[settings.home.bookmarks.folder]
      }
    }

  }
</script>

<style lang="sass">

.home-page
  display: flex
  .group:first-child .entries
    margin-left: -0.45rem
  .group
    flex: 1 50%
  .group + .group
    margin-left: .5rem
  .entry .source-icon
    display: none


</style>