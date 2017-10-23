<template lang="pug">
.message(:class="{active: action.active, fresh: action.fresh}")
  .message-body
    icon.message-icon(:type="action.icon" v-if="action.icon")
    favicon.message-favicon(:site="action.favicon" v-if="action.favicon")
    span.message-text {{action.message}}
    span.message-node(ref="messageNode")
  .button.undo(@click="action.undo()" v-show="action.undo") Undo
</template>

<script>

import Vue from 'vue'

export default Vue.component('message',
{
  props: {action: {default: () => {} }},
  watch: {
    action(action)
    {
      console.log(action);
      let node = this.$refs.messageNode;
      if(!node) return;
      while(node.firstChild) node.removeChild(node.firstChild);
      if(action.node) {
        node.appendChild(action.node);
      }
    },
  }
});
</script>

<style lang="sass">
@import "./colors"
.message
  position: fixed
  right: 2rem
  bottom: 1rem
  width: 30rem
  min-height: 3rem
  padding: .5rem
  background: $Grey20
  color: $text
  border-radius: 2px
  display: flex
  align-items: center
  justify-content: space-between
  * + *
    margin-left: .5em
  .message-body
    display: flex
    justify-content: flex-start
    * + *
      margin-left: .3em
  transition: bottom .5s
  .icon path
    fill: $Blue50
  &.fresh
    animation: .5s flash-message
  &:not(.active)
    bottom: -3rem

  .message-text:empty, .message-node:empty
    display: none


@keyframes flash-message
  0%
    bottom: 1rem
  30%
    bottom: 0rem
  //75%    bottom: .5rem
  100%
    bottom: 1rem


</style>