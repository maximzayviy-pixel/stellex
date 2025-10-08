'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dice6, Users, Trophy, Coins } from 'lucide-react'
import LoginForm from '@/components/LoginForm'
import CasinoLobby from '@/components/CasinoLobby'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { GameProvider } from '@/hooks/useGame'

function CasinoApp() {
  const { user, isLoading } = useAuth()
  const [showPrizes, setShowPrizes] = useState(false)

  const prizes = [
    {
      name: 'Шевроле Авео',
      emoji: '🚗',
      description: 'Легендарная машина для настоящих победителей!',
      price: 1000000
    },
    {
      name: 'Лабубу',
      emoji: '🏠',
      description: 'Роскошный дом вашей мечты!',
      price: 2000000
    },
    {
      name: 'Матрикс',
      emoji: '💊',
      description: 'Войдите в матрицу и измените реальность!',
      price: 5000000
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-casino-gold border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {!user ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md w-full"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-casino-gold to-yellow-400 rounded-full mb-4"
              >
                <Dice6 className="w-10 h-10 text-black" />
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🎰 Local Casino
              </h1>
              <p className="text-gray-300 text-lg">
                Играйте с друзьями по локальной сети!
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm border border-casino-gold rounded-2xl p-8 shadow-2xl">
              <LoginForm />
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => setShowPrizes(!showPrizes)}
              className="mt-6 w-full casino-button"
            >
              <Trophy className="w-5 h-5 inline mr-2" />
              Посмотреть призы
            </motion.button>

            <AnimatePresence>
              {showPrizes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-3"
                >
                  {prizes.map((prize, index) => (
                    <motion.div
                      key={prize.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 border border-casino-gold rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{prize.emoji}</span>
                        <div>
                          <h3 className="font-bold text-white">{prize.name}</h3>
                          <p className="text-sm text-gray-300">{prize.description}</p>
                          <p className="text-casino-gold font-bold">
                            {prize.price.toLocaleString()} тугриков
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-2 text-casino-gold">
                <Coins className="w-5 h-5" />
                <span className="text-lg font-bold">Начальный капитал: 10,000 тугриков</span>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <CasinoLobby />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <GameProvider>
        <CasinoApp />
      </GameProvider>
    </AuthProvider>
  )
}
