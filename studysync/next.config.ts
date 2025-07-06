/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint für Production Build ignorieren
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig