/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Отключаем строгую проверку типов для сборки
    ignoreBuildErrors: true,
  },
  eslint: {
    // Отключаем ESLint ошибки для сборки
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig


