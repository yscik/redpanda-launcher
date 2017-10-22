<template lang="pug">
  a(
  :href="entry.url",
  @click.prevent="open(entry, $event)")
    favicon(:site='entry' v-if="entry.url")
    icon(type='folder' v-if="entry.children")
    .title {{entry.title}}
</template>
<script>

  import Entry from './Entry';
  import Vue from 'vue'

  export default Vue.component('Bookmark', {
    props: ['entry'],
    methods: {
      open: Entry.open,
    }
  })

</script>

<style lang="sass" scoped>
@import colors

</style>