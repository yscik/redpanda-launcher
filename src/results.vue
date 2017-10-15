<template lang="pug">
  .entries
    a.entry(v-for="(entry, index) in entries",
    :href="entry.url",
    @click.prevent="open(entry, $event)",
    :class="{selected: index === selected}")
      .icons
        favicon(:site='entry')
      .text
        .title {{entry.title}}
        .url
          icon.source-icon(:type="entry.source")
          strong {{entry.weight}}
          |  {{entry.url}}


</template>
<script>

//  import entry from './entry.vue';
  import Entry from './Entry';

  export default {
    props: ['entries', 'selected'],
//    components: {entry},
    methods: {
      open: Entry.open
    }
  }

</script>
<style lang="sass">
@import colors

.entry
  padding: .4em
  text-decoration: none
  border-radius: 2px
  position: relative
  display: flex
  cursor: pointer
  border: 2px solid transparent
  color: $text
  word-break: break-all

  &:hover
    background-color: #fff
    color: $Blue60
    .url
      color: $Blue40
  &.selected
    background-color: $Blue40
    color: $darktext

    .url
      color: $darktext2
.text
  flex: 1
  /*display: flex*/

.title
  font-weight: bold
.url
  color: $Grey50
  font-size: .9em
  max-height: 2rem
  overflow: hidden
.source-icon
  opacity: .6
  img
    /*width: 12px*/
    /*height: 12px*/
  vertical-align: middle
</style>