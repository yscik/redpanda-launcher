<template lang="pug">
  .searchbar
    .prefix-icon(:class="{search: state.searching, link: state.isUrl}")
      favicon.search-engine(:site='state.engine' v-if="state.searching")
      icon.search-icon(type='engine')
      icon.link-icon(type='link')
    input-complete.input.search-input(type="text" v-model="state.term", :complete-to='state.autocomplete && state.autocomplete.domain' ref="input" tabindex="0",
      :placeholder='state.label')
    .tab-info(v-if="state.engine && !state.searching")
      span.key TAB
      span to search
      favicon.search-engine(:site='state.engine')
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
      window.radio.$on('focus-search-input', () => this.focus())
    },
    mounted() { this.focus() },
    methods: {
      focus()
      {
        this.$refs.input.focus()
      }
    }
  }

</script>
<style lang="sass">
@import colors

.searchbar
  flex: 1
  position: relative
  display: flex
  height: 3rem
  justify-content: space-between
  > *
    position: relative
    z-index: 1

  /*border: 1px solid red*/
.search-input
  //box-shadow: 0 1px 0 hsla(210,65%,9%,.02) inset, 0 0 2px hsla(210,65%,9%,.1) inset, 0 1px 0 hsla(0,0%,100%,.2)
  box-shadow: 0 0 6px -3px #ccc
  position: absolute
  top: 0
  left: 0
  font-size: 1.5rem
  padding: .5rem
  display: block
  width: 100%
  z-index: 0

.prefix-icon
  padding: 1em
  width: 2.9rem
  margin: .3rem 0
  border-right: 1px solid #ccc
  font-weight: 600
  color: #fff
  display: flex
  align-items: center
  .icon
    line-height: 0
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
    padding-left: 3.4rem

.link-icon
  svg *
    fill: $Blue70

.tab-info
  display: flex
  align-items: center
  color: #999
  margin-right: .5em
  > *
    margin-right: .3em
  .icon
    position: relative
    top: -1px
  .name
    color: $text
    font-weight: bold
</style>