<template lang="pug">
  .icon.svg(v-html="svg", :class="type")
</template>
<script>

import Vue from 'vue'

const typeImages = {
 history: require('../icons/history-16.svg'),
 bookmark: require('../icons/bookmark-16-Outline.svg'),
 session: require('../icons/tab-16.svg'),
 topsite: require('../icons/topsites-16.svg'),
 engine: require('../icons/search-16.svg'),
 link: require('../icons/link-16.svg'),
 host: require('../icons/highlights-16.svg'),
 close: require('../icons/stop-16.svg'),
 delete: require('../icons/delete-16.svg')
};

export default Vue.component("icon", {
  props: {
    type: {type: String}
  },
  computed: {
    svg: function()
    {
      return typeImages && typeImages[this.type]
    }
  }
})

</script>
<style lang="sass">
@import colors

.icon
  display: inline-block

  &.action, .action &
    cursor: pointer
    &:hover
      svg *
        fill: $Blue50
    &:active, &:focus
      svg *
        fill: $Blue60


</style>