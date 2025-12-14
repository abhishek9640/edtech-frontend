import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    // Add your API domain and any CDN domains for images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images - restrict in production
      },
    ],
    // Optimize image formats
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental features for better performance
  experimental: {
    // Enable optimized CSS loading
    optimizeCss: true,
  },

  // Compiler options for production optimization
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable React strict mode for development
  reactStrictMode: true,

  // PoweredBy header removal for security
  poweredByHeader: false,

  // Compression for responses
  compress: true,
};

export default nextConfig;
