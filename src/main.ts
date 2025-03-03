import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus, { ElNotification } from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import http from './http'

const app = createApp(App)

app.config.globalProperties.$toPage = (path: string) => {
  router.push({ path })
}

export enum INotificationType {
  success = 'success',
  error = 'error',
  warning = 'warning',
}

app.config.globalProperties.$notification = (type: INotificationType, message: string) => {
  ElNotification[type]({
    message,
    showClose: true,
    duration: 3000,
    customClass:
      type == INotificationType.success
        ? 'success-notify'
        : type == INotificationType.error
          ? 'error-notify'
          : 'warning-notify',
  })
}

app.config.globalProperties.$http = (type: 'POST' | 'GET', url: string, data) => {
  return http({ type, data, url })
}

app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
