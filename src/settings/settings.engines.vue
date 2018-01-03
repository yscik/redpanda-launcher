<template lang="pug">
.search-engines-tab(v-show="show")
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
            .search-engine.row(v-for="(engine, index) in editor.engines", :key="index", v-if="engine.active",
              @click='editor.set_default(engine); selectingDefaultEngine = false')
              .icons
                favicon(:site='engine')
              .title.ellipsis {{engine.title}}

    .control
      .control-input: input(id='settings_opensearch_discover' type='checkbox' v-model="settings.opensearch.discover")
      label.control-label(for='settings_opensearch_discover') Auto-discover search engines
    //.control.ident-1(:class="{disabled: !settings.opensearch.discover}")
      .control-label
        .control-input: input(id='opensearch_activate' type='checkbox', :value='true'
          v-model="settings.opensearch.activate", :disabled="!settings.opensearch.discover")
        label(for="opensearch_activate") Add automatically when site has at least
        |
        |
        input.inline.w4(type='number' min='0' v-model.number="settings.opensearch.visits", :disabled="!settings.opensearch.activate")
        |  visit
        span(v-show="settings.opensearch.visits > 1") s
  .headers
    span.flex-1
      input.input.engine-filter(v-model="engine_filter" ref="engine_filter" placeholder="Filter search engines")
    span.keyword-header Keyword
  .search-engines-list
    .group(v-for="(group, type) in engines" v-show="group.length")
      h3.group-label {{label[type]}}

      .search-engine.row(v-for="(engine, index) in group", :key="index", :class="{active: engine.config.active, pending: engine.config.pending}")
        .icons
          favicon(:site='engine')
        .text.ellipsis
          .title {{engine.title}}
          .url {{engine.url}}
        .actions
          icon.enable.action(type='add' v-if="engine.config.pending", @click.native='editor.enable(engine)')
          .keyword
            input.input.engine-keyword(v-model='engine.config.keyword', :disabled="engine.config.pending")
          icon.remove.action(type="close" v-if="engine.type == 'opensearch'", @click.native='editor.remove(engine)')
          .spacing

</template>

<script>
  import {settings} from '../app/state'
  import {radio} from "../app/radio";


  export default {
    props: ['editor', 'show'],
    data: function() {
      return {
        settings: settings.engines,
        engine_filter: '',
        selectingDefaultEngine: false
      }
    },
    created() {

      this.label = {pending: 'Pending', bookmark: 'From bookmarks', opensearch: 'Discovered', builtin: 'Defaults'}

      radio.$on('click', () => this.selectingDefaultEngine = false);
      radio.$on('settings-open', this.focus)
    },
    computed: {
      engines()
      {
        return this.editor.engines.reduce((m,e) => {
              (e.title.includes(this.engine_filter) || e.url.includes(this.engine_filter)) &&
              m[e.config.pending ? 'pending' : e.type||'opensearch'].push(e);
              return m;
            },
            {pending: [], opensearch: [], bookmark: [], builtin: []})
      }
    },
    watch: {
      show(visible) {
        if(visible) this.focus()
      }
    },
    methods: {
      focus()
      {
        setTimeout(() => this.$refs.engine_filter.focus(), 100)

      }
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
      margin: 0 -2rem
      padding: .5rem 1.5rem
      background: #fff
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
    .action
      margin: 0
      width: 2rem
      height: 2rem
      display: flex
      align-items: center
      justify-content: center
      &.remove
        svg
          width: 12px
          height: 12px
        path
          fill: $Grey50
      &:hover
        background: $Grey10
        path
          fill: $Blue50

    .action.remove + .spacing
      display: none
    .spacing, .action.remove
      width: 2rem
      margin-left: .5em
  .keyword
    margin-left: .5rem
  .engine-keyword
    width: 4rem
    &[disabled]
      opacity: .3

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

  .keyword-header
    margin-right: 3.5rem
  .engine-filter
    width: 60%

  .group-label


</style>