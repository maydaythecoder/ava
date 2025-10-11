import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  optimizeFonts: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@splinetool/react-spline'],
  },
};

export default nextConfig;
