<template lang="pug">
  .icon.svg(v-html="svg", :class="type")
</template>
<script>

import Vue from 'vue'

const typeImages = {};
const iconFiles = require.context('../../icons/', false, /\.svg$/);
iconFiles.keys().forEach((iconFile) =>
    typeImages[iconFile.replace(/.*\/(\w+)\.svg$/, '$1')]  = iconFiles(iconFile)
);

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
@import "colors"

.icon
  display: inline-block
  margin:
    right: 6px
  font-size: 1em
  vertical-align: middle
  svg
    transform: translateZ(0)

  &.action, .action &
    cursor: pointer
  &.action:hover, .action:hover &
    svg *
      fill: $Blue50
  &.action:active, .action:active &,
  &.action:focus, .action:focus &
    svg *
      fill: $Blue60

</style>