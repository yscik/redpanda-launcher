<template lang="pug">
  .entries
    entry(v-for="(entry, index) in entries" v-bind:data="entry" v-bind:key="entry.url",
    @click.native="entry.open()",
    :selected="entry.selected")

</template>
<script>

  import entry from './entry.vue';

  export default {
    props: ['entries'],
    components: {entry},


  }

</script>
<style lang="sass">

</style>