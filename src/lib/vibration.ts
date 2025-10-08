import { initHapticFeedback } from '@telegram-apps/sdk'

// Инициализируем Telegram Haptic Feedback
let hapticFeedback: any = null

// Инициализация вибрации
export const initVibration = () => {
  try {
    hapticFeedback = initHapticFeedback()
    console.log('Telegram Haptic Feedback initialized')
  } catch (error) {
    console.warn('Failed to initialize Telegram Haptic Feedback:', error)
    hapticFeedback = null
  }
}

// Виброотклик для Telegram Mini Apps
export const vibrate = (type: 'tap' | 'success' | 'error' | 'warning' | 'selection' = 'tap') => {
  if (!hapticFeedback) {
    // Fallback на стандартную вибрацию браузера
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        const patterns = {
          tap: 50,
          success: [100, 50, 100],
          error: [200, 100, 200],
          warning: [100, 50, 100, 50, 100],
          selection: 30
        }
        navigator.vibrate(patterns[type])
        console.log('Fallback vibration triggered:', type)
      } catch (error) {
        console.warn('Fallback vibration not supported:', error)
      }
    }
    return
  }

  try {
    switch (type) {
      case 'tap':
        hapticFeedback.impactOccurred('light')
        break
      case 'success':
        hapticFeedback.notificationOccurred('success')
        break
      case 'error':
        hapticFeedback.notificationOccurred('error')
        break
      case 'warning':
        hapticFeedback.notificationOccurred('warning')
        break
      case 'selection':
        hapticFeedback.selectionChanged()
        break
      default:
        hapticFeedback.impactOccurred('light')
    }
    console.log('Telegram haptic feedback triggered:', type)
  } catch (error) {
    console.warn('Telegram haptic feedback failed:', error)
  }
}

// Предустановленные паттерны вибрации (для совместимости)
export const vibrationPatterns = {
  // Короткий отклик для кнопок
  tap: 'tap' as const,
  // Успешные операции
  success: 'success' as const,
  // Ошибки
  error: 'error' as const,
  // Уведомления
  notification: 'warning' as const,
  // Изменение выбора
  selection: 'selection' as const
}
