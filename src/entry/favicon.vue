<template lang="pug">
  img.favicon.icon(:class="state", :src="url")
</template>
<script>

import Vue from 'vue'

//import FaviconService from './Favicons'

export default Vue.component("favicon", {
  props: {
    site: {}
  },
  data: () => ({state: {error: false}, url: null}),

  async created()
  {
    this.service = background.Favicons;
    this.url = await this.service.get(this.site);
  },
  watch: {
    async site(site)
    {
//    this.url = site && (sites.icons[site.origin] && sites.icons[site.origin].favicon) || `${site.origin}/favicon.ico`
      this.url = await this.service.get(site);
    }
  }
})

</script>