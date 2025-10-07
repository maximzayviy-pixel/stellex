'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  Copy, 
  Download, 
  Eye, 
  Palette, 
  Settings,
  Zap,
  ExternalLink,
  X
} from 'lucide-react'

interface ButtonStyle {
  backgroundColor: string
  textColor: string
  borderColor: string
  borderRadius: number
  padding: number
  fontSize: number
  fontWeight: string
  width: string
  height: string
  shadow: boolean
  gradient: boolean
  icon: boolean
}

interface ButtonGeneratorProps {
  apiKey: string
  onClose: () => void
}

export default function ButtonGenerator({ apiKey, onClose }: ButtonGeneratorProps) {
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
    backgroundColor: '#8B5CF6',
    textColor: '#FFFFFF',
    borderColor: '#7C3AED',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
    width: 'auto',
    height: 'auto',
    shadow: true,
    gradient: true,
    icon: true
  })

  const [paymentData, setPaymentData] = useState({
    amount: 100,
    description: 'Оплата товара',
    returnUrl: '',
    webhookUrl: ''
  })

  const [generatedCode, setGeneratedCode] = useState('')
  const [previewMode, setPreviewMode] = useState<'html' | 'react' | 'vue' | 'angular'>('html')

  const generateButtonCode = () => {
    const style = `
      background: ${buttonStyle.gradient 
        ? `linear-gradient(135deg, ${buttonStyle.backgroundColor}, ${buttonStyle.borderColor})` 
        : buttonStyle.backgroundColor};
      color: ${buttonStyle.textColor};
      border: 2px solid ${buttonStyle.borderColor};
      border-radius: ${buttonStyle.borderRadius}px;
      padding: ${buttonStyle.padding}px ${buttonStyle.padding * 1.5}px;
      font-size: ${buttonStyle.fontSize}px;
      font-weight: ${buttonStyle.fontWeight};
      width: ${buttonStyle.width};
      height: ${buttonStyle.height};
      ${buttonStyle.shadow ? 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);' : ''}
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
      border: none;
      outline: none;
    `

    const hoverStyle = `
      transform: translateY(-2px);
      ${buttonStyle.shadow ? 'box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);' : ''}
    `

    const iconCode = buttonStyle.icon ? '⚡' : ''
    const buttonText = 'ОПЛАТИТЬ С STELLEX PAY'

    if (previewMode === 'html') {
      return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Stellex Pay Button</title>
    <style>
        .stellex-pay-button {
            ${style}
        }
        .stellex-pay-button:hover {
            ${hoverStyle}
        }
    </style>
</head>
<body>
    <button class="stellex-pay-button" onclick="openStellexPay()">
        ${iconCode}${buttonText}
    </button>

    <script>
        function openStellexPay() {
            const paymentData = {
                amount: ${paymentData.amount},
                description: '${paymentData.description}',
                return_url: '${paymentData.returnUrl}',
                webhook_url: '${paymentData.webhookUrl}'
            };

            fetch('${process.env.NEXT_PUBLIC_APP_URL || 'https://stellex.space'}/api/developer/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ${apiKey}'
                },
                body: JSON.stringify(paymentData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.open(data.payment.payment_url, '_blank');
                } else {
                    alert('Ошибка создания платежа: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ошибка создания платежа');
            });
        }
    </script>
</body>
</html>`
    }

    if (previewMode === 'react') {
      return `
import React from 'react';

const StellexPayButton = () => {
  const openStellexPay = async () => {
    const paymentData = {
      amount: ${paymentData.amount},
      description: '${paymentData.description}',
      return_url: '${paymentData.returnUrl}',
      webhook_url: '${paymentData.webhookUrl}'
    };

    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_APP_URL || 'https://stellex.space'}/api/developer/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${apiKey}'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (data.success) {
        window.open(data.payment.payment_url, '_blank');
      } else {
        alert('Ошибка создания платежа: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка создания платежа');
    }
  };

  return (
    <button 
      className="stellex-pay-button"
      onClick={openStellexPay}
      style={{
        ${style}
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        ${buttonStyle.shadow ? 'e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.25)";' : ''}
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        ${buttonStyle.shadow ? 'e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";' : ''}
      }}
    >
      ${iconCode}${buttonText}
    </button>
  );
};

