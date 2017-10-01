
import 'file!./content';
import 'file!../index.html';
import 'file!../manifest.json';
import '../icons/fav-1.png';

import Vue from 'vue'
import App from './app.vue'
import './icon.vue'
import './favicon.vue'

window.focus();

new Vue({
  el: '#app',
  render: h => h(App)
});

