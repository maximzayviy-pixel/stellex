import { NextResponse } from 'next/server'
import { loginEmail } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    // Авторизуем пользователя
    const authResult = await loginEmail(email, password)

    if (authResult.success) {
      return NextResponse.json({
        success: true,
        user: authResult.user,
        token: authResult.token
      })
    } else {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
