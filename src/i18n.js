import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'

export const LOCALE_STORAGE_KEY = 'sendify_locale'
export const SUPPORTED_LOCALES = ['es', 'en']

function resolveInitialLocale() {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && SUPPORTED_LOCALES.includes(stored)) {
      return stored
    }
    const navigatorLang = window.navigator.language?.slice(0, 2).toLowerCase()
    if (navigatorLang && SUPPORTED_LOCALES.includes(navigatorLang)) {
      return navigatorLang
    }
  }
  return 'es'
}

const messages = { en, es }

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: resolveInitialLocale(),
  fallbackLocale: 'en',
  messages,
})

export default i18n
