import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/home.vue'
import Viewer from './views/viewer.vue'

Vue.use(Router)

module.exports = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/viewer/:slug',
      name: 'viewer',
      component: Viewer
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "viewer" */ './views/viewer.vue')
    }
  ]
})
