import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'base-setting',
      component: () => import('../views/BaseSetiings.vue'),
    },
    {
      path: '/web-manage',
      name: 'web-manage',
      component: () => import('../views/WebManage.vue'),
    },
  ],
})

export default router
