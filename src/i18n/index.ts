import { createI18n } from 'vue-i18n'

import vi from './vi'

const defaultLang: string = 'vi'
const messages = {
  vi,
}

const i18n = createI18n({
  legacy: false,
  locale: defaultLang,
  fallbackLocale: defaultLang,
  globalInjection: true,
  messages,
})

export default i18n
