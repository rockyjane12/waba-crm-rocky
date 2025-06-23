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

    // Handle Supabase Realtime client warning
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
      },
      {
        message:
          /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    return config;
  },
};

export default nextConfig;