export default StellexPayButton;`
    }

    return generatedCode
  }

  const copyToClipboard = async () => {
    const code = generateButtonCode()
    try {
      await navigator.clipboard.writeText(code)
      alert('Код скопирован в буфер обмена!')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadCode = () => {
    const code = generateButtonCode()
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stellex-pay-button.${previewMode === 'html' ? 'html' : 'jsx'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Генератор кнопки Stellex Pay</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Настройки */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Настройки платежа
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Сумма (STARS)
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <input
                    type="text"
                    value={paymentData.description}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL возврата (опционально)
                  </label>
                  <input
                    type="url"
                    value={paymentData.returnUrl}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, returnUrl: e.target.value }))}
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
                    value={paymentData.webhookUrl}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://yoursite.com/webhook"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Стиль кнопки
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Цвет фона
                    </label>
                    <input
                      type="color"
                      value={buttonStyle.backgroundColor}
                      onChange={(e) => setButtonStyle(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Цвет текста
                    </label>
                    <input
                      type="color"
                      value={buttonStyle.textColor}
                      onChange={(e) => setButtonStyle(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Размер шрифта: {buttonStyle.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={buttonStyle.fontSize}
                      onChange={(e) => setButtonStyle(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Отступы: {buttonStyle.padding}px
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={buttonStyle.padding}
                      onChange={(e) => setButtonStyle(prev => ({ ...prev, padding: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Радиус скругления: {buttonStyle.borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={buttonStyle.borderRadius}
                    onChange={(e) => setButtonStyle(prev => ({ ...prev, borderRadius: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={buttonStyle.gradient}
                      onChange={(e) => setButtonStyle(prev => ({ ...prev, gradient: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Градиентный фон</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={buttonStyle.shadow}
                      onChange={(e) => setButtonStyle(prev => ({ ...prev, shadow: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Тень</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={buttonStyle.icon}
                      onChange={(e) => setButtonStyle(prev => ({ ...prev, icon: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Иконка</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Предварительный просмотр и код */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Предварительный просмотр
              </h3>
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex justify-center">
                  <button
                    style={{
                      background: buttonStyle.gradient 
                        ? `linear-gradient(135deg, ${buttonStyle.backgroundColor}, ${buttonStyle.borderColor})` 
                        : buttonStyle.backgroundColor,
                      color: buttonStyle.textColor,
                      border: `2px solid ${buttonStyle.borderColor}`,
                      borderRadius: `${buttonStyle.borderRadius}px`,
                      padding: `${buttonStyle.padding}px ${buttonStyle.padding * 1.5}px`,
                      fontSize: `${buttonStyle.fontSize}px`,
                      fontWeight: buttonStyle.fontWeight,
                      width: buttonStyle.width,
                      height: buttonStyle.height,
                      boxShadow: buttonStyle.shadow ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      border: 'none',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      if (buttonStyle.shadow) {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      if (buttonStyle.shadow) {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    {buttonStyle.icon && '⚡'}
                    ОПЛАТИТЬ С STELLEX PAY
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Код
                </h3>
                <div className="flex gap-2">
                  <select
                    value={previewMode}
                    onChange={(e) => setPreviewMode(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="html">HTML</option>
                    <option value="react">React</option>
                    <option value="vue">Vue</option>
                    <option value="angular">Angular</option>
                  </select>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    Копировать
                  </button>
                  <button
                    onClick={downloadCode}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Скачать
                  </button>
                </div>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generateButtonCode()}</code>
              </pre>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
