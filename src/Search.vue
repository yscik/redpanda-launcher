<template lang="pug">
.main(@keydown.up="service.select(-1, $event)",
        @keydown.down="service.select(1, $event)",
        @keydown.tab.prevent="service.tab($event)",
        @keydown.enter="service.enter($event)",
        @keydown.delete="service.backspace($event)")
  .suggestions: .content
    .logo(v-if="!state.term")
    results.result(v-if="!state.home", :entries='state.suggestions')
  .head: .content
    searchbar
  .results: .content
    results.result(v-if="!state.home", :entries='state.result', :selected='state.index')
    .start-page(v-if='state.home')
      .group
        h3
          icon(type='session')
          span Recent tabs
        results.session-tabs(:entries='state.session')
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

export default {
  data: () => {
    return {
      state: SearchService.state
    }
  },
  created: function()
  {
    this.service = SearchService
  },
  components: {results, searchbar},


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