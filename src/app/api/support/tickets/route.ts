import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Временно отключаем получение тикетов до настройки БД
    return NextResponse.json({ 
      success: false, 
      error: 'Support tickets temporarily disabled. Please contact support directly.' 
    }, { status: 503 })
  } catch (error) {
    console.error('Tickets API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Временно отключаем создание тикетов до настройки БД
    return NextResponse.json({ 
      success: false, 
      error: 'Support tickets temporarily disabled. Please contact support directly.' 
    }, { status: 503 })
  } catch (error) {
    console.error('Tickets API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Временно отключаем обновление тикетов до настройки БД
    return NextResponse.json({ 
      success: false, 
      error: 'Support tickets temporarily disabled. Please contact support directly.' 
    }, { status: 503 })
  } catch (error) {
    console.error('Tickets API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}