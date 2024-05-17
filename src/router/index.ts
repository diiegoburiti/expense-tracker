import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import LoginView from '@/views/Login.vue'
import AccountDetail from '@/views/AccountDetail.vue'
import { supabase } from '@/supababse'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', name: 'home', component: HomeView },
    { path: '/expense/:id', name: 'account-detail', component: AccountDetail }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()

  if (to.name !== 'login' && !data.session) next({ name: 'login' })
  else next()
})

export default router
