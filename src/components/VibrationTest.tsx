'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { vibrate, vibrationPatterns, initVibration } from '@/lib/vibration'

export default function VibrationTest() {
  React.useEffect(() => {
    initVibration()
  }, [])

  const testVibration = (pattern: string) => {
    console.log(`Testing vibration: ${pattern}`)
    switch (pattern) {
      case 'tap':
        vibrate('tap')
        break
      case 'success':
        vibrate('success')
        break
      case 'error':
        vibrate('error')
        break
      case 'warning':
        vibrate('warning')
        break
      case 'selection':
        vibrate('selection')
        break
      default:
        vibrate('tap')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto pt-20">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          Тест вибрации
        </h1>
        
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => testVibration('tap')}
            className="w-full p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            Короткий отклик (Tap)
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => testVibration('success')}
            className="w-full p-4 bg-green-500/20 rounded-xl text-white hover:bg-green-500/30 transition-colors"
          >
            Успех (Success)
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => testVibration('error')}
            className="w-full p-4 bg-red-500/20 rounded-xl text-white hover:bg-red-500/30 transition-colors"
          >
            Ошибка (Error)
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => testVibration('warning')}
            className="w-full p-4 bg-blue-500/20 rounded-xl text-white hover:bg-blue-500/30 transition-colors"
          >
            Предупреждение (Warning)
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => testVibration('selection')}
            className="w-full p-4 bg-purple-500/20 rounded-xl text-white hover:bg-purple-500/30 transition-colors"
          >
            Изменение выбора (Selection)
          </motion.button>
        </div>
        
        <div className="mt-8 p-4 bg-white/5 rounded-xl">
          <h3 className="text-white font-semibold mb-2">Информация:</h3>
          <p className="text-white/70 text-sm">
            Используется официальный Telegram Haptic Feedback API для максимальной совместимости.
          </p>
          <p className="text-white/70 text-sm mt-2">
            Вибрация работает в Telegram Mini Apps и имеет fallback на стандартную вибрацию браузера.
          </p>
          <p className="text-white/70 text-sm mt-2">
            Проверьте настройки: Android - "Настройки" &gt; "Звук и вибрация" &gt; "Вибрация и тактильная обратная связь" &gt; "Тактильная обратная связь при касании".
          </p>
        </div>
      </div>
    </div>
  )
}
