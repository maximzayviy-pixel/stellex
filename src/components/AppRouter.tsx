'use client'

import React, { useState, useEffect } from 'react'
import LandingPage from './LandingPage'

export default function AppRouter() {
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram WebApp
    const checkTelegramWebApp = () => {
      if (typeof window !== 'undefined') {
        // Проверяем наличие Telegram WebApp API
        if (window.Telegram?.WebApp) {
          setIsTelegramWebApp(true)
          console.log('Telegram WebApp detected - redirecting to app')
          // Перенаправляем на приложение
          window.location.href = '/app'
        } else {
          setIsTelegramWebApp(false)
          console.log('Regular web browser detected - showing landing page')
        }
      }
      setIsChecking(false)
    }

    checkTelegramWebApp()
  }, [])

  // Показываем загрузку пока проверяем источник
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Если пользователь из Telegram WebApp - перенаправляем на приложение
  if (isTelegramWebApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Перенаправление в приложение...</p>
        </div>
      </div>
    )
  }

  // Если пользователь не из Telegram - показываем лендинг
  return <LandingPage />
}
