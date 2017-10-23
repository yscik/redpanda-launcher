<template lang="pug">
  img.favicon.icon(:src="url", :site="site.url" v-cloak)
</template>
<script>

import Vue from 'vue'

import {favicons} from '../app/app'

export default Vue.component("favicon", {
  props: {
    site: {}
  },
  data: () => ({state: {error: false}, url: null}),

  async created() {
    this.service = favicons;
    this.setUrl(this.site);
  },
  watch: {
    async site(site)
    {
      this.setUrl(site);
    }
  },
  methods: {
    async setUrl(site)
    {
      this.url = this.service.getFromCache(site) || await this.service.load(site);
    }
  }
})

</script>