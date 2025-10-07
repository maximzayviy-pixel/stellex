import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Telegram auth request body:', JSON.stringify(body, null, 2))
    
    if (!body.id || !body.first_name) {
      console.log('Missing required fields:', { id: body.id, first_name: body.first_name })
      return NextResponse.json(
        { success: false, error: 'Неверные данные пользователя' },
        { status: 400 }
      )
    }

    console.log('Authenticating user with ID:', body.id)
    const result = await authenticateUser(body.id, body)
    
    if (result.success) {
      console.log('Authentication successful for user:', body.id)
      return NextResponse.json({
        success: true,
        user: result.user,
        token: result.token
      })
    } else {
      console.log('Authentication failed:', result.error)
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
