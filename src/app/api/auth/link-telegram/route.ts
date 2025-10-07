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

    const { telegramId, firstName, lastName, username, languageCode, isPremium } = await request.json()

    if (!telegramId || !firstName) {
      return NextResponse.json(
        { success: false, error: 'Данные Telegram обязательны' },
        { status: 400 }
      )
    }

    // Проверяем, не привязан ли уже этот Telegram ID к другому аккаунту
    const { data: existingTelegramUser } = await supabaseAdmin.value.value
      .from('users')
      .select('id, email')
      .eq('telegram_id', telegramId)
      .single()

    if (existingTelegramUser) {
      return NextResponse.json(
        { success: false, error: 'Этот Telegram аккаунт уже привязан к другому пользователю' },
        { status: 400 }
      )
    }

    // Обновляем пользователя, добавляя данные Telegram
    const { data: updatedUser, error: updateError } = await supabaseAdmin.value.value
      .from('users')
      .update({
        telegram_id: telegramId,
        first_name: firstName,
        last_name: lastName,
        username: username,
        language_code: languageCode,
        is_premium: isPremium,
        updated_at: new Date().toISOString()
      })
      .eq('id', decoded.userId)
      .select()
      .single()

    if (updateError) {
      console.error('Error linking Telegram:', updateError)
      return NextResponse.json(
        { success: false, error: 'Ошибка привязки Telegram' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Telegram успешно привязан к аккаунту'
    })
  } catch (error) {
    console.error('Link Telegram API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
