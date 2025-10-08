'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'
import { useGame } from '@/hooks/useGame'
import { useAuth } from '@/hooks/useAuth'

interface Bet {
  type: 'red' | 'black' | 'green' | 'even' | 'odd' | 'low' | 'high'
  amount: number
}

export default function RouletteTable() {
  const { gameState, placeBet, spinWheel } = useGame()
  const { user } = useAuth()
  const [selectedChip, setSelectedChip] = useState<number>(10)
  const [bets, setBets] = useState<Bet[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)

  const chipValues = [10, 50, 100, 500, 1000]
  const isRed = (num: number) => [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num)
  const isBlack = (num: number) => [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(num)

  const bettingAreas = [
    { type: 'red' as const, label: 'Красное', color: 'bg-red-600', multiplier: 2 },
    { type: 'black' as const, label: 'Черное', color: 'bg-black', multiplier: 2 },
    { type: 'green' as const, label: 'Зеленое (0)', color: 'bg-green-600', multiplier: 36 },
    { type: 'even' as const, label: 'Четное', color: 'bg-blue-600', multiplier: 2 },
    { type: 'odd' as const, label: 'Нечетное', color: 'bg-purple-600', multiplier: 2 },
    { type: 'low' as const, label: '1-18', color: 'bg-yellow-600', multiplier: 2 },
    { type: 'high' as const, label: '19-36', color: 'bg-pink-600', multiplier: 2 },
  ]

  const handlePlaceBet = (betType: Bet['type']) => {
    if (!user || user.balance < selectedChip) return

    const existingBet = bets.find(bet => bet.type === betType)
    if (existingBet) {
      setBets(bets.map(bet => 
        bet.type === betType 
          ? { ...bet, amount: bet.amount + selectedChip }
          : bet
      ))
    } else {
      setBets([...bets, { type: betType, amount: selectedChip }])
    }

    placeBet(betType, selectedChip)
  }

  const handleSpin = async () => {
    if (bets.length === 0) return
    
    setIsSpinning(true)
    const spinResult = await spinWheel()
    setResult(spinResult)
    
    setTimeout(() => {
      setIsSpinning(false)
      setBets([])
      setResult(null)
    }, 4000)
  }

  const getTotalBet = () => {
    return bets.reduce((total, bet) => total + bet.amount, 0)
  }

  const getChipClass = (value: number) => {
    const classes = {
      10: 'chip chip-10',
      50: 'chip chip-50', 
      100: 'chip chip-100',
      500: 'chip chip-500',
      1000: 'chip chip-1000'
    }
    return classes[value as keyof typeof classes] || 'chip'
  }

  return (
    <div className="space-y-8">
      {/* Roulette Wheel */}
      <div className="flex justify-center">
        <div className="relative">
          <motion.div
            className="roulette-wheel"
            animate={isSpinning ? { rotate: [0, 1800 + (result || 0) * 10] } : {}}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            <div className="roulette-ball" />
            
            {/* Numbers around the wheel */}
            {Array.from({ length: 37 }, (_, i) => (
              <div
                key={i}
                className="absolute w-8 h-8 flex items-center justify-center text-white font-bold text-xs"
                style={{
                  transform: `rotate(${i * 9.73}deg) translateY(-180px)`,
                  transformOrigin: 'center'
                }}
              >
                {i}
              </div>
            ))}
          </motion.div>
          
          {result !== null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-casino-gold text-black font-bold text-2xl px-4 py-2 rounded-full shadow-lg"
            >
              {result}
            </motion.div>
          )}
        </div>
      </div>

      {/* Betting Areas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bettingAreas.map((area) => {
          const bet = bets.find(b => b.type === area.type)
          return (
            <motion.button
              key={area.type}
              onClick={() => handlePlaceBet(area.type)}
              disabled={isSpinning || !user || user.balance < selectedChip}
              className={`betting-area ${area.color} text-white font-bold py-6 px-4 rounded-lg relative overflow-hidden group`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-lg font-bold">{area.label}</div>
                <div className="text-sm opacity-75">x{area.multiplier}</div>
              </div>
              
              {bet && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 bg-casino-gold text-black text-xs font-bold px-2 py-1 rounded-full"
                >
                  {bet.amount}
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Chip Selection */}
      <div className="flex justify-center space-x-4">
        {chipValues.map((value) => (
          <button
            key={value}
            onClick={() => setSelectedChip(value)}
            className={`${getChipClass(value)} ${
              selectedChip === value ? 'ring-4 ring-casino-gold' : ''
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Game Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSpin}
          disabled={bets.length === 0 || isSpinning}
          className="casino-button flex items-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>Крутить рулетку</span>
        </button>
        
        <button
          onClick={() => setBets([])}
          disabled={bets.length === 0 || isSpinning}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Очистить ставки</span>
        </button>
      </div>

      {/* Current Bets */}
      {bets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-sm border border-casino-gold rounded-lg p-4"
        >
          <h3 className="text-white font-bold mb-3">Ваши ставки:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {bets.map((bet, index) => (
              <div key={index} className="bg-white/10 rounded p-2 text-center">
                <div className="text-white font-bold">{bet.type}</div>
                <div className="text-casino-gold">{bet.amount} тугриков</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <span className="text-white font-bold">Общая сумма: </span>
            <span className="text-casino-gold font-bold">{getTotalBet()} тугриков</span>
          </div>
        </motion.div>
      )}

      {/* Game Status */}
      <div className="text-center">
        {isSpinning ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-casino-gold text-lg font-bold"
          >
            Крутим рулетку...
          </motion.div>
        ) : (
          <div className="text-gray-400">
            Выберите ставки и крутите рулетку!
          </div>
        )}
      </div>
    </div>
  )
}
