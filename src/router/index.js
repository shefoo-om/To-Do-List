import DayView from '@/views/DayView.vue'
import HomeView from '@/views/HomeView.vue'
import WeekDetailView from '@/views/WeekDetailView.vue'
import AllWeeksView from '@/views/AllWeeksView.vue'
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
      path: '/weeks',
      name: 'all-weeks',
      component: AllWeeksView
    },
    {
      path: '/week/:weekId',
      name: 'week-detail',
      component: WeekDetailView,
      props: true
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
