<template lang="pug">
  input(type="text", ref='input', v-bind:value="displayvalue",
    v-on:input="update($event.target.value)")
</template>
<script>

import Vue from 'vue'

export default Vue.component('input-complete',
{
  props: ['value', 'completeTo'],
  data: function() { return {displayvalue: ''}},
  methods: {
    update: function(value)
    {
      this.$emit('input', value)
    },
    focus: function()
    {
      this.$refs.input.focus();
    },
    suggest: function(suggestion)
    {
      this.displayvalue = this.value;
      if(!suggestion || (this.oldval && this.value.length < this.oldval.length) || !suggestion.startsWith(this.value)) return;
      let realvalue = this.value;

      this.$refs.input.value = this.displayvalue = suggestion;
      this.$refs.input.setSelectionRange(realvalue.length, suggestion.length, "backward");
    }
  },

  watch: {
    value: function(value, oldVal) {
      this.oldval = oldVal;
      if(this.completeTo && value.length < this.completeTo.length) this.suggest(this.completeTo)
    },
    completeTo: function(suggestion)
    {
      if(suggestion) this.suggest(suggestion);
    }
  }

})

</script>
