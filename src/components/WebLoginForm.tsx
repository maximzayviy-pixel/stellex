'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Smartphone, X, Calendar, CheckCircle, Code, BarChart3, Users, Star, ArrowRight } from 'lucide-react'

interface WebLoginFormProps {
  onLogin: (email: string, password: string) => void
  onRegister: (email: string, password: string, firstName: string, lastName?: string) => void
  onLinkTelegram: () => void
  loading: boolean
  error: string | null
}

export default function WebLoginForm({ onLogin, onRegister, onLinkTelegram, loading, error }: WebLoginFormProps) {
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      onLogin(formData.email, formData.password)
    } else {
      onRegister(formData.email, formData.password, formData.firstName, formData.lastName)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Если не показываем форму авторизации, показываем лендинг
  if (!showAuthForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Stellex Pay</h1>
                <p className="text-white/70 text-sm">Банк со звездами Telegram</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <motion.button
                onClick={() => {
                  setIsLogin(true)
                  setShowAuthForm(true)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all"
              >
                Войти
              </motion.button>
              <motion.button
                onClick={() => {
                  setIsLogin(false)
                  setShowAuthForm(true)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                Регистрация
              </motion.button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-6"
            >
              Будущее платежей
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                уже здесь
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Первый банк, который работает с Telegram Stars как с реальной валютой. 
              Создавайте карты, переводите деньги, принимайте платежи.
            </motion.p>

            {/* Пластиковые карты анонс */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 max-w-2xl mx-auto mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-green-400 mr-2" />
                <span className="text-green-400 font-semibold">Новинка ноября 2024</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Настоящие пластиковые карты
              </h3>
              <p className="text-white/80">
                Получите физическую карту, которая работает с Telegram Stars в любом магазине мира!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center space-x-4"
            >
              <motion.button
                onClick={() => {
                  setIsLogin(false)
                  setShowAuthForm(true)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg flex items-center space-x-2 hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
              >
                <span>Начать сейчас</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => window.open('https://t.me/stellexbank_bot', '_blank')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg flex items-center space-x-2 hover:bg-white/20 transition-all border border-white/20"
              >
                <Smartphone className="w-5 h-5" />
                <span>Открыть в Telegram</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-purple-400 mr-2" />
                Для пользователей
              </h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Виртуальные карты с балансом в Telegram Stars
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Мгновенные переводы между пользователями
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  QR-коды для быстрых платежей
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Безопасность и анонимность
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Code className="w-6 h-6 text-blue-400 mr-2" />
                Для разработчиков
              </h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  REST API для интеграции платежей
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Webhook уведомления
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Готовые кнопки "PAY WITH STELLEX"
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Детальная аналитика платежей
                </li>
              </ul>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/70">Пользователей</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">₽2M+</div>
              <div className="text-white/70">Оборот в Stars</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/70">Время работы</div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Готовы начать?
            </h3>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Присоединяйтесь к тысячам пользователей, которые уже используют Stellex Pay
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={() => {
                  setIsLogin(false)
                  setShowAuthForm(true)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
              >
                Создать аккаунт
              </motion.button>
              <motion.button
                onClick={() => window.open('https://docs.stellex-pay.com', '_blank')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Документация
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/20 text-center">
            <p className="text-white/60 text-sm">
              © 2024 Stellex Pay. Все права защищены.
            </p>
            <p className="text-white/40 text-xs mt-2">
              @stellexbank_bot
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => setShowAuthForm(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
          >
            <Smartphone className="w-6 h-6 text-white" />
          </motion.div>
          <div className="w-6"></div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Stellex Pay
        </h1>
        <p className="text-white/80 text-center mb-8">
          Банк со звездами Telegram
        </p>

        {/* Преимущества */}
        <div className="mb-8 space-y-4">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Для пользователей
            </h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Виртуальные карты с балансом в Telegram Stars</li>
              <li>• Мгновенные переводы между пользователями</li>
              <li>• QR-коды для быстрых платежей</li>
              <li>• Безопасность и анонимность</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Для разработчиков
            </h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• API для интеграции платежей</li>
              <li>• Webhook уведомления</li>
              <li>• Готовые кнопки "PAY WITH STELLEX"</li>
              <li>• Детальная аналитика платежей</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Скоро: Пластиковые карты
            </h3>
            <p className="text-white/80 text-sm">
              В ноябре 2024 года запускаем настоящие пластиковые карты с поддержкой Telegram Stars!
            </p>
          </div>
        </div>

        {/* Переключатель входа/регистрации */}
        <div className="flex bg-white/10 rounded-lg p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isLogin 
                ? 'bg-white text-purple-900' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isLogin 
                ? 'bg-white text-purple-900' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Введите ваше имя"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Фамилия (необязательно)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Введите вашу фамилию"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Введите ваш email"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Введите пароль (минимум 6 символов)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : null}
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </motion.button>
        </form>

        {/* Дополнительные действия */}
        <div className="mt-6 pt-6 border-t border-white/20 space-y-4">
          <div>
            <p className="text-white/60 text-sm text-center mb-4">
              Уже есть аккаунт? Привяжите Telegram
            </p>
            <motion.button
              onClick={onLinkTelegram}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-white/10 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-white/20"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Привязать Telegram
            </motion.button>
          </div>

          <div>
            <p className="text-white/60 text-sm text-center mb-4">
              Для разработчиков
            </p>
            <motion.button
              onClick={() => window.open('https://docs.stellex-pay.com', '_blank')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:from-cyan-600 hover:to-blue-600"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Документация API
            </motion.button>
          </div>
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
