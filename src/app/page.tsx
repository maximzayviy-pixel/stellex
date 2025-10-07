'use client'

import { AuthProvider } from '@/components/AuthProvider'
import BankingApp from '@/components/BankingApp'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Инициализируем Telegram Web App
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      console.log('Initializing Telegram WebApp...')
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
      console.log('Telegram WebApp initialized')
    } else {
      console.log('Telegram WebApp not available')
    }
  }, [])

  return (
    <AuthProvider>
      <BankingApp />
    </AuthProvider>
  )
}