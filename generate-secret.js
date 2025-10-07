#!/usr/bin/env node

/**
 * Генератор JWT секрета для Stellex Banking
 * Использование: node generate-secret.js
 */

const crypto = require('crypto');

function generateJWTSecret() {
  // Генерируем случайную строку длиной 64 символа
  const secret = crypto.randomBytes(32).toString('base64');
  return secret;
}

function generateWebhookSecret() {
  // Генерируем секрет для webhook
  const secret = crypto.randomBytes(16).toString('hex');
  return secret;
}

console.log('🔐 Генерация секретов для Stellex Banking\n');

console.log('JWT_SECRET:');
console.log(generateJWTSecret());
console.log('');

console.log('TELEGRAM_WEBHOOK_SECRET:');
console.log(generateWebhookSecret());
console.log('');

console.log('📋 Скопируйте эти значения в настройки Vercel:');
console.log('1. Перейдите в Settings → Environment Variables');
console.log('2. Добавьте JWT_SECRET с первым значением');
console.log('3. Добавьте TELEGRAM_WEBHOOK_SECRET со вторым значением');
console.log('4. Выберите окружения: Production, Preview');
console.log('5. Нажмите Save и перезапустите приложение');
