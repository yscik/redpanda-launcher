<template lang='pug'>
.transforms
  h3.title Search transformations
  //.help
  .headers
    span.transform-trigger Trigger
    span.transform-action Action
  .box
    .row.transform(v-for="transform in settings")
      .cell.transform-trigger
        select.input(v-model="transform.type" )
          option Engine
          option Term

        input.input(v-model="transform.pattern" type="text")
      .cell.transform-action
        select.input(v-model="transform.type" )
        input.input(v-model="transform.append" type="text")
      .remove.action(@click='settings.remove(transform)')
        icon(type="close")
    .row
    .button.add-transform(@click="settings.unshift({pattern: '', append: ''})")
      icon(type='add') 

</template>
<script>
export default {
  props: {settings: {}}  
}

</script>
<style lang="sass" scoped>
@import "../app/colors"
.transforms
  position: relative
  .box
    /*border: none*/
    background: $Grey10
    height: auto
    min-height: 5rem
    max-height: 15rem
  .add-transform

  .headers
    padding: 0 .5rem
  .row
    align-items: center
  .cell
    display: flex
    + .cell
      margin-left: .5em
    select
      flex: 1
    input
      flex: 3
  .action
    margin-left: .5rem
  input[type='text']
    padding: .4em
    border-radius: 0
  .transform-trigger
    margin-right: -1px
    flex: 2
  .transform-action
    flex: 3

  h3
    margin-right: 3rem

</style>