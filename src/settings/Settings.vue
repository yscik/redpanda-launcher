<template lang="pug">
  .settings(:class="{open: open}")
    .settings-header
      .settings-toggle.settings-state-indicator(@mousedown="toggle()", :class="state.changes")
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
          .control-label Sync settings between devices
        HomePageSettings(:settings="settings.home")
      SearchEngineSettings.tab-content(:show='tab == "engines"' v-if="loadSearch", :editor="editor")
      <!--SearchTransformSettings.tab-content(v-show='tab == "advanced"' v-if="loadSearch", :settings="settings.search.transforms")-->
      message.settings-message(:action="state.lastAction")

</template>
<script>

import EngineSettingsEditor from './EngineEditor'
import SearchTransformSettings from './settings.transforms.vue'
import SearchEngineSettings from './settings.engines.vue'
import HomePageSettings from './settings.home.vue'
import {radio} from '../app/radio'
import {settings} from '../app/state'

export default {
  data: function() {

    return {
      open: false,
      settings: this.editor.data.settings,
      tab: 'general',
      loadSearch: false,
      state: editor.state,
    }
  },
  components: {SearchTransformSettings, HomePageSettings, SearchEngineSettings},

  beforeCreate() {
    this.editor = window.editor = new EngineSettingsEditor();
  },

  methods: {
    toggle(state)
    {
      this.open = typeof(state) == "undefined" ? !this.open : state;

      if (!this.loadSearch) setTimeout(() => this.loadSearch = true, 500);

      if(!this.open)
        radio.$emit('focus-search-input');
      else radio.$emit('settings-open');

      this.state.changes = null;

    }
  },
  watch: {
      settings: {
        handler(value, oldvalue) {
          this.editor && this.editor.change(value, oldvalue)
        },
        deep: true,
        immediate: true
      },
      'state.changes'(v) {
        if(v != "dirty") setTimeout(() => this.state.changes == v && (this.state.changes = null), 500)
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
    margin-bottom: -3px
  .tab
    margin: .1rem
    padding: .4em
    border-bottom: 2px solid transparent
    text-transform: uppercase
    text-align: center
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

  .group-label
    padding: .4rem
    margin: 0
  .group + .group
    margin-top: 1rem


  .headers
    padding: .5rem 0
    display: flex
    align-items: flex-end
    text-transform: uppercase
    font-size: .8rem
    font-weight: 600
    color: $text2
</style>