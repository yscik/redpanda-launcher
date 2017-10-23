<template lang="pug">
  a(
  :href="entry.url",
  @click.prevent="open(entry, $event)")
    favicon(:site='entry' v-if="entry.url")
    icon(type='folder' v-if="entry.children")
    .title {{entry.title}}
</template>
<script>

  import {Outbound} from '../search/outbound'
  import Vue from 'vue'

  export default Vue.component('Bookmark', {
    props: ['entry'],
    methods: {
      open: Outbound.open,
    }
  })

</script>