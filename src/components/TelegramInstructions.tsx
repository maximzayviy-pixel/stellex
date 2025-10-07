'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Smartphone, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

interface TelegramInstructionsProps {
  onRetry: () => void
}

export default function TelegramInstructions({ onRetry }: TelegramInstructionsProps) {
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
          className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <AlertTriangle className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Неправильный способ открытия
        </h2>
        
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
          <p className="text-red-100 text-sm">
            Приложение открыто как обычная ссылка, а не как Telegram WebApp. 
            Это ограничивает функциональность.
          </p>
        </div>

        <div className="text-left space-y-4 mb-8">
          <h3 className="text-white font-semibold mb-3">Правильный способ открытия:</h3>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <div>
              <p className="text-white/80 text-sm">
                Найдите бота <span className="font-semibold text-blue-400">@stellexbank_bot</span> в Telegram
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <div>
              <p className="text-white/80 text-sm">
                Нажмите кнопку <span className="font-semibold text-purple-400">"Open App"</span> или <span className="font-semibold text-purple-400">"Открыть приложение"</span>
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">3</span>
            </div>
            <div>
              <p className="text-white/80 text-sm">
                <span className="font-semibold text-red-400">НЕ</span> открывайте ссылку напрямую в браузере!
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.button
            onClick={() => window.open('https://t.me/stellexbank_bot', '_blank')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
          >
            <Smartphone className="w-5 h-5" />
            <span>Открыть бота в Telegram</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white/10 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-all border border-white/20"
          >
            Попробовать снова
          </motion.button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/40 text-xs">
            @stellexbank_bot
          </p>
        </div>
      </div>
    </motion.div>
  )
}


