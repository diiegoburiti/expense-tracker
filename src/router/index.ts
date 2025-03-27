import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import LoginView from '@/views/Login.vue'
import AccountDetailView from '@/views/AccountDetail.vue'
import AboutUsView from '@/views/AboutUs.vue'
import { supabase } from '@/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Login',
        auth: false
      }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home',
        auth: true
      }
    },
    {
      path: '/expense/:id',
      name: 'account-detail',
      component: AccountDetailView,
      meta: {
        title: 'Account Detail',
        auth: true
      }
    },
    {
      path: '/about-us',
      name: 'about-us',
      component: AboutUsView,
      meta: {
        title: 'About Us',
        auth: false
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `Expense Tracker | ${to.meta.title}`
  next()
})

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()

  if (!!to.meta.auth && !data.session) next({ name: 'login' })
  else next()
})

export default router
