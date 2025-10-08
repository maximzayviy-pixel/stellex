// Виброотклик для мобильных устройств
export const vibrate = (pattern: number | number[] = 100) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch (error) {
      // Игнорируем ошибки вибрации
      console.warn('Vibration not supported:', error)
    }
  }
}

// Предустановленные паттерны вибрации
export const vibrationPatterns = {
  // Короткий отклик для кнопок
  tap: 50,
  // Длинный отклик для важных действий
  success: [100, 50, 100],
  // Ошибка
  error: [200, 100, 200],
  // Уведомление
  notification: [100, 50, 100, 50, 100],
  // Долгий отклик для завершения
  complete: [200, 100, 200, 100, 200]
}
