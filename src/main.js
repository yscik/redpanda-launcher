
import 'file-loader?name=[name].[ext]!./content';
import Vue from 'vue'
import Search from './Search.vue'
import './icon.vue'
import './focus'

if(window.focused)
new Vue({
  el: '#app',
  render: h => h(Search)
});

