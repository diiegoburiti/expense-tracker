<template>
  <div
    class="flex align-items-center justify-content-between px-2 py-1 border-1 border-solid surface-border bg-white sm:px-5"
  >
    <div class="flex align-items-center flex-1 gap-2">
      <i class="pi pi-money-bill text-2xl sm:text-4xl" />
      <h3 class="m-0 text-sm sm:text-base">Expen$e Tracker</h3>
    </div>

    <div class="">
      <ul class="flex gap-4">
        <router-link
          class="no-underline text-900 font-bold text-sm sm:text-base"
          :to="{ name: 'home' }"
          >Home</router-link
        >
        <router-link
          class="no-underline text-900 font-bold text-sm sm:text-base"
          :to="{ name: 'about-us' }"
          >About Us</router-link
        >
        <router-link
          v-if="!user"
          class="no-underline text-900 font-bold text-sm sm:text-base"
          :to="{ name: 'login' }"
          >Login</router-link
        >

        <li
          v-if="user"
          @click="logout"
          class="list-none cursor-pointer text-900 font-bold text-sm sm:text-base"
        >
          Log out
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { state } from '@/store'

const router = useRouter()

const user = computed(() => state.user)

const logout = () => {
  supabase.auth.signOut()
  router.push({ name: 'login' })
}
</script>
