<template lang="pug">
  .settings(:class="{open: open}")
    .toggle(@click="toggle()")
      svg.i(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16")
        path(fill="context-fill" d="M15 7h-2.1a4.967 4.967 0 0 0-.732-1.753l1.49-1.49a1 1 0 0 0-1.414-1.414l-1.49 1.49A4.968 4.968 0 0 0 9 3.1V1a1 1 0 0 0-2 0v2.1a4.968 4.968 0 0 0-1.753.732l-1.49-1.49a1 1 0 0 0-1.414 1.415l1.49 1.49A4.967 4.967 0 0 0 3.1 7H1a1 1 0 0 0 0 2h2.1a4.968 4.968 0 0 0 .737 1.763c-.014.013-.032.017-.045.03l-1.45 1.45a1 1 0 1 0 1.414 1.414l1.45-1.45c.013-.013.018-.031.03-.045A4.968 4.968 0 0 0 7 12.9V15a1 1 0 0 0 2 0v-2.1a4.968 4.968 0 0 0 1.753-.732l1.49 1.49a1 1 0 0 0 1.414-1.414l-1.49-1.49A4.967 4.967 0 0 0 12.9 9H15a1 1 0 0 0 0-2zM5 8a3 3 0 1 1 3 3 3 3 0 0 1-3-3z")
    .settings-header
      h2.title
        img.favicon.icon(src="fav-1.png")
        span Red Panda Launcher
    .settings-content(v-if="s")
      h3 Search engines
      .control(v-if="s.defaultEngine")
        .control-label Default:
        .control-input
          favicon(:site='s.defaultEngine.urlo')
          strong {{s.defaultEngine.title}}
      label.control
        .control-input: input(type='checkbox' v-model="s.settings.search.opensearch.autoadd")
        .control-label Add OpenSearch search engines defined by sites
      .control.ident-1(:class="{disabled: !s.settings.search.opensearch.autoadd}")
        .control-label
          | When site has at least
          |
          input.inline.w4(type='number' v-model.number="s.settings.search.opensearch.visits", :disabled="!s.settings.search.opensearch.autoadd")
          |  visit
          span(v-show="s.settings.search.opensearch.visits > 1") s
      label.control.ident-1(:class="{disabled: !s.settings.search.opensearch.autoadd}")
        .control-input: input(type='checkbox' v-model="s.settings.search.opensearch.manual")
        .control-label Manually enable discovered search engines
      .engines
        .headers
          span.flex-1
            input.input.engine-filter(v-model="engine_filter" ref="engine_filter" placeholder="Filter search engines")
          span.keyword-header Keyword
        .box
          .group(v-for="(group, type) in engines")
            h3.group-label {{label[type]}}
            .row(v-for="(entry, index) in group", :key="entry.url", :class="{active: entry.active}")
              .icons
                favicon(:site='entry.urlo')
              .text.ellipsis
                .title {{entry.title}}
                .url {{entry.url}}
              .actions
                .setdefault.action(@click='s.set_default_engine(entry)')
                  .button Set As Default
                .keyword
                  input.input.engine-keyword(v-model='entry.keyword', @input='s.change(entry, true)')
                .remove.action(v-if="entry.type == 'opensearch'", @click='s.remove_engine(entry)')
                  icon(type="close")
                .spacing
      .transforms
        h3.title Search transformations
          .button.add-transform(@click="s.settings.search.transforms.unshift({pattern: '', append: ''})")
            icon(type='add') Add
        //.help
        .headers
          span.transform-pattern Pattern
          span.transform-append Extra content
        .box
          .row.transform(v-for="transform in s.settings.search.transforms")
            input.transform-pattern.input(v-model="transform.pattern" type="text" placeholder='Pattern')
            input.transform-append.input(v-model="transform.append" type="text" placeholder="Content to append")
            .remove.action(@click='s.settings.search.transforms.remove(transform)')
              icon(type="close")
      .settings-message.message(:class="{active: s.lastAction.active, fresh: s.lastAction.fresh}")
        .message-body
          icon.message-icon(:type="s.lastAction.icon" v-if="s.lastAction.icon")
          favicon.message-favicon(:site="s.lastAction.favicon" v-if="s.lastAction.favicon")
          span.message-text {{s.lastAction.message}}
          span.message-node(ref="messageNode")
        .button.undo(@click="s.lastAction.undo()" v-show="s.lastAction.undo") Undo

</template>
<script>

import SettingsEditor from './settingseditor'

export default {
  data: () => {
    return {
      open: false,
      s: null,
      engine_filter: ''
    }
  },
  created(){
    this.label = {bookmark: 'From bookmarks', opensearch: 'Discovered', builtin: 'Defaults'}
  },
  computed: {
    engines()
    {
      return this.s && this.s.engines.reduce((m,e) => {
        (e.title.includes(this.engine_filter) || e.url.includes(this.engine_filter)) &&
          m[e.type].push(e);
        return m;
      },
      {opensearch: [], bookmark: [], builtin: []})
    }
  },
  methods: {
    toggle(state)
    {
      if(!this.s) this.s = new SettingsEditor();
      this.open = typeof(state) == "undefined" ? !this.open : state;

      if(this.open) setTimeout(() => this.open && this.$refs.engine_filter.focus(), 300);
      else window.radio.$emit('focus-search-input');

    }
  },
  watch: {
      's.lastAction'(action) {
        let node = this.$refs.messageNode;
        if(!node) return;
        while(node.firstChild) node.removeChild(node.firstChild);
        if(action.node) {
          node.appendChild(action.node);
        }
      },
      's.settings': {
        handler(value, oldvalue) {
          this.s && this.s.change(value, oldvalue)
        },
        deep: true,
        immediate: true
      }
  }
}

</script>
<style lang="sass">
@import colors
@import settings.layout
@import form

.settings-content
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
  .engines
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
  .transforms
    position: relative
    .box
      /*border: none*/
      background: $Grey10
      height: auto
      min-height: 5rem
      max-height: 15rem
    .add-transform
      position: absolute
      right: 0
      top: 0

    .headers
      padding: 0 .5rem
    .row
      align-items: center
    .action
      margin-left: .5rem
    input[type='text']
      padding: .4em
      border-radius: 0
    .transform-pattern
      margin-right: -1px
      flex: 1
    .transform-append
      flex: 2
    h3
      margin-right: 3rem
</style>