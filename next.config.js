/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Replit environment
  experimental: {
    allowedDevOrigins: [
      '*.replit.dev',
      '*.repl.co',
      '*.replit.app',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig