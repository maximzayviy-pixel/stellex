'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '@/types'

interface CosmicPreloaderProps {
  user: User
  onComplete: () => void
}

export default function CosmicPreloader({ user, onComplete }: CosmicPreloaderProps) {
  const [step, setStep] = useState<'loading' | 'pin-setup'>('loading')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    // Космическая загрузка
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setStep('pin-setup')
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  const handlePinSubmit = () => {
    if (pin.length !== 4) {
      setPinError('PIN должен содержать 4 цифры')
      return
    }
    if (pin !== confirmPin) {
      setPinError('PIN-коды не совпадают')
      return
    }
    // Сохраняем PIN в localStorage и завершаем
    localStorage.setItem('user_pin', pin)
    onComplete()
  }

  const handlePinChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value)
      setPinError('')
    }
  }

  const handleConfirmPinChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setConfirmPin(value)
      setPinError('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
      {/* Космические звезды */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Планеты */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20"
          style={{ left: '10%', top: '20%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20"
          style={{ right: '15%', top: '60%' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center z-10"
          >
            {/* Аватар пользователя */}
            <motion.div
              className="w-32 h-32 mx-auto mb-8 relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center p-4">
                <img 
                  src="https://i.imgur.com/ogTdloq.png" 
                  alt="Stellex Logo" 
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping" />
            </motion.div>

            {/* Имя пользователя */}
            <motion.h1
              className="text-3xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {user?.first_name || 'Пользователь'} {user?.last_name || ''}
            </motion.h1>

            {/* Прогресс бар */}
            <div className="w-80 mx-auto mb-8">
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-white/70 text-sm mt-2">
                {loadingProgress < 100 ? 'Загрузка космических данных...' : 'Готово!'}
              </p>
            </div>

            {/* Космические частицы */}
            <div className="flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 'pin-setup' && (
          <motion.div
            key="pin-setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mx-auto px-6 z-10"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Создайте PIN-код</h2>
              <p className="text-white/70">Для безопасности вашего аккаунта</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">PIN-код (4 цифры)</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={4}
                  placeholder="••••"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Подтвердите PIN-код</label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => handleConfirmPinChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={4}
                  placeholder="••••"
                />
              </div>

              {pinError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center"
                >
                  {pinError}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePinSubmit}
                disabled={pin.length !== 4 || confirmPin.length !== 4}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Создать PIN-код
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
