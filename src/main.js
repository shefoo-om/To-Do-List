import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import your styles
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Initialize theme when app starts
app.mount('#app')

// Load theme after mounting
import { useThemeStore } from './stores/theme.js'
const themeStore = useThemeStore()
themeStore.loadTheme()
