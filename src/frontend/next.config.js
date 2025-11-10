/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Image optimization for static export
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js',
  },
  
  // Asset prefix for proper static deployment
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Disable server-side features for static export
  experimental: {
    esmExternals: false,
  },
  
  // Environment variables
  env: {
    HEXSTRIKE_API_URL: process.env.HEXSTRIKE_API_URL || 'https://hexstrike-ai-v6-0.onrender.com',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.HEXSTRIKE_API_URL || 'https://hexstrike-ai-v6-0.onrender.com',
  },
  
  // Webpack configuration for static export
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
