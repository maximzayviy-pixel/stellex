'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Globe, AlertCircle } from 'lucide-react'

interface LoginScreenProps {
  onRetry: () => void
}

export default function LoginScreen({ onRetry }: LoginScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-center max-w-md w-full border border-white/20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Smartphone className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Stellex Pay
        </h1>
        
        <p className="text-white/80 mb-6">
          Банк со звездами Telegram
        </p>

        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-yellow-200 font-semibold">Внимание</span>
          </div>
          <p className="text-yellow-100 text-sm">
            Это приложение работает только внутри Telegram. Откройте его через бота @stellexbank_bot
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
          >
            <Globe className="w-5 h-5 mr-2" />
            Попробовать снова
          </motion.button>

          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white/10 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-white/20"
          >
            Обновить страницу
          </motion.button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-white/60 text-sm">
            Совет: Убедитесь, что вы открыли приложение через Telegram бота
          </p>
        </div>

        <div className="mt-4">
          <p className="text-white/40 text-xs">
            @stellexbank_bot
          </p>
        </div>
      </div>
    </motion.div>
  )
}
