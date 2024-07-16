<template>
  <Navigator />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { supabase } from '@/supabase'
import { methods } from '@/store'
import Navigator from '@/components/Navigator.vue'

supabase.auth.onAuthStateChange((_, session) => {
  methods.setUser(session)
})

onMounted(() => {
  supabase.auth.onAuthStateChange((_, session) => {
    methods.setUser(session)
  })
})
</script>
