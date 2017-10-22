
import 'file-loader?name=redpanda.content.js!./content';

import 'file!../index.html';
import 'file!../manifest.json';
import '../icons/fav-1.png';
import '../icons/redpanda-256.png'

import './helpers'
import Vue from 'vue'
import App from './app/app.vue'
import './app/icon.vue'
import './entry/favicon.vue'
import './app/message.vue'
import settings from './data/settings'
import './entry/results.vue';
import './data/Storage';

window.focus();
window.radio = new Vue();
(async () => {
  window.background = await browser.runtime.getBackgroundPage()
  await settings.promise
  new Vue({
    el: '#app',
    render: h => h(App)
  });

})();
