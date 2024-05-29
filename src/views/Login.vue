<template>
  <section
    class="h-screen flex justify-content-center align-items-center bg-primary"
    :style="{
      background: 'linear-gradient(270deg, #4c3387, #8B5CF6)'
    }"
  >
    <Toast />
    <div class="border-1 surface-border surface-card border-round p-6">
      <div class="flex align-items-center flex-column gap-3 mb-3">
        <div class="w-full mb-2">
          <span class="text-900 text-xl font-bold mb-2 block">Log in</span>
          <span class="text-800">Please enter your e-mail and password</span>
        </div>
        <IconField iconPosition="left" class="w-full">
          <InputIcon class="pi pi-envelope"> </InputIcon>
          <InputText class="w-full" v-model="email" placeholder="E-mail" />
        </IconField>
        <IconField iconPosition="left" class="w-full">
          <InputIcon class="pi pi-lock"> </InputIcon>
          <InputText
            class="w-full"
            v-model="password"
            placeholder="Password"
            type="password"
          />
        </IconField>
      </div>

      <div class="flex align-items-center justify-content-between mb-3">
        <div class="flex align-items-center">
          <Checkbox
            v-model="remember"
            inputId="remember-me"
            name="remember"
            value="remember"
            binary
          />
          <label for="remember-me" class="ml-2 text-color text-sm"
            >Remember Me</label
          >
        </div>
        <Button link label="Reset Password" class="font-color text-sm p-0" />
      </div>

      <Button
        class="w-full"
        type="button"
        label="Log In"
        @click="handleLogIn"
        :disabled="disableButton"
      ></Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supababse'
import { useToast } from 'primevue/usetoast'

const email = ref('')
const password = ref('')
const remember = ref('')
const router = useRouter()

const toast = useToast()

const disableButton = computed(() => !email.value || !password.value)

const handleLogIn = async () => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      return toast.add({
        severity: 'error',
        summary: 'Ops!',
        detail: error.message,
        life: 3000
      })
    }
    return router.push({ name: 'home' })
  } catch (error) {
    console.error(error)
  }
}
</script>

<style></style>
