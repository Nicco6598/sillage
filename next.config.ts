import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2k6fvhyk5xgx.cloudfront.net",
        pathname: "/images/**",
      },
    ],
  },
  // Fix for Turbopack workspace root warning
  experimental: {
    turbo: {
      root: ".",
    },
  },
};

export default nextConfig;
