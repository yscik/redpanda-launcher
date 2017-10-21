<template lang="pug">
.app
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

export default {
  name: 'App',
  data: () => ({settings}),
  components: { Search, Settings, BookmarksToolbar }
}

</script>
<style lang="sass">
  @import colors
  @import style
  @import layout

</style>