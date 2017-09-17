
import 'file-loader?name=[name].[ext]!./focus';
import Vue from 'vue'
import Search from './Search.vue'
import './icon.vue'

if(window.focused)
new Vue({
  el: '#app',
  render: h => h(Search)
});

