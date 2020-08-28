import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Recorder from '@/views/Recorder.vue'
import authGuard from '@/plugins/auth/authGuard'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/recorder',
    beforeEnter: authGuard,
    name: 'recorder',
    component: Recorder
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
