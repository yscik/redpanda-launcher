<template lang="pug">
  .nightmode-toggle.icon-button(@click="toggle()", :class="{active: night}")
    icon(type='nightmode')

</template>
<script>

  import {settings} from '../app/state';
  import {settingsService} from "./app";
  import {isNight, setNightmode} from "../helpers.js";

  export default {
    data: () => ({
      night: isNight(),
    }),
    created() {
      this.apply();
    },
    methods: {
      toggle() {
        this.night = settings.night = !this.night;

        this.apply()
      },
      apply() {
        setNightmode(!!this.night)
      }
    }

  }


</script>

<style lang="sass">
@import "vars"
@import "nightmode"

.nightmode-toggle
  position: absolute
  top: $head-height / 2
  margin-top: -1.5rem
  right: 6rem
  z-index: 1
  &:not(.active):not(:hover):not(:focus)
    opacity: .3
  &.active
    svg path
      fill: #ffad4b


</style>