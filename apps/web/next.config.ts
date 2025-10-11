import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false, // SECURITY: Remove powered-by header
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@splinetool/react-spline'],
  },
  // MONOREPO: Specify workspace root for file tracing in pnpm monorepo
  outputFileTracingRoot: path.join(__dirname, '../../'),
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
