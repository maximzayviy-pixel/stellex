'use client'

import { motion } from 'framer-motion'
import { Users, Crown, Trophy, Coins } from 'lucide-react'
import { useGame } from '@/hooks/useGame'
import { useAuth } from '@/hooks/useAuth'

export default function PlayerList() {
  const { players } = useGame()
  const { user } = useAuth()

  // Sort players by balance (richest first)
  const sortedPlayers = [...players].sort((a, b) => b.balance - a.balance)

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-casino-gold" />
      case 1:
        return <Trophy className="w-5 h-5 text-gray-400" />
      case 2:
        return <Trophy className="w-5 h-5 text-yellow-600" />
      default:
        return <span className="text-gray-500 font-bold">#{index + 1}</span>
    }
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-casino-gold to-yellow-400 text-black'
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-black'
      case 2:
        return 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black'
      default:
        return 'bg-white/10 text-white'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Игроки за столом</h2>
        <p className="text-gray-400">
          Всего игроков: {players.length}
        </p>
      </div>

      <div className="grid gap-4">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${getRankColor(index)} rounded-xl p-6 shadow-lg ${
              player.id === user?.id ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-black/20 rounded-full">
                  {getRankIcon(index)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold">{player.username}</h3>
                    {player.id === user?.id && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                        Вы
                      </span>
                    )}
                    {index === 0 && (
                      <span className="text-xs bg-casino-gold text-black px-2 py-1 rounded-full font-bold">
                        Лидер
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm opacity-75">
                    <Coins className="w-4 h-4" />
                    <span>{player.balance.toLocaleString()} тугриков</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">
                  {player.balance.toLocaleString()}
                </div>
                <div className="text-sm opacity-75">тугриков</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {players.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Пока никого нет за столом
          </h3>
          <p className="text-gray-400">
            Пригласите друзей присоединиться к игре!
          </p>
        </motion.div>
      )}

      {/* Leaderboard Stats */}
      {players.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 backdrop-blur-sm border border-casino-gold rounded-lg p-6"
        >
          <h3 className="text-white font-bold text-lg mb-4">Статистика стола</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-gold">
                {players.reduce((sum, p) => sum + p.balance, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Общий капитал</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(players.reduce((sum, p) => sum + p.balance, 0) / players.length).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Средний баланс</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {sortedPlayers[0]?.balance || 0}
              </div>
              <div className="text-sm text-gray-400">Максимум</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {sortedPlayers[sortedPlayers.length - 1]?.balance || 0}
              </div>
              <div className="text-sm text-gray-400">Минимум</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
