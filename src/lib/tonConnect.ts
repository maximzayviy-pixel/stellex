import { TonConnect } from '@tonconnect/sdk'
import { TonConnectUI } from '@tonconnect/ui'

// Конфигурация TON Connect
const manifestUrl = 'https://stellex.space/tonconnect-manifest.json'

// Проверяем, что мы в браузере
const isBrowser = typeof window !== 'undefined'

// Создаем экземпляр TonConnect только в браузере
export const tonConnect = isBrowser ? new TonConnect({
  manifestUrl
}) : null

// Создаем UI для TonConnect только в браузере
export const tonConnectUI = isBrowser ? new TonConnectUI({
  manifestUrl,
  buttonRootId: 'ton-connect-button',
  language: 'ru'
}) : null

// Инициализация TON Connect
export const initTonConnect = async () => {
  if (!isBrowser || !tonConnectUI) {
    console.log('❌ TON Connect not available in SSR')
    return false
  }
  
  try {
    await tonConnectUI.init()
    console.log('✅ TON Connect initialized successfully')
    return true
  } catch (error) {
    console.error('❌ TON Connect initialization failed:', error)
    return false
  }
}

// Получение адреса кошелька
export const getWalletAddress = () => {
  if (!isBrowser || !tonConnectUI) return null
  const wallet = tonConnectUI.account
  return wallet?.address || null
}

// Получение баланса TON
export const getTonBalance = async (address: string) => {
  try {
    const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`)
    const data = await response.json()
    return parseFloat(data.result) / 1000000000 // Конвертируем из nanoTON в TON
  } catch (error) {
    console.error('Error fetching TON balance:', error)
    return 0
  }
}

// Отправка TON
export const sendTon = async (toAddress: string, amount: number, comment?: string) => {
  if (!isBrowser || !tonConnectUI) {
    throw new Error('TON Connect not available')
  }
  
  try {
    const transaction = {
      messages: [
        {
          address: toAddress,
          amount: (amount * 1000000000).toString(), // Конвертируем в nanoTON
          payload: comment || ''
        }
      ],
      validUntil: Math.floor(Date.now() / 1000) + 600 // 10 минут
    }

    const result = await tonConnectUI.sendTransaction(transaction)
    return result
  } catch (error) {
    console.error('Error sending TON:', error)
    throw error
  }
}

// Конвертация TON в Telegram Stars (примерный курс)
export const tonToStars = (tonAmount: number) => {
  // Примерный курс: 1 TON = 100 Telegram Stars
  return Math.floor(tonAmount * 100)
}

// Конвертация Telegram Stars в TON
export const starsToTon = (starsAmount: number) => {
  // Примерный курс: 100 Telegram Stars = 1 TON
  return starsAmount / 100
}
