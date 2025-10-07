# 🚨 Быстрое решение проблемы с переменными окружения

## Проблема
```
Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "supabase_url", which does not exist.
```

## ✅ Решение

### 1. Удалите старый vercel.json
Файл `vercel.json` был обновлен и больше не содержит ссылки на несуществующие секреты.

### 2. Настройте переменные окружения в Vercel Dashboard

1. **Откройте Vercel Dashboard**
   - Перейдите на [vercel.com](https://vercel.com)
   - Найдите ваш проект `stellex-banking`
   - Нажмите на название проекта

2. **Перейдите в Settings**
   - В меню выберите **Settings**
   - Найдите раздел **Environment Variables**

3. **Добавьте переменные** (нажмите **Add New** для каждой):

   ```
   NEXT_PUBLIC_SUPABASE_URL
   Значение: https://your-project-id.supabase.co
   Окружения: Production, Preview
   ```

   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   Значение: your-anon-key-here
   Окружения: Production, Preview
   ```

   ```
   SUPABASE_SERVICE_ROLE_KEY
   Значение: your-service-role-key-here
   Окружения: Production, Preview
   ```

   ```
   TELEGRAM_BOT_TOKEN
   Значение: your-bot-token-here
   Окружения: Production, Preview
   ```

   ```
   TELEGRAM_WEBHOOK_SECRET
   Значение: your-webhook-secret-here
   Окружения: Production, Preview
   ```

   ```
   JWT_SECRET
   Значение: your-jwt-secret-here
   Окружения: Production, Preview
   ```

   ```
   NEXT_PUBLIC_APP_URL
   Значение: https://your-app.vercel.app
   Окружения: Production, Preview
   ```

### 3. Сгенерируйте секреты
Запустите команду для генерации JWT и webhook секретов:

```bash
npm run generate-secrets
```

Скопируйте сгенерированные значения в соответствующие переменные.

### 4. Перезапустите приложение
1. В Vercel Dashboard перейдите в **Deployments**
2. Найдите последний деплой
3. Нажмите **Redeploy**

### 5. Проверьте работу
1. Откройте ваше приложение
2. Убедитесь, что нет ошибок в консоли браузера
3. Протестируйте основные функции

## 🔍 Получение значений переменных

### Supabase:
1. Откройте [Supabase Dashboard](https://supabase.com)
2. Выберите ваш проект
3. Перейдите в **Settings** → **API**
4. Скопируйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### Telegram Bot:
1. Откройте [@BotFather](https://t.me/botfather)
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Нажмите **API Token**
5. Скопируйте токен → `TELEGRAM_BOT_TOKEN`

### App URL:
Скопируйте URL вашего приложения из Vercel Dashboard → `NEXT_PUBLIC_APP_URL`

## ✅ Проверочный список

- [ ] Все 7 переменных добавлены в Vercel
- [ ] Переменные добавлены для Production и Preview
- [ ] Значения скопированы правильно
- [ ] Приложение перезапущено
- [ ] Нет ошибок в консоли
- [ ] Функции работают

## 📞 Если проблема остается

1. Убедитесь, что вы добавляете **Environment Variables**, а не **Secrets**
2. Проверьте, что все переменные добавлены для правильных окружений
3. Убедитесь, что значения скопированы без лишних пробелов
4. Попробуйте полностью пересоздать проект в Vercel

---

**После выполнения этих шагов ваше приложение будет работать! 🎉**
