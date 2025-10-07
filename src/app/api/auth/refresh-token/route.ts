import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

    // Получаем актуальные данные пользователя из базы
    const { data: user, error } = await supabaseAdmin.value
      .from('users')
      .select('id, telegram_id, role, first_name, last_name, email')
      .eq('id', decoded.userId)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Создаем новый токен с актуальной ролью
    const newToken = jwt.sign(
      { 
        userId: user.id, 
        telegramId: user.telegram_id,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    return NextResponse.json({
      success: true,
      token: newToken,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

