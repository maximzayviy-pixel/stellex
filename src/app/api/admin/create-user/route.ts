import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = verifyToken(token)

    console.log('Decoded token:', decodedToken)

    if (!decodedToken) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })
    }

    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: `Admin access required. Current role: ${decodedToken.role}` 
      }, { status: 403 })
    }

    const { email, password, firstName, lastName, role } = await request.json()

    if (!email || !password || !firstName || !role) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    if (!['developer', 'support'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 })
    }

    // Проверяем, существует ли пользователь с таким email
    const { data: existingUser } = await supabaseAdmin.value.value
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 400 })
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10)

    // Создаем пользователя
    const { data: user, error: userError } = await supabaseAdmin.value.value
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role,
        email_verified: true, // Админ создает верифицированных пользователей
        total_spent: 0
      })
      .select()
      .single()

    if (userError) {
      console.error('Error creating user:', userError)
      return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
    }

    // Если создаем разработчика, создаем запись в таблице developers
    if (role === 'developer') {
      const apiKey = `sk_${uuidv4().replace(/-/g, '')}`
      
      const { error: developerError } = await supabaseAdmin.value.value
        .from('developers')
        .insert({
          user_id: user.id,
          api_key: apiKey,
          commission_rate: 2.5,
          total_earnings: 0,
          is_active: true
        })

      if (developerError) {
        console.error('Error creating developer record:', developerError)
        // Не возвращаем ошибку, так как пользователь уже создан
      }
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        created_at: user.created_at
      }
    })
  } catch (error) {
    console.error('Admin create user API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
