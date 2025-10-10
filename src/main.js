import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import './assets/main.css'

const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: false,
  closeButton: 'button',
  icon: false,
  rtl: false,
  transition: "Vue-Toastification__slideBlurred",
  maxToasts: 20,
  newestOnTop: true
}

function loadColorsOnStartup() {
  const saved = localStorage.getItem('custom-primary-colors')
  if (saved) {
    try {
      const colors = JSON.parse(saved)
      document.documentElement.style.setProperty('--primary-color', colors.primary)
      document.documentElement.style.setProperty('--primary-hover', colors.hover)
    } catch (e) {
      console.error('Failed to load colors:', e)
    }
  }
}

loadColorsOnStartup()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)
app.mount('#app')

import { useThemeStore } from './stores/theme.js'
const themeStore = useThemeStore()
themeStore.loadTheme()