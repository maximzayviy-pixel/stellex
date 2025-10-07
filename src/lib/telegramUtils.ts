import { TelegramWebAppUser } from '@/types'

export function getTelegramWebAppData(): TelegramWebAppUser | null {
  if (typeof window === 'undefined') {
    console.log('Window is undefined (server-side)')
    return null
  }
  
  // Проверяем, что мы в Telegram Web App
  if (!window.Telegram?.WebApp) {
    console.log('Telegram WebApp not available')
    return null
  }
  
  const tg = window.Telegram.WebApp
  const user = tg.initDataUnsafe?.user
  
  if (!user) {
    console.log('No user data in Telegram WebApp')
    return null
  }
  
  console.log('Telegram user data found:', user)
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    language_code: user.language_code,
    is_premium: user.is_premium
  }
}

export function isTelegramWebApp(): boolean {
  if (typeof window === 'undefined') {
    console.log('isTelegramWebApp: window is undefined (server-side)')
    return false
  }
  
  // Проверяем наличие Telegram WebApp объекта
  const hasTelegram = window.Telegram && window.Telegram.WebApp
  
  console.log('isTelegramWebApp: hasTelegram =', hasTelegram)
  
  if (!hasTelegram) {
    console.log('isTelegramWebApp: Telegram WebApp not found')
    return false
  }
  
  // Дополнительные проверки для Telegram Web App
  const tg = window.Telegram.WebApp
  
  console.log('isTelegramWebApp: tg object =', {
    initDataUnsafe: tg.initDataUnsafe,
    initData: tg.initData,
    platform: tg.platform,
    version: tg.version
  })
  
  // Проверяем, что это действительно Telegram Web App
  const isTelegram = !!(tg && 
    (tg.initDataUnsafe !== undefined || 
     tg.initData !== undefined ||
     tg.platform !== undefined ||
     tg.version !== undefined))
  
  console.log('isTelegramWebApp: result =', isTelegram)
  return isTelegram
}

// Функция для ожидания загрузки Telegram WebApp
export function waitForTelegramWebApp(timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    // Если уже загружен
    if (window.Telegram?.WebApp) {
      console.log('Telegram WebApp already available')
      resolve(true)
      return
    }

    let attempts = 0
    const maxAttempts = timeout / 100

    const checkInterval = setInterval(() => {
      attempts++
      
      if (window.Telegram?.WebApp) {
        console.log('Telegram WebApp loaded after', attempts * 100, 'ms')
        clearInterval(checkInterval)
        resolve(true)
      } else if (attempts >= maxAttempts) {
        console.log('Telegram WebApp timeout after', timeout, 'ms')
        clearInterval(checkInterval)
        resolve(false)
      }
    }, 100)
  })
}

export function showTelegramAlert(message: string): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message)
  } else {
    alert(message)
  }
}

export function showTelegramConfirm(message: string, callback: (confirmed: boolean) => void): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.showConfirm(message, callback)
  } else {
    const confirmed = confirm(message)
    callback(confirmed)
  }
}

export function closeTelegramWebApp(): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.close()
  }
}

export function expandTelegramWebApp(): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand()
  }
}

export function setTelegramMainButton(text: string, onClick: () => void): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.MainButton.setText(text)
    window.Telegram.WebApp.MainButton.onClick(onClick)
    window.Telegram.WebApp.MainButton.show()
  }
}

export function hideTelegramMainButton(): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.MainButton.hide()
  }
}

export function setTelegramBackButton(onClick: () => void): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.BackButton.onClick(onClick)
    window.Telegram.WebApp.BackButton.show()
  }
}

export function hideTelegramBackButton(): void {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.BackButton.hide()
  }
}

// Расширяем типы для TypeScript
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe?: {
          user?: TelegramWebAppUser
        }
        showAlert: (message: string) => void
        showConfirm: (message: string, callback: (confirmed: boolean) => void) => void
        close: () => void
        expand: () => void
        MainButton: {
          setText: (text: string) => void
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }
        BackButton: {
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }
      }
    }
  }
}
