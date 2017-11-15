<template lang='pug'>
.home
  label.control
    .control-input: input(type='checkbox' v-model="settings.bookmarkstoolbar.enabled")
    .control-label Bookmarks toolbar
  label.control.ident-1(:class="{disabled: !settings.bookmarkstoolbar.enabled}")
    .control-input: input(type='checkbox' v-model="settings.bookmarkstoolbar.icons", :disabled="!settings.bookmarkstoolbar.enabled")
    .control-label Only show icons
  h3.title Start page
  label.control
    .control-input: input(type='checkbox' v-model="settings.recent")
    .control-label Show recently closed tabs
  label.control
    .control-input: input(type='checkbox' v-model="settings.bookmarks.enabled")
    .control-label Show bookmarks folder:
    .control-input: select(v-model="settings.bookmarks.folder", @change=" settings.bookmarks.enabled = true")
      option(v-for="(folder, id) in bookmarks", :value="folder.id") {{folder.title}}
  label.control
    .control-input: input(type='checkbox' v-model="settings.urls")
    .control-label Show URLs



</template>
<script>
import {bookmarks} from '../app/app'

export default {
  props: {settings: Object},
  data: () => ({
    bookmarks: bookmarks.folders
  }),
}

</script>