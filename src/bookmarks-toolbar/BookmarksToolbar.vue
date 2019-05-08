<template lang="pug">
.bookmarks-toolbar(:class="{icons: settings.icons}")
  template(v-for="entry in bookmarks.children")
    Bookmark.bookmark(v-if='entry.type=="bookmark"', :entry='entry', :key='entry.index' v-cloak)
    BookmarkFolder.bookmark(v-if='entry.type == "folder"', :entry='entry', :key='entry.index' v-cloak)
</template>
<script>

  import {bookmarks} from '../app/app';
  import {settings} from '../app/state';
  import './Bookmark.vue';
  import './BookmarkFolder.vue';


  export default {
    data: () => ({
      settings: settings.home.bookmarkstoolbar,

    }),
    computed: {
      bookmarks() {
        return settings.home.bookmarkstoolbar.enabled && bookmarks.toolbar
      }
    },

  }
</script>

<style lang="sass">
@import "../app/vars"
.bookmarks-toolbar
  padding: .3em .5rem
  background: $ChromeLight
  border-bottom: 1px solid #CCCCCC
  overflow: visible
  white-space: nowrap
  display: flex
  z-index: 5

  > .bookmark
    padding: .2em .3em
    margin: 0 .1em
    border-radius: 2px
    display: inline-block
    height: 24px
    .icon, .title
      display: inline-block
    .icon
      margin: 0
    .title:not(:empty)
      margin-left: 6px
      font-weight: normal
    &:hover
      background: var(--Grey30)
  &.icons
    > .bookmark:not(.folder)
      position: relative
      > .title
        position: absolute
        left: 0
        top: 1.8rem
        padding: .3em
        background: var(--Grey80)
        color: var(--white)
        display: none
        border-radius: 2px
        font-weight: normal
        opacity: .8
      &:hover .title:not(:empty)
        display: block

</style>