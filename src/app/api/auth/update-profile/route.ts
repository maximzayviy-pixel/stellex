import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function PUT(request: NextRequest) {
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

    const { first_name, last_name, email } = await request.json()

    // Обновляем профиль пользователя
    const { data, error } = await supabaseAdmin.value
      .from('users')
      .update({
        first_name: first_name || null,
        last_name: last_name || null,
        email: email || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', decoded.userId)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка обновления профиля' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: data
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
