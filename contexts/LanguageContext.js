'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext({ lang: 'hi', toggleLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('hi')

  useEffect(() => {
    const saved = localStorage.getItem('yojana_lang')
    if (saved) setLang(saved)
  }, [])

  function toggleLang() {
    const next = lang === 'hi' ? 'en' : 'hi'
    setLang(next)
    localStorage.setItem('yojana_lang', next)
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
