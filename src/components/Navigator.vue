<template>
  <div
    class="flex justify-content-between px-4 py-1 border-1 border-solid surface-border bg-white"
  >
    <div class="flex align-items-center gap-2">
      <i class="pi pi-money-bill" style="font-size: 2rem" />
      <h3>Expen$e Tracker</h3>
    </div>

    <div class="">
      <ul class="flex gap-4">
        <router-link
          class="no-underline text-900 font-bold"
          :to="{ name: 'home' }"
          >Home</router-link
        >
        <router-link
          class="no-underline text-900 font-bold"
          :to="{ name: 'about-us' }"
          >About Us</router-link
        >
        <router-link
          v-if="!user"
          class="no-underline text-900 font-bold"
          :to="{ name: 'login' }"
          >Login</router-link
        >

        <li
          v-if="user"
          @click="logout"
          class="list-none cursor-pointer text-900 font-bold"
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
