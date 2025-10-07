import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const {
      telegram_username,
      email,
      project_name,
      project_description,
      project_url,
      company_name,
      expected_volume,
      use_case
    } = await request.json()

    // Валидация обязательных полей
    if (!telegram_username || !email || !project_name || !project_description) {
      return NextResponse.json(
        { success: false, error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    // Сохраняем заявку в базу данных
    const { data, error } = await supabaseAdmin.value
      .from('api_key_requests')
      .insert({
        telegram_username,
        email,
        project_name,
        project_description,
        project_url: project_url || null,
        company_name: company_name || null,
        expected_volume,
        use_case,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('API key request error:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка сохранения заявки' },
        { status: 500 }
      )
    }

    // Здесь можно добавить отправку уведомления админу через Telegram Bot API
    // await sendAdminNotification(data)

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена',
      request_id: data.id
    })
  } catch (error) {
    console.error('API key request error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// Функция для отправки уведомления админу (можно реализовать позже)
async function sendAdminNotification(requestData: any) {
  // Здесь будет код для отправки уведомления через Telegram Bot API
  console.log('New API key request:', requestData)
}
