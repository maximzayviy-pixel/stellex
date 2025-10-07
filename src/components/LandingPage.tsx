'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  CreditCard, 
  Shield, 
  Zap, 
  Users, 
  Code, 
  ArrowRight, 
  CheckCircle,
  Globe,
  Smartphone,
  Lock,
  TrendingUp,
  Award,
  ChevronDown,
  Menu,
  X,
  Key,
  Send
} from 'lucide-react'
import PlasticCard3D from './PlasticCard3D'
import ApiKeyRequestModal from './ApiKeyRequestModal'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Виртуальные карты",
      description: "Создавайте до 3 карт с номерами 666* для безопасных платежей"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Telegram Stars",
      description: "Пополняйте баланс звездами Telegram и используйте их везде"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Безопасность",
      description: "PIN-код, шифрование и защита всех ваших транзакций"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Мгновенные переводы",
      description: "Переводите деньги по номеру карты или QR-коду за секунды"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Веб-версия",
      description: "Полный доступ через браузер с привязкой Telegram аккаунта"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Мобильное приложение",
      description: "Удобный интерфейс, оптимизированный для телефонов"
    }
  ]

  const stats = [
    { number: "10K+", label: "Активных пользователей" },
    { number: "50K+", label: "Обработанных транзакций" },
    { number: "99.9%", label: "Время работы" },
    { number: "24/7", label: "Поддержка" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/20 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="https://i.imgur.com/ogTdloq.png" 
                alt="Stellex Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-2xl font-bold text-white">Stellex</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/70 hover:text-white transition-colors">Возможности</a>
              <a href="#developers" className="text-white/70 hover:text-white transition-colors">Для разработчиков</a>
              <a href="#pricing" className="text-white/70 hover:text-white transition-colors">Тарифы</a>
              <a href="#contact" className="text-white/70 hover:text-white transition-colors">Контакты</a>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/api/docs"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                <Code className="w-4 h-4 mr-2" />
                API Docs
              </a>
              <a
                href="/app"
                className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Войти в приложение
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black/20 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-white/70 hover:text-white transition-colors">Возможности</a>
              <a href="#developers" className="block text-white/70 hover:text-white transition-colors">Для разработчиков</a>
              <a href="#pricing" className="block text-white/70 hover:text-white transition-colors">Тарифы</a>
              <a href="#contact" className="block text-white/70 hover:text-white transition-colors">Контакты</a>
              <a href="/api/docs" className="block text-white/70 hover:text-white transition-colors">API Docs</a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Премиальные декоративные элементы */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
              
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 relative z-10">
                <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                  Будущее платежей
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  уже здесь
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed relative z-10">
                Первый банк, который работает с 
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold"> Telegram Stars</span> 
                как с реальной валютой. 
                <br />
                Создавайте карты, переводите деньги, принимайте платежи.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-8"
          >
            <motion.a
              href="/app"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 transition-all duration-300 shadow-2xl shadow-purple-500/25 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Начать сейчас</span>
              <ArrowRight className="w-6 h-6 ml-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>
            
            <motion.a
              href="https://t.me/stellexbank_bot"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white text-xl font-bold rounded-2xl hover:from-blue-700 hover:via-blue-800 hover:to-blue-700 transition-all duration-300 shadow-2xl shadow-blue-500/25 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Открыть в Telegram</span>
            </motion.a>
          </motion.div>

          {/* Важное уведомление */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-16 max-w-4xl mx-auto"
          >
            <div className="flex items-start space-x-4">
              <div className="text-yellow-400 text-2xl">⚠️</div>
              <div>
                <h3 className="text-yellow-100 font-bold text-lg mb-2">Важно!</h3>
                <p className="text-yellow-200">
                  Для полного функционала откройте приложение через бота @stellexbank_bot в Telegram, 
                  а не через прямую ссылку!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Новинка ноября */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 border border-white/10 rounded-3xl p-12 mb-16 max-w-7xl mx-auto backdrop-blur-xl"
          >
            {/* Премиальные декоративные элементы */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute top-1/2 left-0 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            <div className="absolute top-1/2 right-0 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-2 mb-6"
              >
                <span className="text-purple-300 font-semibold text-sm tracking-wider">НОВИНКА НОЯБРЯ 2024</span>
              </motion.div>
              
              <h3 className="text-white font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Настоящие пластиковые карты
              </h3>
              
              <p className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed">
                Получите физическую карту, которая работает с Telegram Stars в любом магазине мира!
              </p>
            </div>
            
            <div className="flex justify-center mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="relative"
              >
                <PlasticCard3D />
                {/* Премиальные эффекты вокруг карты */}
                <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-2xl blur-xl"></div>
              </motion.div>
            </div>
            
            <div className="text-center">
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold py-4 px-12 rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 transition-all duration-300 shadow-2xl shadow-purple-500/25"
              >
                <span className="text-lg">Заказать карту</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Возможности платформы
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Все необходимое для современного банкинга в одном приложении
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section id="developers" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Для разработчиков
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Мощное API для интеграции платежей в ваши приложения
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold text-white mb-6">
                Интегрируйте платежи за минуты
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white/70">RESTful API с полной документацией</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white/70">Webhooks для уведомлений о платежах</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white/70">SDK для популярных языков программирования</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white/70">Тестовый режим для разработки</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/api/docs"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  <Code className="w-5 h-5 mr-2" />
                  Открыть документацию
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <Key className="w-5 h-5 mr-2" />
                  Запросить API ключ
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-black/20 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="text-green-400 text-sm mb-2">// Пример интеграции</div>
              <pre className="text-white text-sm overflow-x-auto">
{`// Создание платежа
const payment = await fetch('/api/payments/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 1000,
    currency: 'RUB',
    description: 'Оплата заказа #123'
  })
});

// Обработка webhook
app.post('/webhook', (req, res) => {
  const { type, data } = req.body;
  if (type === 'payment.completed') {
    // Обработка успешного платежа
  }
});`}
              </pre>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Присоединяйтесь к тысячам пользователей, которые уже используют Stellex
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/app"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-2xl"
              >
                Создать аккаунт
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/api/docs"
                className="inline-flex items-center px-8 py-4 bg-white/10 text-white text-lg font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <Code className="w-5 h-5 mr-2" />
                API для разработчиков
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://i.imgur.com/ogTdloq.png" 
                  alt="Stellex Logo" 
                  className="w-10 h-10 rounded-lg"
                />
                <span className="text-2xl font-bold text-white">Stellex</span>
              </div>
              <p className="text-white/70">
                Современный банковский сервис с поддержкой Telegram Stars
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Продукт</h3>
              <div className="space-y-2">
                <a href="#features" className="block text-white/70 hover:text-white transition-colors">Возможности</a>
                <a href="/app" className="block text-white/70 hover:text-white transition-colors">Приложение</a>
                <a href="#pricing" className="block text-white/70 hover:text-white transition-colors">Тарифы</a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Разработчикам</h3>
              <div className="space-y-2">
                <a href="/api/docs" className="block text-white/70 hover:text-white transition-colors">API Документация</a>
                <a href="/api/docs" className="block text-white/70 hover:text-white transition-colors">SDK</a>
                <a href="/api/docs" className="block text-white/70 hover:text-white transition-colors">Webhooks</a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Поддержка</h3>
              <div className="space-y-2">
                <a href="#contact" className="block text-white/70 hover:text-white transition-colors">Контакты</a>
                <a href="/app" className="block text-white/70 hover:text-white transition-colors">Помощь</a>
                <a href="/app" className="block text-white/70 hover:text-white transition-colors">Статус</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/70">
            <p>&copy; 2024 Stellex. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* API Key Request Modal */}
      <ApiKeyRequestModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />
    </div>
  )
}