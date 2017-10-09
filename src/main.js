
import 'file-loader?name=redpanda.content.js!./content';
import 'file!../index.html';
import 'file!../manifest.json';
import '../icons/fav-1.png';

import './helpers'
import Vue from 'vue'
import App from './app.vue'
import './icon.vue'
import './favicon.vue'
import './settings'

window.focus();
window.radio = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
});

