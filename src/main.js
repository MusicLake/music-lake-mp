import Vue from "vue";
import App from "./App";
import http from "./utils/http";
import message from "./utils/message";
import musicApi from "./utils/music-api";
import store from './store'
import util from './utils'
import '../static/iconfont.css'

Vue.$message = Vue.prototype.$message = message;
Vue.$http = Vue.prototype.$http = http;
Vue.$musicApi = Vue.prototype.$musicApi = musicApi;
Vue.$util = Vue.prototype.$util = util;
Vue.config.productionTip = false;
App.mpType = "app";

const app = new Vue({
  store,
  ...App
});
Vue.$store = Vue.prototype.$store = store
app.$mount();
