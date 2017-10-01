<template lang="pug">
.app
  Settings
  Search
</template>
<script>

import Search from './Search.vue'
import Settings from './Settings.vue'

export default {
  name: 'App',
  components: { Search, Settings }
}

</script>
<style lang="sass">
  @import colors
  @import style
  @import layout

</style>