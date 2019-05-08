
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
import {settings} from "./app/state";

import {app, loadApp} from "./app/app";
import {isNight, setNightmode} from "./helpers.js";

window.focus();
setNightmode(isNight())

(async () => {

  await loadApp();
  window.app = app;
  if(settings.focusHack && !document.hasFocus()) return focusHack();

  new Vue({
    el: '#app',
    render: h => h(SearchApp)
  });

})();

async function focusHack () {
  const URL = location.href;
  const tab = await browser.tabs.getCurrent();
  browser.tabs.create({url: URL});
  browser.tabs.remove(tab.id);
};