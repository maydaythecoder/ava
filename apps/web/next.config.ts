import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false, // SECURITY: Remove powered-by header
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@splinetool/react-spline'],
  },
  // Transpile workspace packages for monorepo support
  transpilePackages: [
    '@ava/ai-service',
    '@ava/common-types',
    '@ava/git-bridge',
    '@ava/rules-engine',
    '@ava/workflow-parser'
  ],
};

export default nextConfig;
