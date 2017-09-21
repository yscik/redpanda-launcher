
import 'file!./content';
import 'file!../index.html';
import 'file!../manifest.json';
import 'file!../icons/redpanda-48.png';
import 'file!../icons/redpanda-256.png';

import Vue from 'vue'
import Search from './Search.vue'
import './icon.vue'
import './focus'

if(window.focused)
new Vue({
  el: '#app',
  render: h => h(Search)
});

