<template lang="pug">
  .icon(:class="state")
    img(:src="url", @error="state.error = true")
</template>
<script>

import Vue from 'vue'

const ah = 'icons/';
const typeImages = {
 history: ah+'history-16.svg' ,
 bookmark: ah+'bookmarks-16-Outline.svg' ,
 session: ah+'tab-16.svg' ,
 topsite: ah+'topsites-16.svg' ,
 engine: ah+'search-16.svg' ,
 host: ah+'highlights-16.svg' ,
};

export default Vue.component("icon", {
  props: {
    site: {default: null},
    type: {type: String, default: null}
  },
  data: () => ({state: {error: false}}),
  computed: {
    url: function()
    {
      return this.type && typeImages[this.type] ||
          this.site && `${this.site.origin}/favicon.ico`;
    }
  }
})

</script>
<style lang="sass">
  .icon
    display: inline-block
    margin:
      right: 10px
    vertical-align: baseline
    border: none
    /*background: #fff*/
    /*border-radius: 2px*/
    /*padding: 2px*/
    font-size: 0
    &.error
      img
        opacity: 0
    img
      width: 16px
      height: 16px

</style>