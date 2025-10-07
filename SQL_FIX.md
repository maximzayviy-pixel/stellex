# 🔧 Исправление ошибки SQL: "operator does not exist: uuid = text"

## 🚨 Проблема
```
ERROR: 42883: operator does not exist: uuid = text
HINT: No operator matches the given name and argument types. You might need to add explicit type casts.
```

## ✅ Решение

### 1. Удалите старые RLS политики
В Supabase SQL Editor выполните:

```sql
-- Удаляем все существующие политики
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own cards" ON cards;
DROP POLICY IF EXISTS "Users can insert own cards" ON cards;
DROP POLICY IF EXISTS "Users can update own cards" ON cards;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Developers can view own data" ON developers;
DROP POLICY IF EXISTS "Developers can update own data" ON developers;
DROP POLICY IF EXISTS "Developers can view own payment requests" ON payment_requests;
DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can create tickets" ON support_tickets;
DROP POLICY IF EXISTS "Support can view all tickets" ON support_tickets;
DROP POLICY IF EXISTS "Support can update tickets" ON support_tickets;
```

### 2. Создайте исправленные политики
Выполните содержимое файла `supabase-schema-fixed.sql` или скопируйте исправленные политики:

```sql
-- Политики RLS для пользователей (исправленные)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Политики RLS для карт (исправленные)
CREATE POLICY "Users can view own cards" ON cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards" ON cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON cards FOR UPDATE USING (auth.uid() = user_id);

-- Политики RLS для транзакций (исправленные)
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Политики RLS для разработчиков (исправленные)
CREATE POLICY "Developers can view own data" ON developers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Developers can update own data" ON developers FOR UPDATE USING (auth.uid() = user_id);

-- Политики RLS для платежных запросов (исправленные)
CREATE POLICY "Developers can view own payment requests" ON payment_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM developers WHERE id = developer_id AND user_id = auth.uid())
);

-- Политики RLS для тикетов поддержки (исправленные)
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Support can view all tickets" ON support_tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('support', 'admin'))
);
CREATE POLICY "Support can update tickets" ON support_tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('support', 'admin'))
);

-- Дополнительные политики для администраторов
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can view all cards" ON cards FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all cards" ON cards FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can view all developers" ON developers FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all developers" ON developers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can view all payment requests" ON payment_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can view all support tickets" ON support_tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all support tickets" ON support_tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

## 🔍 Что было исправлено

### Проблема:
- `auth.uid()::text = id::text` - неправильное приведение типов
- PostgreSQL не может сравнить UUID с TEXT

### Решение:
- `auth.uid() = id` - прямое сравнение UUID с UUID
- Убраны ненужные приведения типов

## 📋 Пошаговая инструкция

### 1. Откройте Supabase Dashboard
1. Перейдите на [supabase.com](https://supabase.com)
2. Войдите в свой аккаунт
3. Выберите ваш проект

### 2. Откройте SQL Editor
1. В левом меню нажмите **SQL Editor**
2. Создайте новый запрос

### 3. Выполните исправления
1. Скопируйте и выполните команды удаления старых политик
2. Скопируйте и выполните команды создания новых политик

### 4. Проверьте результат
1. Перейдите в **Authentication** → **Policies**
2. Убедитесь, что все политики созданы без ошибок
3. Проверьте, что RLS включен для всех таблиц

## ✅ Проверочный список

- [ ] Старые политики удалены
- [ ] Новые политики созданы
- [ ] Нет ошибок в SQL Editor
- [ ] RLS включен для всех таблиц
- [ ] Приложение работает без ошибок

## 🚨 Если проблема остается

1. **Проверьте типы данных:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'users' AND column_name = 'id';
   ```

2. **Проверьте auth.uid():**
   ```sql
   SELECT auth.uid();
   ```

3. **Временно отключите RLS для тестирования:**
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ```

4. **Включите обратно после исправления:**
   ```sql
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ```

## 📞 Поддержка

Если у вас возникли проблемы:
1. Проверьте логи в Supabase Dashboard
2. Убедитесь, что все команды выполнены без ошибок
3. Проверьте, что типы данных совпадают
4. Обратитесь к документации Supabase

---

**После выполнения этих шагов ваша база данных будет работать корректно! 🎉**


