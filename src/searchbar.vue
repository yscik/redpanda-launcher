<template lang="pug">
  .searchbar
    .search-engine(v-if="service.state.engine")
      icon.favicon(:site='service.state.engine.urlo')
      span  {{service.state.engine.title}}
    input.input.search-input(type="text" v-model="service.term" ref="input" tabindex="0" placeholder="Search your feelings")
    .tab-info(v-show="service.state.canTab")
      span.key TAB
      |  to search

</template>
<script>

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
    font-size: 1.5rem
    padding: .3em .5em
    display: block
    width: 100%

  .search-engine
    position: absolute
    top: 1px
    bottom: 1px
    padding: 1em
    left:  1px
    width: 10rem
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis

    font-weight: 600
    background: #0a84ff
    color: #fff
    border-radius: 2px 0 0 2px
    box-shadow: 2px 0 0 -1px hsla(210,65%,9%,.02), 2px 0 2px -1px hsla(210,65%,9%,.1)

    + .search-input
      padding-left: 11rem

  .tab-info
    position: absolute
    right: 1em
    top: 1em
    color: #999
  .tab-info
    position: absolute
    right: 1em
    top: 1em
    color: #999
</style>