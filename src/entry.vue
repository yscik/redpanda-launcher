<template lang="pug">
  .entry(:class="{selected: selected}")
    .icons
      icon.favicon(:site='data.urlo')
    .text
      .title {{data.title}}
      .url
        icon.source-icon(:type="data.source")
        strong {{data.weight}}
        |  {{data.url}}
      //.url {{JSON.stringify(data)}}

</template>
<script>

  export default {
    props: {
      data: Object,
      selected: {type: Boolean, default: false}
    }
  }

</script>
<style lang="sass" scoped>
.entry
  padding: .4em
  text-decoration: none
  border-radius: 3px
  position: relative
  display: flex
  cursor: pointer
  border: 2px solid transparent

  &:hover
    background-color: #fafafa
    color: #18a0ff
  &.selected
    background-color: #fff
    border-color: #18a0ff
.text
  flex: 1
.title
  font-weight: bold
.url
  color: #737373
  font-size: .9em

.source-icon
  opacity: .6

</style>