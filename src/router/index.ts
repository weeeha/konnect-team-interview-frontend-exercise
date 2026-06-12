import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/PageHome.vue'),
    },
    {
      path: '/services/:id',
      name: 'service-detail',
      component: () => import('../views/PageServiceDetail.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/PageNotFound.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

export default router
