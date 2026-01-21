import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
import vue3GoogleLogin from 'vue3-google-login'
// Client ID found in Flutter app (login_screen.dart)
const GOOGLE_CLIENT_ID = '631663251271-q5fmm1j2r4hko6fkicn5mml5vt8r3cnb.apps.googleusercontent.com' 
app.use(vue3GoogleLogin, {
  clientId: GOOGLE_CLIENT_ID
})

app.mount('#app')
