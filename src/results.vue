<template lang="pug">
  .entries
    a.entry(v-for="(entry, index) in entries", :key="index",
    :href="entry.url",
    @click="open(entry)",
    :class="{selected: entry.selected}")
      .icons
        icon.favicon(:site='entry.urlo')
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
    props: ['entries'],
//    components: {entry},
    methods: {
      open: Entry.open
    }
  }

</script>
<style lang="sass">
.entry
  padding: .4em
  text-decoration: none
  border-radius: 3px
  position: relative
  display: flex
  cursor: pointer
  border: 2px solid transparent
  color: #333
  &:hover
    background-color: #fafafa
    color: #0060df
  &.selected
    background-color: #fff
    color: #0060df
.text
  flex: 1
  /*display: flex*/

.title
  font-weight: bold
.url
  color: #737373
  font-size: .9em

.source-icon
  opacity: .6
  img
    /*width: 12px*/
    /*height: 12px*/
  vertical-align: middle
</style>