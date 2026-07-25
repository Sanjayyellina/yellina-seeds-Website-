import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { en } from './en.js'
import { hi } from './hi.js'
import { te } from './te.js'
import { mr } from './mr.js'
import { kn } from './kn.js'

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
]

const DICTS = { en, hi, te, mr, kn }
const STORAGE_KEY = 'yellina-lang'

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.some((l) => l.code === saved) ? saved : 'en'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  // t('a.b.c') looks up the key in the active language, falling back to
  // English (and finally the key path itself) so a missing translation
  // never renders as blank — worst case it silently shows English.
  const t = useMemo(() => {
    return (path, ...args) => {
      const active = getByPath(DICTS[lang], path)
      const fallback = getByPath(en, path)
      const value = active !== undefined ? active : fallback
      if (typeof value === 'function') return value(...args)
      if (value === undefined) return path
      return value
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider')
  return ctx
}
