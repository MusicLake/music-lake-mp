import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
