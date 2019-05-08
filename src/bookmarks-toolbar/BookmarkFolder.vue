<template lang="pug">
  a.folder(
    @mousedown.stop="openFolder(entry)",
    @mouseover="hoverFolder(entry)",
    :class='{open: isOpen}')
    icon(type='folder')
    .title {{entry.title}}
    .children(@mousedown.stop=""): div(v-if="isOpen")
      Bookmark.bookmark(v-for="child in entry.children", :entry='child', :key='child.index', :class="['level-'+child.level, {folder: child.type=='folder'}]")
</template>
<script>

  import Vue from 'vue'
  import {state} from './bookmarkstoolbar-state'

  export default Vue.component('BookmarkFolder', {
    props: ['entry'],
    data: () => ({state}),
    methods: {
      openFolder(entry) {
        state.folder = (state.folder != entry) ? entry : null;
      },
      hoverFolder(entry) {
        if(state.folder)
          state.folder = entry;
      }
    },
    computed: {
      isOpen() {
        return this.entry == this.state.folder
      }
    }
  })

</script>

<style lang="sass" scoped>
@import "../app/vars"
.folder
  position: relative

  &:hover
    /*background: var(--white)*/
    /*outline: 1px solid #ccc*/
    cursor: pointer
  &.open
    > .title
      color: var(--Blue60)
    > .icon
      fill: var(--Blue60)
  .children:empty
    display: none
  .children
    max-height: 40rem
    overflow: auto
    position: absolute
    left: -2px
    top: 1.8rem
    /*padding: .5rem*/
    width: 30rem
    background: var(--white)
    box-shadow: 1px 1px 6px -2px rgba(var(--black), .3)
    border: 1px solid #ccc
    z-index: 5
    white-space: normal
    .bookmark
      display: flex
      padding: .2em .3em
      &:hover
        background: var(--Blue40)
        color: var(--white)
      @for $i from 2 through 5
        &.level-#{$i}
          padding-left: ($i - 1) * 1.5rem
      &.folder
        border-top: 1px solid var(--border)
        .title
          font-weight: bold




</style>