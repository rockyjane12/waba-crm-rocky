import { existsSync } from 'fs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["images.pexels.com"],
  },
  // Enable SWC minification for improved performance
  swcMinify: true,
  // Configure webpack for better CSS optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize CSS only in production and for client-side bundles
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: "styles",
        test: /\.(css|scss)$/,
        chunks: "all",
        enforce: true,
      };
    }

    // Handle Supabase Realtime client warning and other warnings
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
      },
      {
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      {
        message: /\[DEP0040\]/  // Ignore punycode deprecation warning
      }
    ];

    // Improve caching behavior
    if (!dev) {
      config.cache = {
        type: 'filesystem',
        version: '1.0.0',
        cacheDirectory: '.next/cache',
        store: 'pack',
        buildDependencies: {
          defaultWebpack: ['webpack/lib/'],
          config: [import.meta.url],
          tsconfig: ['tsconfig.json'].filter(f => existsSync(f)),
        },
      };
    }

    return config;
  },
  // Disable favicon generation through next/metadata
  generateEtags: true,
  poweredByHeader: false,
};

export default nextConfig;