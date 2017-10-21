<template lang="pug">
.app(@mousedown="clearOverlays()")
  BookmarksToolbar(v-if='settings.home.bookmarkstoolbar.enabled')
  .body
    Settings
    Search
</template>
<script>

import Search from './Search.vue'
import Settings from './Settings.vue'
import settings from './settings'
import BookmarksToolbar from './BookmarksToolbar.vue';
import bookmarksToolbarState from './bookmarkstoolbar-state';

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
  @import colors
  @import style
  @import layout

</style>