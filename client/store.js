import Vue from 'vue'
import Vuex from 'vuex'

const moduleAuth = require('./modules/auth')
const moduleGames = require('./modules/games')
const pluginWs = require('./plugins/ws')

Vue.use(Vuex)

module.exports = new Vuex.Store({
  modules: {
    auth: moduleAuth,
    games: moduleGames
  },
  plugins: [
    pluginWs
  ],
  strict: true
})
