import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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
    const { fromCardId, toCardNumber, amount, description } = body

    if (!fromCardId || !toCardNumber || !amount) {
      return NextResponse.json(
        { success: false, error: 'Неверные данные' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Сумма должна быть больше 0' },
        { status: 400 }
      )
    }

    // Получаем карту отправителя
    const { data: fromCard, error: fromCardError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', fromCardId)
      .eq('user_id', decoded.userId)
      .single()

    if (fromCardError || !fromCard) {
      return NextResponse.json(
        { success: false, error: 'Карта отправителя не найдена' },
        { status: 404 }
      )
    }

    if (fromCard.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Карта отправителя неактивна' },
        { status: 400 }
      )
    }

    if (fromCard.balance < amount) {
      return NextResponse.json(
        { success: false, error: 'Недостаточно средств' },
        { status: 400 }
      )
    }

    // Получаем карту получателя
    const { data: toCard, error: toCardError } = await supabase
      .from('cards')
      .select('*, users!inner(*)')
      .eq('card_number', toCardNumber)
      .single()

    if (toCardError || !toCard) {
      return NextResponse.json(
        { success: false, error: 'Карта получателя не найдена' },
        { status: 404 }
      )
    }

    if (toCard.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Карта получателя неактивна' },
        { status: 400 }
      )
    }

    // Проверяем, что не переводим самому себе
    if (fromCard.id === toCard.id) {
      return NextResponse.json(
        { success: false, error: 'Нельзя переводить самому себе' },
        { status: 400 }
      )
    }

    // Выполняем перевод в транзакции
    const { error: transferError } = await supabase.rpc('transfer_money', {
      from_card_id: fromCardId,
      to_card_id: toCard.id,
      transfer_amount: amount,
      transfer_description: description || 'Перевод между картами'
    })

    if (transferError) {
      console.error('Transfer error:', transferError)
      return NextResponse.json(
        { success: false, error: 'Ошибка перевода' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Перевод выполнен успешно'
    })
  } catch (error) {
    console.error('Transfer error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
