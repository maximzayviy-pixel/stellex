# 🚀 Инструкция по развертыванию Stellex Banking

## 📋 Предварительные требования

1. **Node.js** версии 18 или выше
2. **npm** или **yarn**
3. **Аккаунт Supabase** (бесплатный)
4. **Аккаунт Vercel** (бесплатный)
5. **Telegram Bot** (создать через @BotFather)

## 🗄 Настройка базы данных Supabase

### 1. Создание проекта
1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Войдите через GitHub
4. Создайте новый проект
5. Выберите регион (рекомендуется ближайший к вашим пользователям)
6. Придумайте пароль для базы данных

### 2. Настройка схемы базы данных
1. В панели Supabase перейдите в раздел "SQL Editor"
2. Создайте новый запрос
3. Скопируйте и выполните содержимое файла `supabase-schema.sql`
4. Проверьте, что все таблицы созданы в разделе "Table Editor"

### 3. Получение ключей API
1. В настройках проекта найдите раздел "API"
2. Скопируйте:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** ключ (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** ключ (SUPABASE_SERVICE_ROLE_KEY)

## 🤖 Настройка Telegram Bot

### 1. Создание бота
1. Откройте [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте команду `/newbot`
3. Придумайте имя для бота (например: "Stellex Banking Bot")
4. Придумайте username (например: "stellex_banking_bot")
5. Скопируйте полученный токен

### 2. Настройка Web App
1. Отправьте боту команду `/newapp`
2. Выберите вашего бота
3. Придумайте название приложения
4. Загрузите иконку (опционально)
5. Укажите URL вашего приложения (будет получен после деплоя)
6. Добавьте описание

## 🚀 Деплой на Vercel

### 1. Подготовка репозитория
1. Создайте репозиторий на GitHub
2. Загрузите код проекта
3. Убедитесь, что файл `vercel.json` присутствует

### 2. Деплой через Vercel
1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите ваш репозиторий
5. Нажмите "Deploy"

### 3. Настройка переменных окружения
В настройках проекта Vercel добавьте переменные:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. Обновление Telegram Bot
1. Скопируйте URL вашего приложения из Vercel
2. Обновите Web App URL в @BotFather
3. Установите команды бота:
   ```
   start - Запустить приложение
   help - Помощь
   ```

## 🔧 Локальная разработка

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
Создайте файл `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Запуск приложения
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## 🧪 Тестирование

### 1. Тестирование в Telegram
1. Откройте вашего бота в Telegram
2. Нажмите "Запустить" или отправьте `/start`
3. Нажмите на кнопку "Открыть приложение"
4. Протестируйте основные функции

### 2. Тестирование API
Используйте Postman или curl для тестирования API:

```bash
# Создание карты
curl -X POST https://your-app.vercel.app/api/cards \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user_id", "holder_name": "Test User"}'
```

## 📊 Мониторинг

### 1. Vercel Analytics
- Включите Analytics в настройках Vercel
- Отслеживайте производительность и ошибки

### 2. Supabase Dashboard
- Мониторьте использование базы данных
- Просматривайте логи запросов
- Настраивайте алерты

### 3. Логи приложения
- Просматривайте логи в Vercel Dashboard
- Настройте уведомления об ошибках

## 🔒 Безопасность

### 1. Настройка RLS (Row Level Security)
- Убедитесь, что RLS включен для всех таблиц
- Проверьте политики доступа

### 2. JWT токены
- Используйте сильные секретные ключи
- Регулярно обновляйте JWT_SECRET

### 3. API ключи
- Никогда не коммитьте секретные ключи
- Используйте переменные окружения

## 🚨 Устранение неполадок

### Проблема: "supabaseUrl is required"
**Решение**: Проверьте, что переменная `NEXT_PUBLIC_SUPABASE_URL` установлена

### Проблема: "Invalid JWT token"
**Решение**: Проверьте, что `JWT_SECRET` установлен и одинаков на всех серверах

### Проблема: "Telegram Web App not working"
**Решение**: 
1. Убедитесь, что бот настроен правильно
2. Проверьте URL приложения в @BotFather
3. Убедитесь, что домен добавлен в настройки бота

### Проблема: "Database connection failed"
**Решение**:
1. Проверьте правильность URL и ключей Supabase
2. Убедитесь, что база данных активна
3. Проверьте настройки RLS

## 📈 Масштабирование

### 1. Увеличение лимитов Supabase
- Перейдите на платный план при необходимости
- Настройте резервное копирование

### 2. Оптимизация производительности
- Используйте индексы в базе данных
- Настройте кэширование
- Оптимизируйте запросы

### 3. Мониторинг нагрузки
- Настройте алерты при высокой нагрузке
- Планируйте масштабирование заранее

## 🎉 Готово!

Ваше приложение Stellex Banking готово к использованию! 

### Следующие шаги:
1. Создайте первого администратора
2. Настройте команду поддержки
3. Пригласите разработчиков
4. Запустите маркетинг

### Поддержка:
- Документация: README.md
- Исходный код: GitHub репозиторий
- Сообщество: Telegram канал

---

**Удачи с вашим банковским приложением! 🚀💰**

