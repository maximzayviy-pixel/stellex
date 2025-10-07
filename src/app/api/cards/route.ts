import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { createCard } from '@/lib/cardUtils'
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
    const { user_id, holder_name } = body

    if (!user_id || !holder_name) {
      return NextResponse.json(
        { success: false, error: 'Неверные данные' },
        { status: 400 }
      )
    }

    // Проверяем, что пользователь создает карту для себя
    if (decoded.userId !== user_id) {
      return NextResponse.json(
        { success: false, error: 'Недостаточно прав' },
        { status: 403 }
      )
    }

    // Проверяем лимит карт (максимум 3)
          const { data: existingCards, error: countError } = await supabaseAdmin.value
      .from('cards')
      .select('id')
      .eq('user_id', user_id)

    if (countError) {
      return NextResponse.json(
        { success: false, error: 'Ошибка проверки карт' },
        { status: 500 }
      )
    }

    if (existingCards && existingCards.length >= 3) {
      return NextResponse.json(
        { success: false, error: 'Максимум 3 карты на аккаунт' },
        { status: 400 }
      )
    }

    // Создаем новую карту
    const newCard = createCard(user_id, holder_name)

    // Сохраняем в базу данных
    const { data: card, error: insertError } = await supabaseAdmin.value
      .from('cards')
      .insert([newCard])
      .select()
      .single()

    if (insertError) {
      console.error('Card creation error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Ошибка создания карты' },
        { status: 500 }
      )
    }

    // Создаем транзакцию создания карты
    const { error: transactionError } = await supabaseAdmin.value
      .from('transactions')
      .insert({
        user_id: user_id,
        card_id: card.id,
        type: 'card_creation',
        amount: 0,
        description: 'Создание новой карты',
        status: 'completed'
      })

    if (transactionError) {
      console.error('Transaction creation error:', transactionError)
    }

    return NextResponse.json({
      success: true,
      card
    })
  } catch (error) {
    console.error('Create card error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    // Получаем карты пользователя
    const { data: cards, error } = await supabaseAdmin.value
      .from('cards')
      .select('*')
      .eq('user_id', decoded.userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get cards error:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка получения карт' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      cards: cards || []
    })
  } catch (error) {
    console.error('Get cards error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
