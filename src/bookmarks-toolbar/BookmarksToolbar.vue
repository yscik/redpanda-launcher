<template lang="pug">
.bookmarks-toolbar(:class="{icons: settings.icons}")
  template(v-for="entry in bookmarks.children")
    Bookmark.bookmark(v-if='entry.type=="bookmark"', :entry='entry', :key='entry.index')
    BookmarkFolder.bookmark(v-if='entry.type == "folder"', :entry='entry', :key='entry.index')
</template>
<script>

  import Bookmarks from './Bookmarks';
  import settings from './settings';
  import './Bookmark.vue';
  import './BookmarkFolder.vue';


  export default {
    data: () => ({
      settings: settings.home.bookmarkstoolbar,

    }),
    computed: {
      bookmarks() {
        return Bookmarks.folders && settings.home.bookmarkstoolbar.enabled && Bookmarks.toolbar
      }
    }

  }
</script>

<style lang="sass">
@import "../app/colors"
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
      background: $Grey30
  &.icons
    .bookmark > a
      position: relative
      .title
        position: absolute
        left: 0
        top: 1.8rem
        padding: .3em
        background: $Grey80
        color: #fff
        display: none
        border-radius: 2px
        font-weight: normal
        opacity: .8
      &:hover .title:not(:empty)
        display: block

</style>