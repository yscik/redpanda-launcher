
import 'file-loader?name=redpanda.content.js!./content';
import 'file-loader?name=worker.js!./worker';

import 'file!../index.html';
import 'file!../manifest.json';
import '../icons/fav-1.png';
import '../icons/redpanda-256.png'

import './helpers'
import Vue from 'vue'
import App from './app.vue'
import './icon.vue'
import './favicon.vue'
import './message.vue'
import './settings'

window.focus();
window.radio = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
});

