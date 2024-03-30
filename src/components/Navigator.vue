<template>
  <div class="card">
    <Menubar :model="navigationItems" class="flex justify-content-between">
      <template #start>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-money-bill" style="font-size: 2rem" />
          <h3 class="">Expense Tracker</h3>
        </div>
      </template>
      <template #item="{ item, props }">
        <router-link v-slot="{ href, navigate }" :to="item.route" custom>
          <a
            class="flex align-items-center"
            :href="href"
            v-bind="props.action"
            @click="navigate"
          >
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import Menubar from 'primevue/menubar'
import { ref } from 'vue'

const navigationItems = ref([
  {
    label: 'Home',
    route: '/'
  },
  {
    label: 'Login',
    route: 'login'
  },
  {
    label: 'Sign Up',
    route: 'sign-up'
  },
  {
    label: 'About Us',
    route: 'about-us'
  }
])
</script>
