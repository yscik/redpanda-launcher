
import 'file-loader?name=redpanda.content.js!./content';

import 'file!../index.html';
import 'file!../manifest.json';
import '../icons/fav-1.png';
import '../icons/redpanda-256.png'

import './helpers'
import Vue from 'vue'
import SearchApp from './app/SearchApp.vue'
import './app/icon.vue'
import './entry/favicon.vue'
import './app/message.vue'
import './entry/results.vue';

import {app, loadApp} from "./app/app";

window.focus();

(async () => {

  await loadApp();
  window.app = app;

  new Vue({
    el: '#app',
    render: h => h(SearchApp)
  });

})();
