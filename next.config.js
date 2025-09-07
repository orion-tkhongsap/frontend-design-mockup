/** @type {import('next').NextConfig} */
const nextConfig = {
  // React optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations for development
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Development performance settings
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 2,
  },
  
  // Faster builds
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  
  // Image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Simplified webpack config for better dev performance
  webpack: (config, { dev, isServer }) => {
    // Development optimizations
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }
      
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        runtimeChunk: false,
        minimize: false,
      }
      
      config.resolve.symlinks = false
      config.output.pathinfo = false
    }
    
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 20,
          },
        },
      }
    }
    
    return config
  },
  
  // Experimental features for better performance
  experimental: {
    scrollRestoration: true,
    optimizeCss: false,
    workerThreads: false,
    cpus: 2,
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Reduce file watching overhead
  devIndicators: {
    buildActivity: false,
  },
  
  // Headers for caching
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return []
    }
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig