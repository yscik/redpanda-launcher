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
//      this.displayvalue = value;
      this.$emit('input', value)
    },
    suggest: function(suggestion)
    {
      this.displayvalue = this.value;
      if(!suggestion || !this.value || !suggestion.startsWith(this.value.toLowerCase())) return;
      let realvalue = this.value;

      this.$refs.input.value = this.displayvalue = this.value + suggestion.substr(this.value.length);
      this.$refs.input.setSelectionRange(realvalue.length, suggestion.length, "backward");
    }
  },

  watch: {
    value: function(value) {
      this.displayvalue = value;
      if(this.completeTo && value.length < this.completeTo.length) this.suggest(this.completeTo)
    },
    completeTo: function(suggestion)
    {
      this.suggest(suggestion);
    }
  }

})

</script>
