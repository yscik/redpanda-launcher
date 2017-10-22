<template lang="pug">
.app(@mousedown="clearOverlays()")
  BookmarksToolbar(v-if='settings.home.bookmarkstoolbar.enabled')
  .body
    Settings
    Search
</template>
<script>

import Search from './Search.vue'
import Settings from './settings/Settings.vue'
import settings from './data/settings'
import BookmarksToolbar from './bookmarks-toolbar/BookmarksToolbar.vue';
import bookmarksToolbarState from './bookmarks-toolbar/bookmarkstoolbar-state';

export default {
  name: 'App',
  data: () => ({settings}),
  components: { Search, Settings, BookmarksToolbar },
  methods: {
    clearOverlays() {
      bookmarksToolbarState.folder = null
    }
  }
}

</script>
<style lang="sass">
  @import layout
  @import style

</style>