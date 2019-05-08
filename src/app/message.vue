<template lang="pug">
.message(:class="{active, fresh}" v-if="action")
  .message-body
    icon.message-icon(:type="action.icon" v-if="action.icon")
    favicon.message-favicon(:site="action.favicon" v-if="action.favicon")
    span.message-text {{action.message}}
    span.message-node(ref="messageNode")
  .button.undo(@click="action.undo()" v-show="action.undo") Undo
</template>

<script>

import Vue from 'vue'
const e = document.createElement.bind(document);

export default Vue.component('message',
{
  props: {action: {default: () => {} }},
  data: () => ({
    active: false,
    fresh: false
  }),
  watch: {
    action(action)
    {
      let node = this.$refs.messageNode;
      if(!node) return;

      while(node.firstChild) node.removeChild(node.firstChild);

      let clear = () => this.action == action && (this.active = false);
      let decay = () => this.action == action && (this.fresh = false);

      if(action.undo) {
        let undo = action.undo;
        action.undo = () => {undo(); clear(); }
      }

      this.active = true;
      if(this.fresh = action.fresh) setTimeout(decay, 1000);
      setTimeout(clear, 5000);
      if(action.html) node.appendChild(this.createNode(action.html));

    },
  },
  methods: {

    createNode(html)
    {
      let actionNode =  e('span');
      html.forEach(item => {
        if(item instanceof Array) {
          let el = e(item[0]);
          el.innerText = item[1];
          actionNode.appendChild(el)
        }
        else actionNode.appendChild(document.createTextNode(item))
      });

      return actionNode;
    }
  }
});
</script>

<style lang="sass">
@import "vars"
.message
  position: fixed
  right: 2rem
  bottom: 1rem
  width: 30rem
  min-height: 3rem
  padding: .5rem
  background: var(--Grey20)
  color: var(--text)
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
    fill: var(--Blue50)
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