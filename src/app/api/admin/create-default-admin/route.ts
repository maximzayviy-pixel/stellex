import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const adminEmail = 'admin@stellex.space'
    const adminPassword = 'admin123456'
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Проверяем, существует ли уже админ
    const { data: existingAdmin } = await supabaseAdmin.value
      .from('users')
      .select('id, role')
      .eq('email', adminEmail)
      .single()

    if (existingAdmin) {
      // Если админ существует, обновляем его роль
      const { error: updateError } = await supabaseAdmin.value
        .from('users')
        .update({ role: 'admin' })
        .eq('email', adminEmail)

      if (updateError) {
        console.error('Admin role update error:', updateError)
        return NextResponse.json(
          { success: false, error: 'Ошибка обновления роли администратора' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Администратор уже существует, роль обновлена',
        admin: {
          email: adminEmail,
          role: 'admin'
        }
      })
    }

    // Создаем нового админа
    const { data: admin, error } = await supabaseAdmin.value
      .from('users')
      .insert({
        id: uuidv4(),
        email: adminEmail,
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'Stellex',
        role: 'admin',
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Admin creation error:', error)
      return NextResponse.json(
        { success: false, error: 'Ошибка создания администратора' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Администратор создан успешно',
      admin: {
        id: admin.id,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      }
    })
  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

