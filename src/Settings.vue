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
      .control
        .control-label Default:
        .control-input
          favicon(:site='s.defaultEngine.urlo')
          strong {{s.defaultEngine.title}}
      label.control
        .control-input: input(type='checkbox' v-model="s.settings.search.opensearch.autoadd")
        .control-label Auto-add OpenSearch search engines
      .control.ident-1(:class="{disabled: !s.settings.search.opensearch.autoadd}")
        .control-label
          | When site has at least
          |
          input.inline.w4(type='number' v-model="s.settings.search.opensearch.visits", :disabled="!s.settings.search.opensearch.autoadd")
          |  visits

      .engines
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
              .remove.action(v-if="entry.type == 'opensearch'", @click='s.remove_engine(entry)')
                icon(type="close")
      .settings-message.message(:class="{active: s.lastAction.message}")
        span {{s.lastAction.message}}
        .button.undo(@click="s.lastAction.undo()" v-show="s.lastAction.undo") Undo

</template>
<script>

import SettingsService from './settingsservice'

export default {
data: () => {
  return {
    open: false,
    s: null
  }
},
created(){
  this.label = {bookmark: 'From bookmarks', opensearch: 'OpenSearch'}
},
computed: {
  engines()
  {
    return this.s.engines.reduce((m,e) => { m[e.type].push(e); return m;}, {opensearch: [], bookmark: []})
  }
},
methods: {
  toggle(state)
  {
    if(!this.s) this.s = SettingsService;
    this.open = typeof(state) == "undefined" ? !this.open : state;
  }
}
}

</script>
<style lang="sass">
@import colors
@import settings.layout
@import form

.settings-content
  .engines
    border: 1px solid $Grey40
    height: 20rem
    overflow-y: auto
    padding: .3rem
    .row
      padding: .4em
      max-height: 4rem
      transition: max-height .5s, padding .5s
      overflow-y: hidden
      & + .row
        border-top: 1px solid $border
      &:not(.active)
        max-height: 0
        padding: 0 .4em
        border: 0
  .actions
    align-self: center
    margin-left: -9rem
    display: flex
    align-items: center
    .action
      margin-left: .5em
      padding: .1em .3em
      .icon
        margin: 0
      .icon.close svg
        width: 10px
        height: 10px
  .setdefault
    .button:not(:hover):not(:active):not(:focus)
      background: $Grey40
  .row:not(:hover) .setdefault
    opacity: 0

  .type
    opacity: .5
  .group-label
    padding: .4em
    margin: 0
</style>