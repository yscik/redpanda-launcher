<template lang="pug">
.app(@mousedown="rootClick()")
  BookmarksToolbar(v-if='settings.home.bookmarkstoolbar.enabled')
  .body
    Settings
    .main(@keydown.up="service.select(-1, $event)",
          @keydown.down="service.select(1, $event)",
          @keydown.tab.prevent="service.tab($event)",
          @keydown.enter="service.enter($event)",
          @keydown.delete="service.backspace($event)")
      //.suggestions: .content
        .logo(v-if="!state.term")
        results.result(v-if="!state.home", :entries='state.suggestions')
      .head: .content
        Searchbar
      .results: .content
        results.result(v-if="!state.home", :entries='state.result', :selected='state.index')
        Homepage(v-if='state.home')
</template>
<script>

import Searchbar from '../search/searchbar.vue';
import Homepage from './Homepage.vue';
import Settings from '../settings/Settings.vue'
import BookmarksToolbar from '../bookmarks-toolbar/BookmarksToolbar.vue';
import {search as searchService} from './app'
import {search, settings} from './state'
import {radio} from './radio'

export default
{
  name: 'SearchApp',
  data: () => {
    return {
      settings,
      state: search,
    }
  },
  created: function()
  {
    this.service = searchService
  },
  components: {Searchbar, Homepage, Settings, BookmarksToolbar},
  methods: {
    rootClick() {
      radio.$emit('click');
    }
  }
}

</script>
<style lang="sass">
  @import layout
  @import style

</style>