<template lang="pug">
  input(type="text", ref='input', v-bind:value="displayvalue",
    v-on:input="update($event.target.value)")
</template>
<script>

import Vue from 'vue'

const DEBOUNCE_DELAY = 100;
const DEBOUNCE_LIMIT = 300;

export default Vue.component('input-complete',
{
  props: ['value', 'completeTo'],
  data: function() { return {displayvalue: ''}},
  created() {
    this.lastEmit = 0;
    this.debouncing = null;
  },
  methods: {
    update: function(value)
    {
      this.debounce(() => this.$emit('input', value))
    },
    debounce(fn) {
      let t = performance.now(),
          delay = true;
      if(t - this.lastEmit > DEBOUNCE_LIMIT) delay = false;

      const callFn = () => {
        fn();
        this.lastEmit = t;
      };

      if (this.debouncing) clearTimeout(this.debouncing);
      if(delay) this.debouncing = setTimeout(callFn, DEBOUNCE_DELAY);
      else callFn();
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
