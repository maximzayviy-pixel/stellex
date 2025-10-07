import { NextRequest, NextResponse } from 'next/server'
import { registerEmail } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password || !firstName) {
      return NextResponse.json(
        { success: false, error: 'Email, пароль и имя обязательны' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Пароль должен содержать минимум 6 символов' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли пользователь с таким email
    const { data: existingUser } = await supabaseAdmin.value
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    // Регистрируем пользователя
    const authResult = await registerEmail(email, password, firstName, lastName)

    if (authResult.success) {
      return NextResponse.json({
        success: true,
        user: authResult.user,
        token: authResult.token
      })
    } else {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
