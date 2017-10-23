<template lang="pug">
.search-engines-tab
  .search-engines-settings
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
  .headers
    span.flex-1
      input.input.engine-filter(v-model="engine_filter" ref="engine_filter" placeholder="Filter search engines")
    span.keyword-header Keyword
  .search-engines-list
    .group(v-for="(group, type) in engines")
      h3.group-label {{label[type]}}
      .row(v-for="(entry, index) in group", :key="entry.url", :class="{active: entry.active}")
        .icons
          favicon(:site='entry')
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

</template>

<script>


  export default {
    data: () => {
      return {
        engine_filter: '',
      }
    },
    created(){
//      if (this.open)
//        setTimeout(() => this.open && this.$refs.engine_filter && this.$refs.engine_filter.focus(), 300);

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
  }
</script>