import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)

app.config.globalProperties.$toPage = (path: string) => {
  router.push({ path })
}

app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
