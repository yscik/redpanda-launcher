<template lang="pug">
  .settings(:class="{open: open}")
    .settings-header
      .settings-toggle.settings-state-indicator(@mousedown="toggle()", :class="editorState.changes")
        svg.i(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16")
          path(fill="context-fill" d="M15 7h-2.1a4.967 4.967 0 0 0-.732-1.753l1.49-1.49a1 1 0 0 0-1.414-1.414l-1.49 1.49A4.968 4.968 0 0 0 9 3.1V1a1 1 0 0 0-2 0v2.1a4.968 4.968 0 0 0-1.753.732l-1.49-1.49a1 1 0 0 0-1.414 1.415l1.49 1.49A4.967 4.967 0 0 0 3.1 7H1a1 1 0 0 0 0 2h2.1a4.968 4.968 0 0 0 .737 1.763c-.014.013-.032.017-.045.03l-1.45 1.45a1 1 0 1 0 1.414 1.414l1.45-1.45c.013-.013.018-.031.03-.045A4.968 4.968 0 0 0 7 12.9V15a1 1 0 0 0 2 0v-2.1a4.968 4.968 0 0 0 1.753-.732l1.49 1.49a1 1 0 0 0 1.414-1.414l-1.49-1.49A4.967 4.967 0 0 0 12.9 9H15a1 1 0 0 0 0-2zM5 8a3 3 0 1 1 3 3 3 3 0 0 1-3-3z")
      h2.title
        img.favicon.icon(src="fav-1.png")
        span Red Panda Launcher
      .tabs
        .tab(@click='tab = "general"', :class='{active: tab == "general"}') General
        .tab(@click='tab = "engines"', :class='{active: tab == "engines"}') Search engines
        .tab(@click='tab = "advanced"', :class='{active: tab == "advanced"}') Advanced
    .settings-content(v-if="editor")
      .tab-content(v-show='tab == "general"')
        label.control
          .control-input: input(type='checkbox' v-model="settings.sync")
          .control-label Sync settings and search engines between devices
        HomePageSettings(:settings="settings.home")
      <!--SearchEngineSettings.tab-content(v-show='tab == "engines"' v-if="loadSearch")-->
      <!--SearchTransformSettings.tab-content(v-show='tab == "advanced"' v-if="loadSearch", :settings="settings.search.transforms")-->
      message.settings-message(:action="editorState.lastAction")

</template>
<script>

import SettingsEditor from './settingseditor'
import SearchTransformSettings from './settings.transforms.vue'
import SearchEngineSettings from './settings.engines.vue'
import HomePageSettings from './settings.home.vue'
import {radio} from '../app/radio'
import {settings} from '../app/state'

export default {
  data: () => {
    return {
      open: false,
      settings,
      tab: 'general',
      loadSearch: false,
      editorState: {changes: null, lastAction: {}},
    }
  },
  components: {SearchTransformSettings, HomePageSettings, SearchEngineSettings},

  created() {
    this.editor = null;
  },

  methods: {
    toggle(state)
    {
      this.open = typeof(state) == "undefined" ? !this.open : state;

      if (!this.editor) this.init();
      else
        radio.$emit('focus-search-input');

      this.editorState.changes = null;

    },
    init() {
      this.editor = window.editor = new SettingsEditor(this.editorState);
      setTimeout(() => this.loadSearch = true, 500)
    },
  },
  watch: {
      settings: {
        handler(value, oldvalue) {
          this.editor && this.editor.change(value, oldvalue)
        },
        deep: true,
        immediate: true
      },
      'editorState.changes'(v) {
        if(v != "dirty") setTimeout(() => this.editor.state.changes == v && (this.editor.state.changes = null), 500)
      }
  }
}

</script>
<style lang="sass">
@import "../app/colors"
@import "../app/form"
@import "./settings.layout"
@import "./settings.toggle"

.tabs
  display: flex
  .tab
    flex: 1
    font-weight: bold
    cursor: pointer
.settings-header
  .tabs
    padding-left: .5rem
    padding-right: 1rem
  .tab
    margin: .1rem
    padding: .4em
    border-bottom: 2px solid $border
    text-transform: uppercase
    &:hover
      color: $Blue40
    &.active
      color: $Blue60
      border-bottom-color: $Blue40
.settings-content
  overflow: auto
  display: flex
  flex-direction: column
  .box
    border: 1px solid $Grey40
    height: 25rem
    overflow-y: auto
    padding: .3rem
  .row
    position: relative
    padding: .4em
    max-height: 4rem
    transition: max-height .5s, padding .5s
    overflow-y: hidden
    & + .row
      border-top: 1px solid $border
  .search-engines-tab
    flex: 1
    display: flex
    flex-direction: column
    min-height: 0
    .search-engines-list
      border-top: 1px solid $border
      margin: 0 -2rem
      padding: 0 2rem
      flex: 1
      overflow-y: auto
    .row
      &:not(.active)
        max-height: 0
        padding: 0 .4em
        border: 0
  .actions
    align-self: center
    margin-left: -9rem
    display: flex
    align-items: center
    .action.remove + .spacing
      display: none
    .spacing, .action.remove
      width: 1.7rem
      margin-left: .5em
  .action
    padding: .2em .5em
    &:hover
      background: $Grey20
    .icon
      margin: 0
    .icon.close svg
      width: 10px
      height: 10px

  .setdefault
    .button:not(:hover):not(:active):not(:focus)
      background: $Grey40
    &:hover
      background: transparent
  .row:not(:hover) .setdefault
    opacity: 0

  .type
    opacity: .5
  .group-label
    padding: .4em
    margin: 0

  .engine-keyword
    width: 3rem
  .headers
    padding: .5rem 0
    display: flex
    align-items: flex-end
    text-transform: uppercase
    font-size: .8rem
    font-weight: 600
    color: $text2
    .keyword-header
      margin-right: 3.8rem
    .engine-filter
      width: 60%
</style>