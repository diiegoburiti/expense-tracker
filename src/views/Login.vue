<template>
  <section
    class="w-screen h-screen flex justify-content-center align-items-center bg-primary"
    :style="{
      background: 'linear-gradient(270deg, #4c3387, #8B5CF6)'
    }"
  >
    <div class="border-1 surface-border surface-card border-round p-6">
      <div class="flex align-items-center flex-column gap-3 mb-3">
        <div class="w-full mb-2">
          <span class="text-900 text-xl font-bold mb-2 block">Log in</span>
          <span class="text-400 font-medium"
            >Please enter your e-mail and password</span
          >
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
      ></Button>
    </div>
  </section>
</template>

<script setup>
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconField'
import InputIcon from 'primevue/inputIcon'
import { ref } from 'vue'
import Checkbox from 'primevue/checkbox'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const remember = ref('')
const router = useRouter()
const handleLogIn = () => {
  router.push({ name: 'Home' })
}
</script>
