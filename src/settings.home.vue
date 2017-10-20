<template lang='pug'>
.home
  h3.title Start page
  label.control
    .control-input: input(type='checkbox' v-model="settings.recent")
    .control-label Show recently closed tabs
  label.control
    .control-input: input(type='checkbox' v-model="settings.bookmarks.enabled")
    .control-label Show bookmarks folder:
    .control-input: select(v-model="settings.bookmarks.folder")
      option(v-for="(folder, id) in bookmarks.folders", :value="folder.id") {{folder.title}}



</template>
<script>
import Bookmarks from './Bookmarks'

export default {
  props: {settings: {}},
  data: () => ({
    bookmarks: Bookmarks
  })
}

</script>
<style lang="sass" scoped>
@import colors
.home

</style>