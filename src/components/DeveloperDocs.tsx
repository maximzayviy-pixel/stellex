'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  Copy, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Zap,
  CreditCard,
  BarChart3,
  Settings
} from 'lucide-react'

interface DeveloperDocsProps {
  apiKey: string
  onClose: () => void
}

export default function DeveloperDocs({ apiKey, onClose }: DeveloperDocsProps) {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Обзор', icon: Info },
    { id: 'authentication', label: 'Аутентификация', icon: CheckCircle },
    { id: 'payments', label: 'Платежи', icon: CreditCard },
    { id: 'webhooks', label: 'Webhooks', icon: Zap },
    { id: 'errors', label: 'Ошибки', icon: XCircle },
    { id: 'sdk', label: 'SDK', icon: Code }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Код скопирован в буфер обмена!')
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Stellex Pay API</h2>
        <p className="text-gray-600 mb-6">
          Stellex Pay API позволяет интегрировать платежную систему в ваши приложения. 
          API поддерживает создание платежей, получение статистики и обработку webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Базовый URL</h3>
          <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded">
            {process.env.NEXT_PUBLIC_APP_URL || 'https://stellex.space'}
          </code>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Версия API</h3>
          <code className="text-green-800 bg-green-100 px-2 py-1 rounded">v1.0</code>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">Важно</h3>
            <p className="text-yellow-800 text-sm">
              Все запросы должны содержать заголовок Authorization с вашим API ключом. 
              API ключ можно получить в личном кабинете разработчика.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAuthentication = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Аутентификация</h2>
        <p className="text-gray-600 mb-6">
          Stellex Pay использует Bearer токены для аутентификации. 
          Включите ваш API ключ в заголовок Authorization каждого запроса.
        </p>
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Пример запроса</h3>
          <button
            onClick={() => copyToClipboard(`Authorization: Bearer ${apiKey}`)}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <Copy className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <pre className="text-gray-300 text-sm overflow-x-auto">
{`curl -X POST \\
  '${process.env.NEXT_PUBLIC_APP_URL || 'https://stellex.space'}/api/developer/payment' \\
  -H 'Authorization: Bearer ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "amount": 100,
    "description": "Тестовый платеж"
  }'`}
        </pre>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">Ошибки аутентификации</h3>
            <ul className="text-red-800 text-sm space-y-1">
              <li>• <code>401 Unauthorized</code> - Неверный или отсутствующий API ключ</li>
              <li>• <code>403 Forbidden</code> - API ключ неактивен или заблокирован</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPayments = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Платежи</h2>
        <p className="text-gray-600 mb-6">
          API позволяет создавать платежи и получать информацию о них.
        </p>
      </div>

      {/* Создание платежа */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Создание платежа</h3>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">POST</span>
              <code className="text-white">/api/developer/payment</code>
            </div>
            <button
              onClick={() => copyToClipboard(`curl -X POST '${process.env.NEXT_PUBLIC_APP_URL || 'https://stellex.space'}/api/developer/payment' \\\n  -H 'Authorization: Bearer ${apiKey}' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    "amount": 100,\n    "description": "Тестовый платеж"\n  }'`)}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Параметры запроса</h4>
              <div className="bg-gray-800 rounded p-4">
                <pre className="text-gray-300 text-sm">
{`{
  "amount": 100,                    // Сумма в STARS (обязательно)
  "description": "Тестовый платеж", // Описание платежа (обязательно)
  "return_url": "https://...",      // URL возврата (опционально)
  "webhook_url": "https://...",     // Webhook URL (опционально)
  "metadata": {                     // Дополнительные данные (опционально)
    "order_id": "12345"
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Ответ</h4>
              <div className="bg-gray-800 rounded p-4">
                <pre className="text-gray-300 text-sm">
{`{
  "success": true,
  "payment": {
    "id": "uuid",
    "amount": 100,
    "description": "Тестовый платеж",
    "status": "pending",
    "payment_url": "https://stellex.space/pay/uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Получение платежей */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Получение платежей</h3>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">GET</span>
              <code className="text-white">/api/developer/payments</code>
            </div>
            <button
              onClick={() => copyToClipboard(`curl -X GET '${process.env.NEXT_PUBLIC_APP_URL || 'https://stellex.space'}/api/developer/payments' \\\n  -H 'Authorization: Bearer ${apiKey}'`)}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Параметры запроса</h4>
              <div className="bg-gray-800 rounded p-4">
                <pre className="text-gray-300 text-sm">
{`GET /api/developer/payments?page=1&limit=20&status=completed

Параметры:
- page: номер страницы (по умолчанию 1)
- limit: количество на странице (по умолчанию 20)
- status: фильтр по статусу (pending, completed, failed)`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Ответ</h4>
              <div className="bg-gray-800 rounded p-4">
                <pre className="text-gray-300 text-sm">
{`{
  "success": true,
  "payments": [...],
  "stats": {
    "total_payments": 10,
    "completed_payments": 8,
    "total_amount": 1500,
    "success_rate": "80.00"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "pages": 1
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderWebhooks = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Webhooks</h2>
        <p className="text-gray-600 mb-6">
          Webhooks позволяют получать уведомления о событиях в реальном времени.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Настройка webhook</h3>
        <p className="text-blue-800 text-sm mb-4">
          Укажите URL webhook при создании платежа или в настройках профиля разработчика.
        </p>
        <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded text-sm">
          https://yoursite.com/webhook/stellex-pay
        </code>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">События webhook</h3>
        
        <div className="space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">payment.completed</h4>
            <p className="text-gray-600 text-sm mb-3">Платеж успешно завершен</p>
            <div className="bg-gray-900 rounded p-3">
              <pre className="text-gray-300 text-sm">
{`{
  "event": "payment.completed",
  "data": {
    "payment_id": "uuid",
    "amount": 100,
    "status": "completed",
    "completed_at": "2024-01-01T00:00:00Z"
  }
}`}
              </pre>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">payment.failed</h4>
            <p className="text-gray-600 text-sm mb-3">Платеж не удался</p>
            <div className="bg-gray-900 rounded p-3">
              <pre className="text-gray-300 text-sm">
{`{
  "event": "payment.failed",
  "data": {
    "payment_id": "uuid",
    "amount": 100,
    "status": "failed",
    "error": "Insufficient funds",
    "failed_at": "2024-01-01T00:00:00Z"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">Безопасность webhook</h3>
            <p className="text-yellow-800 text-sm">
              Всегда проверяйте подпись webhook для подтверждения подлинности запроса. 
              Подпись передается в заголовке X-Stellex-Signature.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderErrors = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Коды ошибок</h2>
        <p className="text-gray-600 mb-6">
          API использует стандартные HTTP коды состояния для индикации успеха или ошибки.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-2">4xx - Ошибки клиента</h3>
          <div className="space-y-2 text-sm">
            <div><code className="bg-red-100 px-2 py-1 rounded">400</code> - Неверные параметры запроса</div>
            <div><code className="bg-red-100 px-2 py-1 rounded">401</code> - Неверный или отсутствующий API ключ</div>
            <div><code className="bg-red-100 px-2 py-1 rounded">403</code> - Доступ запрещен</div>
            <div><code className="bg-red-100 px-2 py-1 rounded">404</code> - Ресурс не найден</div>
            <div><code className="bg-red-100 px-2 py-1 rounded">429</code> - Превышен лимит запросов</div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-2">5xx - Ошибки сервера</h3>
          <div className="space-y-2 text-sm">
            <div><code className="bg-orange-100 px-2 py-1 rounded">500</code> - Внутренняя ошибка сервера</div>
            <div><code className="bg-orange-100 px-2 py-1 rounded">502</code> - Ошибка шлюза</div>
            <div><code className="bg-orange-100 px-2 py-1 rounded">503</code> - Сервис недоступен</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Формат ошибки</h3>
        <div className="bg-gray-900 rounded p-4">
          <pre className="text-gray-300 text-sm">
{`{
  "success": false,
  "error": "Описание ошибки",
  "code": "ERROR_CODE",
  "details": {
    "field": "amount",
    "message": "Сумма должна быть больше 0"
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  )

  const renderSDK = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">SDK и библиотеки</h2>
        <p className="text-gray-600 mb-6">
          Готовые библиотеки для популярных языков программирования.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">JavaScript/Node.js</h3>
          <div className="bg-gray-900 rounded p-4 mb-4">
            <pre className="text-gray-300 text-sm">
{`npm install stellex-pay

import StellexPay from 'stellex-pay';

const client = new StellexPay('${apiKey}');

const payment = await client.payments.create({
  amount: 100,
  description: 'Тестовый платеж'
});`}
            </pre>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <ExternalLink className="w-4 h-4 mr-1" />
            Установить пакет
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Python</h3>
          <div className="bg-gray-900 rounded p-4 mb-4">
            <pre className="text-gray-300 text-sm">
{`pip install stellex-pay

from stellex_pay import StellexPay

client = StellexPay('${apiKey}')

payment = client.payments.create(
    amount=100,
    description='Тестовый платеж'
)`}
            </pre>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <ExternalLink className="w-4 h-4 mr-1" />
            Установить пакет
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">PHP</h3>
          <div className="bg-gray-900 rounded p-4 mb-4">
            <pre className="text-gray-300 text-sm">
{`composer require stellex/pay

use StellexPay\\Client;

$client = new Client('${apiKey}');

$payment = $client->payments->create([
    'amount' => 100,
    'description' => 'Тестовый платеж'
]);`}
            </pre>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <ExternalLink className="w-4 h-4 mr-1" />
            Установить пакет
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Go</h3>
          <div className="bg-gray-900 rounded p-4 mb-4">
            <pre className="text-gray-300 text-sm">
{`go get github.com/stellex/pay-go

import "github.com/stellex/pay-go"

client := stellex.NewClient("${apiKey}")

payment, err := client.Payments.Create(&stellex.PaymentRequest{
    Amount:      100,
    Description: "Тестовый платеж",
})`}
            </pre>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            <ExternalLink className="w-4 h-4 mr-1" />
            Установить пакет
          </button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview()
      case 'authentication': return renderAuthentication()
      case 'payments': return renderPayments()
      case 'webhooks': return renderWebhooks()
      case 'errors': return renderErrors()
      case 'sdk': return renderSDK()
      default: return renderOverview()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex"
      >
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">API Документация</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </motion.div>
    </div>
  )
}
