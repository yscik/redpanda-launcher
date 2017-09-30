<template lang="pug">
  .searchbar
    .prefix-icon(:class="{search: state.searching, link: state.isUrl}")
      favicon.search-engine(:site='state.engine.urlo' v-if="state.searching")
      icon.search-icon(type='engine')
      icon.link-icon(type='link')
    input-complete.input.search-input(type="text" v-model="state.term", :complete-to='state.autocomplete && state.autocomplete.domain' ref="input" tabindex="0",
      :placeholder='state.label')
    .tab-info(v-if="state.engine && !state.searching")
      span.key TAB
      |  to search
      .suggested-engine
        favicon.search-engine(:site='state.engine.urlo')
        span.name {{state.engine.title}}

</template>
<script>

  import './input-complete.vue'
  import SearchService from './searchservice'

  export default {
    data: () => {
      return {
        state: SearchService.state
      }
    },
    created()
    {
      this.service = SearchService;
    },
    mounted()
    {
      this.$refs.input.focus()
    }
  }

</script>
<style lang="sass">
@import colors

.searchbar
  position: relative
.search-input
  font-size: 1.4rem
  padding: .3em .5em
  display: block
  width: 100%

.prefix-icon
  position: absolute
  top: 4px
  bottom: 4px
  padding: 1em
  left:  1px
  width: 2.7rem
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
  border-right: 1px solid #ccc
  font-weight: 600
  color: #fff
  //border-radius: 2px 0 0 2px
  .icon
    margin-top: -4px
  .search-icon
    opacity: .5
  &.search, &.link
    .search-icon
      display: none
    border-right: 1px solid $Blue40
  &:not(.link)
    .link-icon
      display: none
  + .search-input
    padding-left: 3.2rem

.link-icon svg *
  fill: $Blue50

.tab-info
  position: absolute
  right: 0
  top:  0
  padding: .6em
  bottom: 0
  margin: auto
  height: 2.3em
  color: #999


.suggested-engine
  display: inline-block
  margin-left: .5em
  color: #333
  font-weight: bold
</style>