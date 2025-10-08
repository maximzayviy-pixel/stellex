import { NextRequest, NextResponse } from 'next/server'
import { authenticateTelegramInitData } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json()

    if (!initData) {
      return NextResponse.json(
        { success: false, error: 'Init data is required' },
        { status: 400 }
      )
    }

    const result = await authenticateTelegramInitData(initData)

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
    console.error('Telegram init auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
