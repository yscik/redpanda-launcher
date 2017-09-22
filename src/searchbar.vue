<template lang="pug">
  .searchbar
    .prefix-icon(:class="{search: service.state.searching, link: service.state.isUrl}")
      icon.search-engine.favicon(:site='service.state.engine.urlo' v-if="service.state.searching")
      icon.search-icon(type='engine')
      icon.link-icon(type='link')
    input-complete.input.search-input(type="text" v-model="service.term", :complete-to='service.state.autocomplete && service.state.autocomplete.domain' ref="input" tabindex="0",
      :placeholder='service.state.label')
    .tab-info(v-if="service.state.engine && !service.state.searching")
      span.key TAB
      |  to search
      .suggested-engine
        icon.search-engine.favicon(:site='service.state.engine.urlo')
        span.name {{service.state.engine.title}}

</template>
<script>

  import './input-complete.vue'

  export default {
    props: ['service'],
    mounted: function()
    {
      this.$refs.input.focus()
    }
  }

</script>
<style lang="sass" scoped>
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
  &:not(.link)
    .link-icon
      display: none
  + .search-input
    padding-left: 3.2rem


.tab-info
  position: absolute
  right: .2em
  top: -.4em
  bottom: 0
  margin: auto
  height: 2.3em
  color: #999


.suggested-engine

  display: inline-block
  margin-left: .5em
  padding: .7em
  border-radius: 2px
  color: #333
  box-shadow: 0 0 5px -1px rgba(#000, .2)
  font-weight: bold
</style>