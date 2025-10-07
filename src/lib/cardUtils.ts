import { Card, CardCreationData } from '@/types'

export function generateCardNumber(): string {
  // Генерируем номер карты с префиксом 666
  const prefix = '666'
  const randomDigits = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')
  return prefix + randomDigits
}

export function generateCVV(): string {
  return Math.floor(Math.random() * 1000).toString().padStart(3, '0')
}

export function generateExpiryDate(): string {
  const now = new Date()
  const year = now.getFullYear() + 5 // Карта действительна 5 лет
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  return `${month}/${year.toString().slice(-2)}`
}

export function formatCardNumber(cardNumber: string): string {
  // Форматируем номер карты для отображения: 6666 6666 6666 6666
  return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function maskCardNumber(cardNumber: string): string {
  // Маскируем номер карты: 6666 **** **** 6666
  const formatted = formatCardNumber(cardNumber)
  const parts = formatted.split(' ')
  return `${parts[0]} **** **** ${parts[3]}`
}

export function createCard(userId: string, holderName: string): Card {
  const now = new Date().toISOString()
  
  return {
    id: generateId(),
    user_id: userId,
    card_number: generateCardNumber(),
    holder_name: holderName,
    expiry_date: generateExpiryDate(),
    cvv: generateCVV(),
    balance: 0,
    status: 'pending',
    created_at: now,
    updated_at: now
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export function validateCardNumber(cardNumber: string): boolean {
  // Простая валидация номера карты (должен начинаться с 666 и иметь 16 цифр)
  const cleaned = cardNumber.replace(/\s/g, '')
  return /^666\d{13}$/.test(cleaned)
}

export function calculateStarsFromRubles(rubles: number): number {
  // 2 звезды = 1 рубль
  return Math.floor(rubles * 2)
}

export function calculateRublesFromStars(stars: number): number {
  // 1 рубль = 2 звезды
  return Math.floor(stars / 2)
}
