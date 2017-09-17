<template lang="pug">
  .search(@keydown.up="service.select(-1)",
          @keydown.down="service.select(1)",
          @keydown.tab.prevent="service.tab($event)",
          @keydown.enter="service.act()")
    .panel
      //.logo
      searchbar(:service='service')
      results.result(v-if="service.term", :entries='service.result')
      .start-page(v-if='!service.term')
        .group
          h3
            icon(type='session')
            span Recent tabs
          results.session-tabs(:entries='service.data.session')
        .group
          h3
            icon(type='topsite')
            span Top sites
          results.top-sites(:entries='service.data.topSites')

</template>
<script>

import SearchService from './searchservice'
import results from './results.vue';
import searchbar from './searchbar.vue';

export default {
  data: () => {
    return {
      service: new SearchService()

    }
  },
  components: {results, searchbar},


}

</script>
<style lang="sass">
@import './style.sass'
.search

  .result
    padding-top: .3rem
.panel
  position: relative

h3
  font-weight: normal
  font-size: 17px
  color: #737373
  border-bottom: 1px solid #ddd
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
</style>