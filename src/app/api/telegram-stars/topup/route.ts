import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { calculateRublesFromStars } from '@/lib/cardUtils'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Токен не предоставлен' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Неверный токен' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { cardId, starsAmount } = body

    if (!cardId || !starsAmount) {
      return NextResponse.json(
        { success: false, error: 'Неверные данные' },
        { status: 400 }
      )
    }

    if (starsAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Количество звезд должно быть больше 0' },
        { status: 400 }
      )
    }

    // Получаем карту
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .eq('user_id', decoded.userId)
      .single()

    if (cardError || !card) {
      return NextResponse.json(
        { success: false, error: 'Карта не найдена' },
        { status: 404 }
      )
    }

    if (card.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Карта неактивна' },
        { status: 400 }
      )
    }

    // Конвертируем звезды в рубли
    const rublesAmount = calculateRublesFromStars(starsAmount)

    if (rublesAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Недостаточное количество звезд для конвертации' },
        { status: 400 }
      )
    }

    // Обновляем баланс карты
    const { error: updateError } = await supabase
      .from('cards')
      .update({
        balance: card.balance + rublesAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', cardId)

    if (updateError) {
      console.error('Balance update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления баланса' },
        { status: 500 }
      )
    }

    // Создаем транзакцию
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: decoded.userId,
        card_id: cardId,
        type: 'telegram_stars_topup',
        amount: rublesAmount,
        description: `Пополнение звездами Telegram (${starsAmount} ⭐)`,
        status: 'completed'
      })

    if (transactionError) {
      console.error('Transaction creation error:', transactionError)
    }

    return NextResponse.json({
      success: true,
      message: 'Пополнение выполнено успешно',
      rublesAmount
    })
  } catch (error) {
    console.error('Stars topup error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
