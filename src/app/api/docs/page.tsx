'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  ArrowRight, 
  Copy, 
  Check, 
  Star,
  CreditCard,
  Zap,
  Shield,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function APIDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>('authentication')

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    })
  }

  const sections = [
    {
      id: 'authentication',
      title: 'Аутентификация',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-white/70">
            Все API запросы требуют аутентификации через Bearer токен в заголовке Authorization.
          </p>
          <div className="bg-black/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-sm">Пример запроса</span>
              <button
                onClick={() => copyToClipboard('curl -H "Authorization: Bearer YOUR_TOKEN" https://api.stellex.space/api/cards', 'auth-curl')}
                className="p-1 hover:bg-white/10 rounded"
              >
                {copiedCode === 'auth-curl' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="text-white text-sm overflow-x-auto">
{`curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://api.stellex.space/api/cards`}
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'cards',
      title: 'Управление картами',
      icon: <CreditCard className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-white font-bold mb-2">GET /api/cards</h4>
            <p className="text-white/70 mb-3">Получить список карт пользователя</p>
            <div className="bg-black/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 text-sm">Ответ</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify({
                    "success": true,
                    "cards": [
                      {
                        "id": "card_123",
                        "card_number": "6661234567890123",
                        "card_name": "Основная карта",
                        "balance": 50000,
                        "cvv": "123",
                        "expiry_date": "12/25",
                        "holder_name": "Иван Иванов"
                      }
                    ]
                  }, null, 2), 'cards-response')}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  {copiedCode === 'cards-response' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="text-white text-sm overflow-x-auto">
{`{
  "success": true,
  "cards": [
    {
      "id": "card_123",
      "card_number": "6661234567890123",
      "card_name": "Основная карта",
      "balance": 50000,
      "cvv": "123",
      "expiry_date": "12/25",
      "holder_name": "Иван Иванов"
    }
  ]
}`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-2">POST /api/cards</h4>
            <p className="text-white/70 mb-3">Создать новую карту</p>
            <div className="bg-black/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 text-sm">Запрос</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify({
                    "user_id": "user_123",
                    "holder_name": "Иван Иванов"
                  }, null, 2), 'create-card-request')}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  {copiedCode === 'create-card-request' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="text-white text-sm overflow-x-auto">
{`{
  "user_id": "user_123",
  "holder_name": "Иван Иванов"
}`}
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'payments',
      title: 'Платежи и переводы',
      icon: <Zap className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-white font-bold mb-2">POST /api/transfer</h4>
            <p className="text-white/70 mb-3">Перевод между картами</p>
            <div className="bg-black/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 text-sm">Запрос</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify({
                    "fromCardId": "card_123",
                    "toCardNumber": "6669876543210987",
                    "amount": 1000
                  }, null, 2), 'transfer-request')}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  {copiedCode === 'transfer-request' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="text-white text-sm overflow-x-auto">
{`{
  "fromCardId": "card_123",
  "toCardNumber": "6669876543210987",
  "amount": 1000
}`}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-2">POST /api/telegram-stars/topup</h4>
            <p className="text-white/70 mb-3">Пополнение через Telegram Stars</p>
            <div className="bg-black/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 text-sm">Запрос</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify({
                    "cardId": "card_123",
                    "starsAmount": 100
                  }, null, 2), 'stars-request')}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  {copiedCode === 'stars-request' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="text-white text-sm overflow-x-auto">
{`{
  "cardId": "card_123",
  "starsAmount": 100
}`}
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      icon: <Globe className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-white/70">
            Webhooks позволяют получать уведомления о событиях в реальном времени.
          </p>
          <div className="bg-black/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-sm">Пример webhook</span>
              <button
                onClick={() => copyToClipboard(JSON.stringify({
                  "type": "payment.completed",
                  "data": {
                    "transaction_id": "txn_123",
                    "card_id": "card_123",
                    "amount": 1000,
                    "status": "completed"
                  }
                }, null, 2), 'webhook-example')}
                className="p-1 hover:bg-white/10 rounded"
              >
                {copiedCode === 'webhook-example' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="text-white text-sm overflow-x-auto">
{`{
  "type": "payment.completed",
  "data": {
    "transaction_id": "txn_123",
    "card_id": "card_123",
    "amount": 1000,
    "status": "completed"
  }
}`}
            </pre>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="https://i.imgur.com/ogTdloq.png" 
                alt="Stellex Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-2xl font-bold text-white">Stellex API</span>
            </div>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              На главную
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              API <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Документация</span>
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Полная документация по интеграции с Stellex API для разработчиков
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#getting-started"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                <Code className="w-5 h-5 mr-2" />
                Начать интеграцию
              </a>
              <a
                href="/app"
                className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                Тестовое приложение
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* API Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-purple-400">{section.icon}</div>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronUp className="w-6 h-6 text-white/70" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white/70" />
                  )}
                </button>
                {expandedSection === section.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    {section.content}
                  </motion.div>
                )}
              </motion.div>
            ))}
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
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Готовы интегрироваться?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Получите API ключ и начните разработку уже сегодня
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/app"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Получить API ключ
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="mailto:dev@stellex.space"
                className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300"
              >
                Связаться с нами
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="https://i.imgur.com/ogTdloq.png" 
              alt="Stellex Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-2xl font-bold text-white">Stellex API</span>
          </div>
          <p className="text-white/70">
            &copy; 2024 Stellex. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  )
}
