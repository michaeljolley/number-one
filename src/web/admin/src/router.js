import VueRouter from 'vue-router';

import Home from '@/views/Index'

import gameRoutes from '@/views/games/router'
import adminRoutes from '@/views/admin/router'

export default new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home
    },
    gameRoutes,
    adminRoutes
  ]
})
