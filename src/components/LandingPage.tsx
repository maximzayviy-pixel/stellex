'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Smartphone, 
  CreditCard, 
  Zap, 
  Shield, 
  Code, 
  BarChart3, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Calendar
} from 'lucide-react'

interface LandingPageProps {
  onLogin: () => void
  onRegister: () => void
}

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'developers'>('users')

  const features = {
    users: [
      {
        icon: CreditCard,
        title: 'Виртуальные карты',
        description: 'Создавайте до 3 виртуальных карт с балансом в Telegram Stars'
      },
      {
        icon: Zap,
        title: 'Мгновенные переводы',
        description: 'Переводите деньги между пользователями по номеру карты'
      },
      {
        icon: Smartphone,
        title: 'QR-платежи',
        description: 'Генерируйте и сканируйте QR-коды для быстрых платежей'
      },
      {
        icon: Shield,
        title: 'Безопасность',
        description: 'Все транзакции защищены современными методами шифрования'
      }
    ],
    developers: [
      {
        icon: Code,
        title: 'REST API',
        description: 'Простой и мощный API для интеграции платежей в ваши приложения'
      },
      {
        icon: BarChart3,
        title: 'Аналитика',
        description: 'Детальная статистика платежей и пользователей'
      },
      {
        icon: Users,
        title: 'Webhook уведомления',
        description: 'Получайте уведомления о статусе платежей в реальном времени'
      },
      {
        icon: Star,
        title: 'Готовые решения',
        description: 'Кнопки "PAY WITH STELLEX" и виджеты для быстрой интеграции'
      }
    ]
  }

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
              onClick={onLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all"
            >
              Войти
            </motion.button>
            <motion.button
              onClick={onRegister}
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
              onClick={onRegister}
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

        {/* Features Tabs */}
        <div className="mb-16">
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'users'
                    ? 'bg-white text-purple-900'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Для пользователей
              </button>
              <button
                onClick={() => setActiveTab('developers')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'developers'
                    ? 'bg-white text-purple-900'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Для разработчиков
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features[activeTab].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
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
              onClick={onRegister}
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
