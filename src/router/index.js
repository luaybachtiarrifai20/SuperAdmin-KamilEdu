import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'schools',
          name: 'schools',
          component: () => import('../views/schools/SchoolListView.vue')
        },
        {
          path: 'schools/create',
          name: 'schools-create',
          component: () => import('../views/schools/SchoolFormView.vue')
        },
        {
          path: 'schools/:id/edit',
          name: 'schools-edit',
          component: () => import('../views/schools/SchoolFormView.vue')
        },
        {
          path: 'schools/:id',
          name: 'school-detail',
          component: () => import('../views/schools/SchoolDetailView.vue')
        },
        {
          path: 'schools/:id/admins',
          name: 'school-admins',
          component: () => import('../views/schools/admins/SchoolAdminListView.vue')
        },
        {
          path: 'schools/:id/admins/create',
          name: 'school-admins-create',
          component: () => import('../views/schools/admins/SchoolAdminFormView.vue')
        },
        // More routes will be added
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
