const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

// Замените на ваши реальные данные Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY'

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseServiceKey === 'YOUR_SERVICE_ROLE_KEY') {
  console.error('❌ Необходимо установить переменные окружения:')
  console.error('NEXT_PUBLIC_SUPABASE_URL')
  console.error('SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdmin() {
  try {
    console.log('🔧 Создание администратора...')

    const adminEmail = 'admin@stellex.space'
    const adminPassword = 'admin123456'
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Проверяем, существует ли уже админ
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminEmail)
      .single()

    if (existingAdmin) {
      console.log('✅ Администратор уже существует')
      
      // Обновляем роль на admin
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('email', adminEmail)

      if (updateError) {
        console.error('❌ Ошибка обновления роли:', updateError)
        return
      }

      console.log('✅ Роль обновлена на admin')
      return
    }

    // Создаем нового админа
    const { data: admin, error } = await supabase
      .from('users')
      .insert({
        id: uuidv4(),
        email: adminEmail,
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'Stellex',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Ошибка создания администратора:', error)
      return
    }

    console.log('✅ Администратор создан успешно!')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Password:', adminPassword)
    console.log('🆔 ID:', admin.id)

  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

createAdmin()
