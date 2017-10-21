<template lang="pug">
.bookmarks-toolbar(:class="{icons: settings.icons}")
  a.bookmark(v-for="(entry, index) in bookmarks.children",
    :href="entry.url",
    @click.prevent="open(entry, $event)")
      favicon(:site='entry')
      .title {{entry.title}}
</template>
<script>

  import Bookmarks from './Bookmarks';
  import settings from './settings';
  import Entry from './Entry';

  export default {
    data: () => ({
      settings: settings.home.bookmarkstoolbar,

    }),
    created() {
      this.open = Entry.open
    },
    computed: {
      bookmarks() {
        console.log(Bookmarks.toolbar);
        return Bookmarks.folders && settings.home.bookmarkstoolbar.enabled && Bookmarks.toolbar
      }
    }

  }
</script>

<style lang="sass">
@import colors
.bookmarks-toolbar
  padding: .3em .5rem
  background: $ChromeLight
  border-bottom: 1px solid #CCCCCC
  overflow: visible
  white-space: nowrap
  display: flex
  align-items: center
  z-index: 2

  .bookmark
    padding: .2em .3em
    margin: 0 .1em
    border-radius: 2px
    display: inline-flex
    align-items: center
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
    .bookmark
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