/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Replit environment
  experimental: {
    allowedDevOrigins: [
      'https://12052761-9295-439e-b07d-ca6da1bffc0a-00-1esi4g3znul0f.pike.replit.dev',
      '*.replit.dev',
      '*.repl.co',
      '*.replit.app',
    ],
  },
  // Remove X-Frame-Options to allow embedding in Replit webview
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig