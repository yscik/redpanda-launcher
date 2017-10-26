<template lang="pug">
.search-engines-tab
  .search-engines-settings
    .control
      .control-label Default:
      .control-input(v-if="editor.defaultEngine")
        .default-engine(@mousedown.stop="")
          .input(@click="selectingDefaultEngine = !selectingDefaultEngine")
            favicon(:site='editor.defaultEngine')
            strong {{editor.defaultEngine.title}}
            icon(type="")
          .select-dropdown(v-if="selectingDefaultEngine")
            .search-engine.row(v-for="(entry, index) in editor.engines", :key="index", :class="{active: entry.active}",
              @click='editor.set_default_engine(entry); selectingDefaultEngine = false')
              .icons
                favicon(:site='entry')
              .title.ellipsis {{entry.title}}

    label.control
      .control-input: input(type='checkbox' v-model="settings.opensearch.discover")
      .control-label Add OpenSearch search engines defined by sites
    .control.ident-1(:class="{disabled: !settings.opensearch.discover}")
      .control-label
        .control-input: input(id='opensearch_activate' type='checkbox' v-model="settings.opensearch.activate", :disabled="!settings.opensearch.discover")
        label(for="opensearch_activate") Enable new engines automatically when site has at least
        |
        | 
        input.inline.w4(type='number' v-model.number="settings.opensearch.visits", :disabled="!settings.opensearch.activate")
        |  visit
        span(v-show="settings.opensearch.visits > 1") s
  .headers
    span.flex-1
      input.input.engine-filter(v-model="engine_filter" ref="engine_filter" placeholder="Filter search engines")
    span.keyword-header Keyword
  .search-engines-list
    .group(v-for="(group, type) in engines")
      h3.group-label {{label[type]}}

      .search-engine.row(v-for="(entry, index) in group", :key="entry.url", :class="{active: entry.active, pending: entry.pending}")
        .icons
          favicon(:site='entry')
        .text.ellipsis
          .title {{entry.title}}
          .url {{entry.url}}
        .actions
          .keyword
            input.input.engine-keyword(v-model='entry.keyword', @input='editor.change(entry, true)')
          .enable.action(v-if="entry.pending", @click='editor.enable_engine(entry)')
            icon(type="add")
          .remove.action(v-if="entry.type == 'opensearch'", @click='editor.remove_engine(entry)')
            icon(type="close")
          .spacing

</template>

<script>
  import EngineEditor from './EngineEditor'
  import {settings} from '../app/state'
  import {radio} from "../app/radio";


  export default {
    props: ['settingsEditor'],
    data: function() {
      console.log(this, this.settingsEditor);
      return {
        editor: window.engineeditor = new EngineEditor(this.settingsEditor),
        settings: settings.engines,
        engine_filter: '',
        selectingDefaultEngine: false

      }
    },
    created(){
//      if (this.open)
//        setTimeout(() => this.open && this.$refs.engine_filter && this.$refs.engine_filter.focus(), 300);

      this.label = {pending: 'Pending', bookmark: 'From bookmarks', opensearch: 'Discovered', builtin: 'Defaults'}

      radio.$on('click', () => this.selectingDefaultEngine = false);
    },
    computed: {
      engines()
      {
        return this.editor.engines.reduce((m,e) => {
              (e.title.includes(this.engine_filter) || e.url.includes(this.engine_filter)) &&
              m[!e.active ? 'pending' : e.type].push(e);
              return m;
            },
            {pending: [], opensearch: [], bookmark: [], builtin: []})
      }
    },
    watch: {
    }
  }
</script>
<style lang="sass">
@import ../app/colors

.settings-content
  .search-engines-tab
    flex: 1
    display: flex
    flex-direction: column
    min-height: 0
    .search-engines-list
      border-top: 1px solid $border
      margin: 0 -1.5rem
      padding: .5rem 1rem
      flex: 1
      overflow-y: auto
    .search-engine
      &:not(.active):not(.pending)
        display: none
    .actions
      align-self: center
      display: flex
      align-items: center
      margin-left: 1rem
    .pending
      .keyword
        display: none
      .actions
        margin-left: 0
    .action
      padding: .2em .5em
      &:hover
        background: $Grey20
      .icon
        margin: 0
        svg
          width: 16px
          height: 16px
      .icon.close svg
        width: 12px
        height: 12px
    .action.remove + .spacing
      display: none
    .spacing, .action.remove
      width: 1.7rem
      margin-left: .5em
    .enable.action
      path
        fill: $Blue60
  .engine-keyword
    width: 4rem

  .default-engine
    position: relative
    .input, .select-dropdown
      width: 20rem
    .input, .search-engine
      cursor: pointer
    .search-engine
      border: none
      &:hover
        background-color: $Blue40
        color: #fff
    .select-dropdown
      position: absolute
      left: .1rem
      top: 2.2rem
      z-index: 2

</style>