<template lang="pug">
  .entries
    a.entry(v-for="(entry, index) in entries",
    :href="entry.url",
    @click.prevent="open(entry, $event)",
    :class="{selected: index === selected}" tabindex="0")
      .icons
        icon.source-icon(:type="entry.source")
        favicon(:site='entry')
      .text
        .title {{entry.title}}
        .url
          strong {{entry.weight}}
          //strong {{entry.age}} days ago
          |  {{entry.url}}


</template>
<script>

  import {Outbound} from '../search/outbound';
  import Vue from 'vue';

  export default Vue.component("results", {
    props: ['entries', 'selected'],
    methods: {
      open: Outbound.open
    }
  })

</script>
<style lang="sass">
@import "../app/vars"

.entry
  padding: .4em 0
    left: 2.2rem
  border-radius: 2px
  position: relative
  display: flex
  cursor: pointer
  border: 2px solid transparent
  word-break: break-all
  &:focus
    outline: none
  &:hover
    color: var(--Blue60)
    .url
      color: var(--Blue40)
  &:active
    color: var(--Blue70)
    .url
      color: var(--Blue50)
  &.selected, &.selected:active, &:focus
    background-color: var(--Blue40)
    color: var(--darktext)
    .url
      color: var(--darktext2)
  &:focus
    background-color: var(--Blue50)
.text
  flex: 1
  /*display: flex*/

.title
  font-weight: bold
.url
  color: var(--Grey50)
  font-size: .9em
  max-height: 2rem
  overflow: hidden
.source-icon
  position: absolute
  left: 0.5rem
  opacity: .6
  img
    /*width: 12px*/
    /*height: 12px*/
  vertical-align: middle
</style>