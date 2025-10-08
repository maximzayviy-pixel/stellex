'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, LogOut, Trophy, Coins } from 'lucide-react'
import RouletteTable from '@/components/RouletteTable'
import PlayerList from '@/components/PlayerList'
import PrizeModal from '@/components/PrizeModal'
import { useAuth } from '@/hooks/useAuth'
import { useGame } from '@/hooks/useGame'

export default function CasinoLobby() {
  const { user, logout } = useAuth()
  const { players, gameState } = useGame()
  const [activeTab, setActiveTab] = useState<'roulette' | 'players'>('roulette')
  const [showPrizeModal, setShowPrizeModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-sm border-b border-casino-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-gradient-to-r from-casino-gold to-yellow-400 rounded-full flex items-center justify-center"
              >
                <span className="text-black font-bold text-lg">🎰</span>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white">Local Casino</h1>
                <p className="text-sm text-gray-400">Добро пожаловать, {user?.username}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/40 px-4 py-2 rounded-lg border border-casino-gold">
                <Coins className="w-5 h-5 text-casino-gold" />
                <span className="text-white font-bold">
                  {user?.balance?.toLocaleString()} тугриков
                </span>
              </div>
              
              <button
                onClick={() => setShowPrizeModal(true)}
                className="flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <Trophy className="w-4 h-4" />
                <span>Призы</span>
              </button>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500 text-red-400 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-1 bg-black/20 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('roulette')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'roulette'
                ? 'bg-casino-gold text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-xl">🎰</span>
            <span>Рулетка</span>
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'players'
                ? 'bg-casino-gold text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Игроки ({players.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'roulette' ? (
            <motion.div
              key="roulette"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RouletteTable />
            </motion.div>
          ) : (
            <motion.div
              key="players"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PlayerList />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Prize Banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-casino-gold to-yellow-400 text-black p-4 rounded-lg shadow-lg max-w-sm"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Trophy className="w-5 h-5" />
          <span className="font-bold">Главные призы:</span>
        </div>
        <div className="text-sm space-y-1">
          <div>🚗 Шевроле Авео - 1,000,000</div>
          <div>🏠 Лабубу - 2,000,000</div>
          <div>💊 Матрикс - 5,000,000</div>
        </div>
      </motion.div>

      {/* Prize Modal */}
      <PrizeModal
        isOpen={showPrizeModal}
        onClose={() => setShowPrizeModal(false)}
        userBalance={user?.balance || 0}
      />
    </div>
  )
}
