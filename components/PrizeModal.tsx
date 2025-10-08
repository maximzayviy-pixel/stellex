'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Gift } from 'lucide-react'

interface Prize {
  name: string
  emoji: string
  description: string
  price: number
}

interface PrizeModalProps {
  isOpen: boolean
  onClose: () => void
  userBalance: number
}

const prizes: Prize[] = [
  {
    name: 'Шевроле Авео',
    emoji: '🚗',
    description: 'Легендарная машина для настоящих победителей! Идеально подходит для поездок по городу и за его пределы.',
    price: 1000000
  },
  {
    name: 'Лабубу',
    emoji: '🏠',
    description: 'Роскошный дом вашей мечты! Просторные комнаты, современный дизайн и все удобства.',
    price: 2000000
  },
  {
    name: 'Матрикс',
    emoji: '💊',
    description: 'Войдите в матрицу и измените реальность! Этот приз даст вам возможность увидеть мир по-новому.',
    price: 5000000
  }
]

export default function PrizeModal({ isOpen, onClose, userBalance }: PrizeModalProps) {
  const canAffordPrize = (prize: Prize) => userBalance >= prize.price

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-purple-900 to-blue-900 border-2 border-casino-gold rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-casino-gold to-yellow-400 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-white">Главные призы</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-6">
              {prizes.map((prize, index) => (
                <motion.div
                  key={prize.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-black/40 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 ${
                    canAffordPrize(prize)
                      ? 'border-casino-gold hover:border-casino-gold/70'
                      : 'border-gray-600 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-6xl">{prize.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{prize.name}</h3>
                        {canAffordPrize(prize) ? (
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                            Доступно
                          </span>
                        ) : (
                          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                            Недоступно
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-4">{prize.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Gift className="w-5 h-5 text-casino-gold" />
                          <span className="text-casino-gold font-bold text-lg">
                            {prize.price.toLocaleString()} тугриков
                          </span>
                        </div>
                        {canAffordPrize(prize) ? (
                          <button className="bg-gradient-to-r from-casino-gold to-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
                            Купить
                          </button>
                        ) : (
                          <div className="text-gray-400 text-sm">
                            Нужно еще: {(prize.price - userBalance).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-black/20 rounded-lg border border-casino-gold/50">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Ваш текущий баланс:</span>
                <span className="text-casino-gold font-bold text-xl">
                  {userBalance.toLocaleString()} тугриков
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
