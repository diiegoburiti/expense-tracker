import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'
import '/node_modules/primeflex/primeflex.css'
import './style.css'
import router from './router'

const app = createApp(App)

app.use(PrimeVue, {})
app.use(router)
app.mount('#app')
