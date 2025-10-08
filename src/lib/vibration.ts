// Простая и надежная система вибрации
export const vibrate = (type: 'tap' | 'success' | 'error' | 'warning' | 'selection' = 'tap') => {
  console.log('🔊 VIBRATE CALLED:', type)
  
  // Проверяем поддержку вибрации
  if (typeof window === 'undefined') {
    console.log('❌ Window is undefined (SSR)')
    return
  }

  if (!('vibrate' in navigator)) {
    console.log('❌ Vibration API not supported in this browser')
    return
  }

  // Паттерны вибрации
  const patterns = {
    tap: 50,
    success: [100, 50, 100],
    error: [200, 100, 200],
    warning: [100, 50, 100, 50, 100],
    selection: 30
  }

  const pattern = patterns[type]
  console.log('📳 Vibration pattern:', pattern)

  try {
    // Пробуем вибрацию
    const result = navigator.vibrate(pattern)
    console.log('✅ Vibration result:', result)
    
    // Дополнительная проверка
    if (result === false) {
      console.log('❌ Vibration was blocked by browser')
    } else {
      console.log('🎉 Vibration should be working!')
    }
  } catch (error) {
    console.error('❌ Vibration error:', error)
  }
}

// Инициализация (пустая функция для совместимости)
export const initVibration = () => {
  console.log('🔧 Vibration system initialized')
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
