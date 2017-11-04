<template lang="pug">
.app(@mousedown="rootClick()")
  BookmarksToolbar(v-if='settings.home.bookmarkstoolbar.enabled')
  .body
    Settings
    .main(@keydown.up="service.select(-1, $event)",
          @keydown.down="service.select(1, $event)",
          @keydown.tab="service.tab($event)",
          @keydown.enter="service.enter($event)",
          @keydown.delete="service.backspace($event)")
      //.suggestions: .content
        .logo(v-if="!state.term")
        results.result(v-if="!state.home", :entries='state.suggestions')
      .head: .content
        Searchbar(:state="state")
      .results: .content
        results.result(v-if="!state.home", :entries='state.result', :selected='state.index')
        Homepage(v-if='state.home')
</template>
<script>

import Searchbar from '../search/searchbar.vue';
import Homepage from './Homepage.vue';
import Settings from '../settings/Settings.vue'
import BookmarksToolbar from '../bookmarks-toolbar/BookmarksToolbar.vue';
import {app} from './app'
import {settings} from './state'
import {radio} from './radio'
import {SearchService} from "../search/search.service";

export default
{
  name: 'SearchApp',
  data: function() {
    return {
      settings,
      state: this.service.state,
    }
  },
  beforeCreate: function()
  {
    this.service = new SearchService(app.backend, app.engines);

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