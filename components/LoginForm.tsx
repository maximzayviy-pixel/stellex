'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Play } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    try {
      await login(username.trim())
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Добро пожаловать в казино!
        </h2>
        <p className="text-gray-400">
          Введите ваше имя для входа в игру
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ваше имя"
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-casino-gold rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-casino-gold focus:border-transparent"
          maxLength={20}
          required
        />
      </div>

      <motion.button
        type="submit"
        disabled={!username.trim() || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full casino-button flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Play className="w-5 h-5" />
            <span>Войти в казино</span>
          </>
        )}
      </motion.button>

      <div className="text-center text-sm text-gray-400">
        При входе вы получите 10,000 тугриков
      </div>
    </form>
  )
}
