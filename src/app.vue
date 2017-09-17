<template lang="pug">
.app
  //#launcher
  Search
  <!--iframe#aboutHome(src="about:home" width="100%" height="100%")-->
</template>
<script>

import Search from './Search.vue'

export default {
  name: 'App',
  components: { Search }
}

</script>
<style lang="sass">
  @import './style.sass'
  #launcher
    position: fixed
    left: 0
    top: 0
    bottom: 118px
    right: 0
    z-index: 1
    background: #F2F2F2
  #aboutHome
    position: fixed
    left: 0

    bottom: 0
    right: 0
    z-index: 0
    border: none
    width: 100%
    height: 600px
</style>