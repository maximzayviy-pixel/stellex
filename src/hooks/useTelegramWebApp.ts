'use client'

import { useEffect, useState } from 'react'

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
      is_premium?: boolean
    }
  }
  initData: string
  platform: string
  version: string
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
  }
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showPopup: (params: any, callback?: (buttonId: string) => void) => void
  showScanQrPopup: (params: any, callback?: (text: string) => void) => void
  closeScanQrPopup: () => void
  readTextFromClipboard: (callback?: (text: string) => void) => void
  requestWriteAccess: (callback?: (granted: boolean) => void) => void
  requestContact: (callback?: (granted: boolean, contact?: any) => void) => void
  sendData: (data: string) => void
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void
  openTelegramLink: (url: string) => void
  openInvoice: (url: string, callback?: (status: string) => void) => void
}

interface UseTelegramWebAppReturn {
  webApp: TelegramWebApp | null
  isReady: boolean
  isTelegramWebApp: boolean
  user: TelegramWebApp['initDataUnsafe']['user'] | null
  initData: string
  platform: string
  version: string
  colorScheme: 'light' | 'dark'
  themeParams: TelegramWebApp['themeParams']
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export function useTelegramWebApp(): UseTelegramWebAppReturn {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false)

  useEffect(() => {
    const checkTelegramWebApp = () => {
      console.log('Checking for Telegram WebApp...')
      
      if (typeof window === 'undefined') {
        console.log('Window is undefined (SSR)')
        return
      }

      // Проверяем наличие Telegram WebApp
      if (!window.Telegram?.WebApp) {
        console.log('Telegram WebApp not found')
        setIsTelegramWebApp(false)
        return
      }

      const tg = window.Telegram.WebApp
      console.log('Telegram WebApp found:', {
        platform: tg.platform,
        version: tg.version,
        initData: tg.initData,
        initDataUnsafe: tg.initDataUnsafe,
        colorScheme: tg.colorScheme
      })

      // Инициализируем WebApp
      tg.ready()
      tg.expand()
      
      setWebApp(tg)
      setIsTelegramWebApp(true)
      setIsReady(true)
      
      console.log('Telegram WebApp initialized successfully')
    }

    // Проверяем сразу
    checkTelegramWebApp()

    // Также проверяем через небольшую задержку на случай, если скрипт загружается асинхронно
    const timeoutId = setTimeout(checkTelegramWebApp, 1000)

    // Слушаем событие загрузки скрипта
    const script = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js"]')
    if (script) {
      script.addEventListener('load', checkTelegramWebApp)
    }

    return () => {
      clearTimeout(timeoutId)
      if (script) {
        script.removeEventListener('load', checkTelegramWebApp)
      }
    }
  }, [])

  return {
    webApp,
    isReady,
    isTelegramWebApp,
    user: webApp?.initDataUnsafe?.user || null,
    initData: webApp?.initData || '',
    platform: webApp?.platform || '',
    version: webApp?.version || '',
    colorScheme: webApp?.colorScheme || 'light',
    themeParams: webApp?.themeParams || {}
  }
}
