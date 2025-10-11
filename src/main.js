import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import { createPinia } from 'pinia'
import SendifyPreset from './theme/sendifyPreset.js'
import router from './router/index.js'
import i18n from './i18n.js'
import App from './App.vue'

import 'primeicons/primeicons.css'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: SendifyPreset,
  },
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
