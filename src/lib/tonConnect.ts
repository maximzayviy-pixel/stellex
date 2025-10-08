// Безопасная инициализация TON Connect
let tonConnect: any = null
let tonConnectUI: any = null

// Конфигурация TON Connect
const manifestUrl = 'https://stellex.space/tonconnect-manifest.json'

// Проверяем, что мы в браузере
const isBrowser = typeof window !== 'undefined'

// Безопасная инициализация TON Connect
const initTonConnectSDK = () => {
  if (!isBrowser) return { tonConnect: null, tonConnectUI: null }
  
  try {
    // Динамический импорт для избежания SSR проблем
    const { TonConnect } = require('@tonconnect/sdk')
    const { TonConnectUI } = require('@tonconnect/ui')
    
    tonConnect = new TonConnect({
      manifestUrl
    })
    
    tonConnectUI = new TonConnectUI({
      manifestUrl,
      buttonRootId: 'ton-connect-button',
      language: 'ru'
    })
    
    return { tonConnect, tonConnectUI }
  } catch (error) {
    console.error('TON Connect initialization error:', error)
    return { tonConnect: null, tonConnectUI: null }
  }
}

// Инициализируем при первом вызове
const { tonConnect: _tonConnect, tonConnectUI: _tonConnectUI } = initTonConnectSDK()

export { _tonConnect as tonConnect, _tonConnectUI as tonConnectUI }

// Инициализация TON Connect
export const initTonConnect = async () => {
  if (!isBrowser) {
    console.log('❌ TON Connect not available in SSR')
    return false
  }
  
  try {
    const { tonConnectUI: ui } = initTonConnectSDK()
    if (!ui) {
      console.log('❌ TON Connect UI not available')
      return false
    }
    
    await ui.init()
    console.log('✅ TON Connect initialized successfully')
    return true
  } catch (error) {
    console.error('❌ TON Connect initialization failed:', error)
    return false
  }
}

// Получение адреса кошелька
export const getWalletAddress = () => {
  if (!isBrowser) return null
  
  try {
    const { tonConnectUI: ui } = initTonConnectSDK()
    if (!ui) return null
    
    const wallet = ui.account
    return wallet?.address || null
  } catch (error) {
    console.error('Error getting wallet address:', error)
    return null
  }
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
  if (!isBrowser) {
    throw new Error('TON Connect not available in SSR')
  }
  
  try {
    const { tonConnectUI: ui } = initTonConnectSDK()
    if (!ui) {
      throw new Error('TON Connect UI not available')
    }
    
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

    const result = await ui.sendTransaction(transaction)
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
