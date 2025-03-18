import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/card/:id',
      name: 'card-details',
      component: () => import('@/views/CardDetails.vue'),
      props: true,
    },
  ],
})

export default router
