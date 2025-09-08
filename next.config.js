/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Simple image optimization
  images: {
    unoptimized: true,
  },
  
  // Disable powered by header
  poweredByHeader: false,
}

module.exports = nextConfig