<template lang="pug">
  .searchbar.input
    .prefix-icon(:class="{search: state.searching, link: state.isUrl}")
      favicon.search-engine(:site='state.engine' v-if="state.searching")
      icon.search-icon(type='engine')
      icon.link-icon(type='link')
    input-complete.search-input(type="text", :value="state.term", @input="search($event)",
      :complete-to='state.autocomplete && state.autocomplete.domain' ref="input" tabindex="0",
      :placeholder='state.label')
    .tab-info(v-if="state.engine && !state.searching")
      span.key TAB
      span to search
      favicon.search-engine(:site='state.engine')
      span.name {{state.engine.title}}

</template>
<script>

  import './input-complete.vue'
  import {search} from '../app/state'
  import {radio} from '../app/radio'

  export default {
    props: ['state'],
    data: () => {
      return {
        focused: false
      }
    },
    created()
    {
      radio.$on('focus-search-input', () => this.$nextTick(this.focus))
    },
    mounted() {
      this.focus()
    },
    methods: {
      search(term) {
        this.state.setTerm(term);
      },
      focus()
      {
        this.$refs.input.$el.focus()
      }
    }
  }

</script>
<style lang="sass">
@import "../app/vars"

.searchbar
  flex: 1
  position: relative
  display: flex
  justify-content: space-between
  > *
    position: relative
    z-index: 1

  /*border: 1px solid red*/
  //box-shadow: 0 1px 0 hsla(210,65%,9%,.02) inset, 0 0 2px hsla(210,65%,9%,.1) inset, 0 1px 0 hsla(0,0%,100%,.2)
  box-shadow: 0 0 6px -3px var(--shadow)
  z-index: 0
  padding: .1em .5em
  margin: 0
  &:focus-within
    border-color: var(--Blue50)
    box-shadow: 0 0 0 1px var(--Blue50)
    .icon path
      fill: var(--Blue60)
  .search-input
    padding: .5rem
    font-size: 1.5rem
    border: none
    background: none
    flex: 1

  ::-moz-selection
    background-color: var(--Blue50)
    color: var(--white)

.prefix-icon
  padding: .5em

  margin: .3rem 0
  border-right: 1px solid var(--border)
  font-weight: 600
  color: var(--white)
  display: flex
  align-items: center
  .icon
    line-height: 0
  &.search, &.link
    .search-icon
      display: none
    border-right: 1px solid var(--Blue40)
  &:not(.link)
    .link-icon
      display: none

.link-icon
  svg *
    fill: var(--Blue50)

.tab-info
  display: flex
  align-items: center
  color: #999
  margin-right: .5em
  .f
    display: flex
    align-items: center
  span:not(:empty)
    margin-right: .3em
  .icon
    position: relative
    top: -1px
  .name
    color: var(--text)
    font-weight: bold
</style>