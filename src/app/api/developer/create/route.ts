import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

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

    // Проверяем, что пользователь - администратор
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Доступ только для администраторов' },
        { status: 403 }
      )
    }

    const { user_id, company_name, website, webhook_url, commission_rate } = await request.json()

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'ID пользователя обязателен' },
        { status: 400 }
      )
    }

    // Генерируем API ключ
    const apiKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    // Создаем аккаунт разработчика
    const { data, error } = await supabaseAdmin.value
      .from('developers')
      .insert({
        user_id,
        company_name: company_name || null,
        website: website || null,
        webhook_url: webhook_url || null,
        commission_rate: commission_rate || 0.05,
        api_key: apiKey,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Developer creation error:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка создания аккаунта разработчика' },
        { status: 500 }
      )
    }

    // Обновляем роль пользователя на developer
    const { error: roleError } = await supabaseAdmin.value
      .from('users')
      .update({ role: 'developer' })
      .eq('id', user_id)

    if (roleError) {
      console.error('Role update error:', roleError)
    }

    return NextResponse.json({
      success: true,
      developer: data
    })
  } catch (error) {
    console.error('Developer creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
