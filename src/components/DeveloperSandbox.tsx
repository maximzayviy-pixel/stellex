'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Code, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Loader,
  Send,
  Zap,
  Eye,
  X
} from 'lucide-react'

interface SandboxProps {
  apiKey: string
  onClose: () => void
}

interface TestResult {
  success: boolean
  data?: any
  error?: string
  responseTime?: number
}

export default function DeveloperSandbox({ apiKey, onClose }: SandboxProps) {
  const [activeTest, setActiveTest] = useState<'payment' | 'payments' | 'custom'>('payment')
  const [testData, setTestData] = useState({
    amount: 100,
    description: 'Тестовый платеж',
    return_url: '',
    webhook_url: ''
  })
  const [customEndpoint, setCustomEndpoint] = useState('/api/developer/payment')
  const [customMethod, setCustomMethod] = useState('POST')
  const [customBody, setCustomBody] = useState('{\n  "amount": 100,\n  "description": "Тестовый платеж"\n}')
  const [isRunning, setIsRunning] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)

  const runTest = async () => {
    setIsRunning(true)
    setTestResult(null)
    
    const startTime = Date.now()
    
    try {
      let url = ''
      let method = 'POST'
      let body = ''

      if (activeTest === 'payment') {
        url = '/api/developer/payment'
        method = 'POST'
        body = JSON.stringify(testData)
      } else if (activeTest === 'payments') {
        url = '/api/developer/payments'
        method = 'GET'
      } else {
        url = customEndpoint
        method = customMethod
        body = customBody
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: method !== 'GET' ? body : undefined
      })

      const responseTime = Date.now() - startTime
      const data = await response.json()

      setTestResult({
        success: response.ok,
        data: data,
        error: response.ok ? undefined : data.error || 'Unknown error',
        responseTime
      })
    } catch (error) {
      const responseTime = Date.now() - startTime
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        responseTime
      })
    } finally {
      setIsRunning(false)
    }
  }

  const copyResult = () => {
    if (testResult) {
      navigator.clipboard.writeText(JSON.stringify(testResult, null, 2))
      alert('Результат скопирован в буфер обмена!')
    }
  }

  const quickTests = [
    {
      name: 'Создать платеж',
      description: 'Тест создания нового платежа',
      test: 'payment',
      icon: Send
    },
    {
      name: 'Получить платежи',
      description: 'Тест получения списка платежей',
      test: 'payments',
      icon: Eye
    },
    {
      name: 'Кастомный запрос',
      description: 'Тест произвольного API запроса',
      test: 'custom',
      icon: Code
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Песочница для тестирования API</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левая панель - настройки тестов */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые тесты</h3>
              <div className="space-y-3">
                {quickTests.map((test) => {
                  const Icon = test.icon
                  return (
                    <button
                      key={test.test}
                      onClick={() => setActiveTest(test.test as any)}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        activeTest === test.test
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-purple-600" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{test.name}</div>
                          <div className="text-sm text-gray-500">{test.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Настройки теста */}
            {activeTest === 'payment' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки платежа</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Сумма (STARS)
                    </label>
                    <input
                      type="number"
                      value={testData.amount}
                      onChange={(e) => setTestData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Описание
                    </label>
                    <input
                      type="text"
                      value={testData.description}
                      onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return URL (опционально)
                    </label>
                    <input
                      type="url"
                      value={testData.return_url}
                      onChange={(e) => setTestData(prev => ({ ...prev, return_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://yoursite.com/success"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Webhook URL (опционально)
                    </label>
                    <input
                      type="url"
                      value={testData.webhook_url}
                      onChange={(e) => setTestData(prev => ({ ...prev, webhook_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://yoursite.com/webhook"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTest === 'custom' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Кастомный запрос</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endpoint
                    </label>
                    <input
                      type="text"
                      value={customEndpoint}
                      onChange={(e) => setCustomEndpoint(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="/api/developer/payment"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Method
                    </label>
                    <select
                      value={customMethod}
                      onChange={(e) => setCustomMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Request Body (JSON)
                    </label>
                    <textarea
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                      placeholder='{\n  "amount": 100,\n  "description": "Тестовый платеж"\n}'
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Кнопка запуска теста */}
            <button
              onClick={runTest}
              disabled={isRunning}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isRunning ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              <span>{isRunning ? 'Выполняется...' : 'Запустить тест'}</span>
            </button>
          </div>

          {/* Правая панель - результаты */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Результат теста</h3>
              
              {!testResult ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Запустите тест, чтобы увидеть результат</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Статус */}
                  <div className="flex items-center space-x-3">
                    {testResult.success ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <div>
                      <div className={`font-semibold ${
                        testResult.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {testResult.success ? 'Успешно' : 'Ошибка'}
                      </div>
                      {testResult.responseTime && (
                        <div className="text-sm text-gray-500">
                          Время ответа: {testResult.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ошибка */}
                  {testResult.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-red-800 font-medium mb-1">Ошибка:</div>
                      <div className="text-red-700 text-sm">{testResult.error}</div>
                    </div>
                  )}

                  {/* Данные ответа */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-medium">Response Data</div>
                      <button
                        onClick={copyResult}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Примеры запросов */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Примеры запросов</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-2">Создание платежа</div>
                  <code className="text-sm text-gray-700 block">
                    POST /api/developer/payment<br/>
                    Authorization: Bearer {apiKey}<br/>
                    {JSON.stringify({ amount: 100, description: "Тестовый платеж" }, null, 2)}
                  </code>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-2">Получение платежей</div>
                  <code className="text-sm text-gray-700 block">
                    GET /api/developer/payments<br/>
                    Authorization: Bearer {apiKey}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
