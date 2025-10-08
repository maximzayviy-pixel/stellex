'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, ExternalLink } from 'lucide-react'
import { tonConnectUI, getWalletAddress, getTonBalance, sendTon, tonToStars, starsToTon } from '@/lib/tonConnect'
import { vibrate } from '@/lib/vibration'

interface TonWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onTopUp: (amount: number) => void
  onWithdraw: (amount: number, address: string) => void
}

export default function TonWalletModal({ isOpen, onClose, onTopUp, onWithdraw }: TonWalletModalProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [tonBalance, setTonBalance] = useState(0)
  const [starsBalance, setStarsBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState<'topup' | 'withdraw' | null>(null)
  const [amount, setAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      checkConnection()
    }
  }, [isOpen])

  const checkConnection = async () => {
    try {
      if (typeof window === 'undefined') return
      
      const address = getWalletAddress()
      if (address) {
        setWalletAddress(address)
        setIsConnected(true)
        await loadBalance(address)
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Error checking connection:', error)
    }
  }

  const loadBalance = async (address: string) => {
    try {
      setIsLoading(true)
      const balance = await getTonBalance(address)
      setTonBalance(balance)
      setStarsBalance(tonToStars(balance))
    } catch (error) {
      console.error('Error loading balance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      if (typeof window === 'undefined') return
      
      vibrate('tap')
      if (!tonConnectUI) {
        setError('TON Connect не доступен')
        return
      }
      
      await tonConnectUI.openModal()
      
      // Слушаем изменения в кошельке
      tonConnectUI.onStatusChange((wallet) => {
        if (wallet) {
          setWalletAddress(wallet.address)
          setIsConnected(true)
          loadBalance(wallet.address)
        } else {
          setIsConnected(false)
          setWalletAddress(null)
        }
      })
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setError('Ошибка подключения кошелька')
    }
  }

  const handleDisconnect = async () => {
    try {
      if (typeof window === 'undefined' || !tonConnectUI) return
      
      vibrate('tap')
      await tonConnectUI.disconnect()
      setIsConnected(false)
      setWalletAddress(null)
      setTonBalance(0)
      setStarsBalance(0)
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Введите корректную сумму')
      return
    }

    try {
      vibrate('success')
      const tonAmount = parseFloat(amount)
      const starsAmount = tonToStars(tonAmount)
      onTopUp(starsAmount)
      onClose()
    } catch (error) {
      console.error('Error topping up:', error)
      setError('Ошибка пополнения')
    }
  }

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Введите корректную сумму')
      return
    }

    if (!withdrawAddress) {
      setError('Введите адрес кошелька')
      return
    }

    try {
      vibrate('success')
      const tonAmount = parseFloat(amount)
      await sendTon(withdrawAddress, tonAmount, 'Stellex Pay withdrawal')
      onWithdraw(tonAmount, withdrawAddress)
      onClose()
    } catch (error) {
      console.error('Error withdrawing:', error)
      setError('Ошибка вывода средств')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">TON Кошелек</h2>
                <p className="text-sm text-gray-500">Пополнение и вывод средств</p>
              </div>
            </div>
            <button
              onClick={() => { vibrate('tap'); onClose(); }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {!isConnected ? (
            /* Подключение кошелька */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Подключите TON кошелек
              </h3>
              <p className="text-gray-500 mb-6">
                Для пополнения и вывода средств через TON Blockchain
              </p>
              <button
                onClick={handleConnect}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Подключить кошелек
              </button>
            </div>
          ) : (
            /* Подключенный кошелек */
            <div className="space-y-6">
              {/* Информация о кошельке */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Адрес кошелька</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(walletAddress || '')}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-mono text-sm text-gray-900">
                  {walletAddress ? formatAddress(walletAddress) : ''}
                </p>
              </div>

              {/* Баланс */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">TON</p>
                  <p className="text-xl font-bold text-gray-900">
                    {isLoading ? '...' : tonBalance.toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Telegram Stars</p>
                  <p className="text-xl font-bold text-gray-900">
                    {isLoading ? '...' : starsBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Действия */}
              {action === null && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { vibrate('tap'); setAction('topup'); }}
                    className="flex items-center justify-center space-x-2 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <ArrowDownLeft className="w-5 h-5" />
                    <span>Пополнить</span>
                  </button>
                  <button
                    onClick={() => { vibrate('tap'); setAction('withdraw'); }}
                    className="flex items-center justify-center space-x-2 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                    <span>Вывести</span>
                  </button>
                </div>
              )}

              {/* Форма пополнения */}
              {action === 'topup' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Пополнение счета</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Сумма в TON
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {amount && (
                      <p className="text-sm text-gray-500 mt-1">
                        = {tonToStars(parseFloat(amount) || 0).toLocaleString()} Telegram Stars
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => { vibrate('tap'); setAction(null); setAmount(''); setError(''); }}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleTopUp}
                      className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      Пополнить
                    </button>
                  </div>
                </div>
              )}

              {/* Форма вывода */}
              {action === 'withdraw' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Вывод средств</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Сумма в TON
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Адрес получателя
                    </label>
                    <input
                      type="text"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      placeholder="UQAbc123..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => { vibrate('tap'); setAction(null); setAmount(''); setWithdrawAddress(''); setError(''); }}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleWithdraw}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Вывести
                    </button>
                  </div>
                </div>
              )}

              {/* Ошибка */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Отключение кошелька */}
              <button
                onClick={handleDisconnect}
                className="w-full py-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                Отключить кошелек
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
