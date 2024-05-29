/* eslint-disable vue/no-reserved-component-names */
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Menubar from 'primevue/menubar'
import IconField from 'primevue/iconField'
import InputIcon from 'primevue/inputIcon'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import Calendar from 'primevue/calendar'

import App from './App.vue'
import router from './router'

import 'primevue/resources/themes/aura-light-purple/theme.css'
import 'primeicons/primeicons.css'
import '/node_modules/primeflex/primeflex.css'
import './style.css'

const app = createApp(App)

app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(router)

app.component('Menubar', Menubar)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('Dropdown', Dropdown)
app.component('InputNumber', InputNumber)
app.component('Toast', Toast)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('Checkbox', Checkbox)
app.component('Card', Card)
app.component('Skeleton', Skeleton)
app.component('Calendar', Calendar)

app.mount('#app')
