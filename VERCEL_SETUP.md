# 🚀 Настройка переменных окружения в Vercel

## 📋 Пошаговая инструкция

### 1. Перейдите в настройки проекта Vercel
1. Откройте [vercel.com](https://vercel.com)
2. Войдите в свой аккаунт
3. Найдите ваш проект `stellex-banking`
4. Нажмите на название проекта
5. Перейдите в раздел **Settings**

### 2. Добавьте переменные окружения
В разделе **Environment Variables** добавьте следующие переменные:

#### 🔗 Supabase переменные:
```
NEXT_PUBLIC_SUPABASE_URL
Значение: https://your-project-id.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
Значение: your-anon-key-here
```

```
SUPABASE_SERVICE_ROLE_KEY
Значение: your-service-role-key-here
```

#### 🤖 Telegram переменные:
```
TELEGRAM_BOT_TOKEN
Значение: your-bot-token-here
```

```
TELEGRAM_WEBHOOK_SECRET
Значение: your-webhook-secret-here
```

#### 🔐 JWT переменные:
```
JWT_SECRET
Значение: your-jwt-secret-here
```

#### 🌐 App переменные:
```
NEXT_PUBLIC_APP_URL
Значение: https://your-app.vercel.app
```

### 3. Настройка окружений
Для каждой переменной выберите окружения:
- ✅ **Production** (обязательно)
- ✅ **Preview** (рекомендуется)
- ✅ **Development** (опционально)

### 4. Получение значений переменных

#### Supabase:
1. Откройте ваш проект в [Supabase Dashboard](https://supabase.com)
2. Перейдите в **Settings** → **API**
3. Скопируйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

#### Telegram Bot:
1. Откройте [@BotFather](https://t.me/botfather)
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Нажмите **API Token**
5. Скопируйте токен → `TELEGRAM_BOT_TOKEN`

#### JWT Secret:
Сгенерируйте случайную строку (минимум 32 символа):
```bash
# В терминале:
openssl rand -base64 32
```
Или используйте онлайн генератор: https://generate-secret.vercel.app/32

#### App URL:
После деплоя скопируйте URL вашего приложения из Vercel Dashboard

### 5. Перезапуск приложения
После добавления всех переменных:
1. Перейдите в раздел **Deployments**
2. Найдите последний деплой
3. Нажмите **Redeploy**
4. Или сделайте новый коммит в репозиторий

### 6. Проверка
После перезапуска проверьте:
1. Откройте ваше приложение
2. Проверьте консоль браузера на ошибки
3. Убедитесь, что все функции работают

## 🔧 Альтернативный способ (через CLI)

Если у вас установлен Vercel CLI:

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин
vercel login

# Переход в папку проекта
cd stellex-banking

# Добавление переменных
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_WEBHOOK_SECRET
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_APP_URL

# Деплой
vercel --prod
```

## 🚨 Устранение проблем

### Ошибка: "Secret does not exist"
**Решение**: Убедитесь, что вы добавляете переменные как **Environment Variables**, а не как **Secrets**

### Ошибка: "Invalid Supabase URL"
**Решение**: Проверьте, что URL начинается с `https://` и заканчивается на `.supabase.co`

### Ошибка: "JWT Secret too short"
**Решение**: Используйте секрет длиной минимум 32 символа

### Ошибка: "Telegram Bot Token invalid"
**Решение**: Убедитесь, что токен начинается с цифр и содержит двоеточие

## ✅ Проверочный список

- [ ] Все 7 переменных добавлены
- [ ] Переменные добавлены для Production окружения
- [ ] Значения скопированы правильно (без лишних пробелов)
- [ ] Приложение перезапущено
- [ ] Нет ошибок в консоли браузера
- [ ] Функции приложения работают

## 📞 Поддержка

Если у вас возникли проблемы:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все переменные добавлены правильно
3. Попробуйте перезапустить приложение
4. Обратитесь к документации Vercel

---

**После настройки переменных ваше приложение будет полностью функциональным! 🎉**

