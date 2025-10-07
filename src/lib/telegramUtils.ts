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
  return typeof window !== 'undefined' && 
         window.Telegram && 
         window.Telegram.WebApp &&
         window.Telegram.WebApp.initDataUnsafe
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
