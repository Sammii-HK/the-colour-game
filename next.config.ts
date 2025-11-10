import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'the-colour-game-olive.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'thecolorgame.uk',
      },
    ],
  },
};

export default nextConfig;
