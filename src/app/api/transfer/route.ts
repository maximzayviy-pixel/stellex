import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

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
    const { fromCardId, toCardNumber, amount } = body

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

    // Валидация номера карты получателя
    const cleanCardNumber = toCardNumber.replace(/\s/g, '')
    if (!/^666\d{13}$/.test(cleanCardNumber)) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат номера карты. Карта должна начинаться с 666 и содержать 16 цифр' },
        { status: 400 }
      )
    }

    // Получаем карту отправителя
    const { data: fromCard, error: fromCardError } = await supabaseAdmin.value
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
    const { data: toCard, error: toCardError } = await supabaseAdmin.value
      .from('cards')
      .select('*')
      .eq('card_number', cleanCardNumber)
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

    // Выполняем перевод
    const newFromBalance = fromCard.balance - amount
    const newToBalance = toCard.balance + amount

    // Обновляем баланс карты отправителя
    const { error: updateFromError } = await supabaseAdmin.value
      .from('cards')
      .update({ balance: newFromBalance })
      .eq('id', fromCardId)

    if (updateFromError) {
      console.error('Update from card error:', updateFromError)
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления карты отправителя' },
        { status: 500 }
      )
    }

    // Обновляем баланс карты получателя
    const { error: updateToError } = await supabaseAdmin.value
      .from('cards')
      .update({ balance: newToBalance })
      .eq('id', toCard.id)

    if (updateToError) {
      console.error('Update to card error:', updateToError)
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления карты получателя' },
        { status: 500 }
      )
    }

    // Создаем записи транзакций
    const { error: transactionFromError } = await supabaseAdmin.value
      .from('transactions')
      .insert({
        user_id: decoded.userId,
        card_id: fromCardId,
        type: 'transfer',
        amount: -amount,
        description: `Перевод на карту ${toCardNumber}`,
        status: 'completed'
      })

    if (transactionFromError) {
      console.error('Transaction from error:', transactionFromError)
    }

    const { error: transactionToError } = await supabaseAdmin.value
      .from('transactions')
      .insert({
        user_id: toCard.user_id,
        card_id: toCard.id,
        type: 'transfer',
        amount: amount,
        description: `Перевод с карты ${fromCard.card_number}`,
        status: 'completed'
      })

    if (transactionToError) {
      console.error('Transaction to error:', transactionToError)
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
