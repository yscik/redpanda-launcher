<template lang="pug">
.main(@keydown.up="service.select(-1, $event)",
        @keydown.down="service.select(1, $event)",
        @keydown.tab.prevent="service.tab($event)",
        @keydown.enter="service.enter($event)",
        @keydown.delete="service.backspace($event)")
  //.suggestions: .content
    .logo(v-if="!state.term")
    results.result(v-if="!state.home", :entries='state.suggestions')
  .head: .content
    searchbar
  .results: .content
    results.result(v-if="!state.home", :entries='state.result', :selected='state.index')
    .start-page(v-if='state.home')
      .group(v-if="settings.home.recent")
        h3
          icon(type='session')
          span Recent tabs
        results.session-tabs(:entries='state.session')
      .group(v-if='bookmarks')
        h3
          icon(type='bookmark')
          span {{bookmarks.title}}
        results.bookmarks(:entries='bookmarks.children')
      .group
        h3
          icon(type='topsite')
          span Top sites
        results.top-sites(:entries='state.topSites')
</template>
<script>

import SearchService from './searchservice'
import results from './results.vue';
import searchbar from './searchbar.vue';
import Bookmarks from './Bookmarks';
import settings from './settings';

export default {
  data: () => {
    return {
      state: SearchService.state,
      settings: settings
    }
  },
  created: function()
  {
    this.service = SearchService
  },
  components: {results, searchbar},
  computed: {
    bookmarks() {
      return Bookmarks.folders && settings.home.bookmarks.enabled && Bookmarks.folders[settings.home.bookmarks.folder]
    }
  }


}

</script>
<style lang="sass">
@import colors
.panel
  position: relative

.start-page
  display: flex
  .group:first-child .entries
    margin-left: -0.45rem
  .group
    flex: 1 50%
  .group + .group
    margin-left: .5rem
  .entry .source-icon
    display: none

.logo
  background: url('../icons/redpanda-256.png') no-repeat
  background-size: contain
  height: 12rem
  width: 12rem
  margin: auto
</style>