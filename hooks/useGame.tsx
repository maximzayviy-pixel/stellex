'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { useAuth } from './useAuth'

interface Player {
  id: string
  username: string
  balance: number
}

interface GameState {
  players: Player[]
  currentBets: Record<string, any[]>
  lastResult: number | null
  isSpinning: boolean
}

interface GameContextType {
  players: Player[]
  gameState: GameState
  placeBet: (betType: string, amount: number) => void
  spinWheel: () => Promise<number>
  addPlayer: (player: Player) => void
  removePlayer: (playerId: string) => void
  updatePlayerBalance: (playerId: string, newBalance: number) => void
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentBets: {},
    lastResult: null,
    isSpinning: false
  })

  useEffect(() => {
    if (user) {
      // Add current user to the game
      setGameState(prev => ({
        ...prev,
        players: prev.players.some(p => p.id === user.id) 
          ? prev.players 
          : [...prev.players, user]
      }))
    }
  }, [user])

  const addPlayer = (player: Player) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.some(p => p.id === player.id) 
        ? prev.players 
        : [...prev.players, player]
    }))
  }

  const removePlayer = (playerId: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId),
      currentBets: Object.fromEntries(
        Object.entries(prev.currentBets).filter(([id]) => id !== playerId)
      )
    }))
  }

  const updatePlayerBalance = (playerId: string, newBalance: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, balance: newBalance } : p
      )
    }))
  }

  const placeBet = (betType: string, amount: number) => {
    if (!user) return

    setGameState(prev => ({
      ...prev,
      currentBets: {
        ...prev.currentBets,
        [user.id]: [
          ...(prev.currentBets[user.id] || []),
          { type: betType, amount }
        ]
      }
    }))

    // Update user's balance locally
    const newBalance = user.balance - amount
    updatePlayerBalance(user.id, newBalance)
    
    // Update user in localStorage
    const updatedUser = { ...user, balance: newBalance }
    localStorage.setItem('casino-user', JSON.stringify(updatedUser))
  }

  const spinWheel = async (): Promise<number> => {
    setGameState(prev => ({ ...prev, isSpinning: true }))
    
    // Simulate wheel spin
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate random result (0-36)
    const result = Math.floor(Math.random() * 37)
    
    setGameState(prev => ({ 
      ...prev, 
      lastResult: result,
      isSpinning: false 
    }))

    // Process bets and update balances
    setTimeout(() => {
      processBets(result)
    }, 1000)

    return result
  }

  const processBets = (result: number) => {
    if (!user) return

    const playerBets = gameState.currentBets[user.id] || []
    let totalWinnings = 0

    playerBets.forEach(bet => {
      let won = false
      let multiplier = 1

      switch (bet.type) {
        case 'red':
          won = isRed(result)
          multiplier = 2
          break
        case 'black':
          won = isBlack(result)
          multiplier = 2
          break
        case 'green':
          won = result === 0
          multiplier = 36
          break
        case 'even':
          won = result !== 0 && result % 2 === 0
          multiplier = 2
          break
        case 'odd':
          won = result !== 0 && result % 2 === 1
          multiplier = 2
          break
        case 'low':
          won = result >= 1 && result <= 18
          multiplier = 2
          break
        case 'high':
          won = result >= 19 && result <= 36
          multiplier = 2
          break
      }

      if (won) {
        totalWinnings += bet.amount * multiplier
      }
    })

    // Update player balance with winnings
    const newBalance = user.balance + totalWinnings
    updatePlayerBalance(user.id, newBalance)
    
    // Update user in localStorage
    const updatedUser = { ...user, balance: newBalance }
    localStorage.setItem('casino-user', JSON.stringify(updatedUser))

    // Clear current bets
    setGameState(prev => ({
      ...prev,
      currentBets: {
        ...prev.currentBets,
        [user.id]: []
      }
    }))
  }

  const isRed = (num: number) => {
    return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num)
  }

  const isBlack = (num: number) => {
    return [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(num)
  }

  return (
    <GameContext.Provider value={{
      players: gameState.players,
      gameState,
      placeBet,
      spinWheel,
      addPlayer,
      removePlayer,
      updatePlayerBalance
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
