<template>
  <div class="card">
    <Menubar :model="navigationItems" class="flex justify-content-between">
      <template #start>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-money-bill" style="font-size: 2rem" />
          <h3 class="">Expen$e Tracker</h3>
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
            <span class="ml-2 font-bold">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const navigationItems = ref([
  {
    label: 'Home',
    route: '/'
  },
  {
    label: 'About Us',
    route: 'about-us'
  },
  {
    label: 'Login',
    route: '/login'
  }
])
</script>
