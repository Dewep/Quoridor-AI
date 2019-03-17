import Vue from 'vue'
import App from './app.vue'

const router = require('./router')
const store = require('./store')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
