import DayView from '@/views/DayView.vue'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/day/:dayId',
      name: 'day',
      component: DayView,
      props: true
    },
  ],
})

export default router
