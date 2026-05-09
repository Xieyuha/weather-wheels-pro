import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/element.css' // Global Overrides for Element Plus
import App from './App.vue'
import router from './router'
import './styles/variables.css';
import './styles/main.css'
import 'virtual:svg-icons-register';
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.mount('#app')
