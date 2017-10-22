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
    Homepage(v-if='state.home')

</template>
<script>

import SearchService from './searchservice'
import searchbar from './search/searchbar.vue';
import Homepage from './Homepage.vue';

export default {
  data: () => {
    return {
      state: SearchService.state,
    }
  },
  created: function()
  {
    this.service = SearchService
  },
  components: {searchbar, Homepage},
}

</script>
<style lang="sass">
@import "app/colorss""
.panel
  position: relative

.logo
  background: url('../../icons/redpanda-256.png') no-repeat
  background-size: contain
  height: 12rem
  width: 12rem
  margin: auto

</style>