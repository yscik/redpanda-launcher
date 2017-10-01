<template lang="pug">
  .favicon.icon(:class="state")
    img(:src="url")
</template>
<script>

import Vue from 'vue'

import FaviconService from './Favicons'

export default Vue.component("favicon", {
  props: {
    site: {}
  },
  data: () => ({state: {error: false}, url: null}),

  async created()
  {
    this.url = await FaviconService.get(this.site);
  },
  watch: {
    async site(site)
    {
//    this.url = site && (sites.icons[site.origin] && sites.icons[site.origin].favicon) || `${site.origin}/favicon.ico`
      this.url = await FaviconService.get(site);
    }
  }
})

</script>
<style lang="sass">


</style>