import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.id || !body.first_name) {
      return NextResponse.json(
        { success: false, error: 'Неверные данные пользователя' },
        { status: 400 }
      )
    }

    const result = await authenticateUser(body.id, body)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
        token: result.token
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Telegram auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
