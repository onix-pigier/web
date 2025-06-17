import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb', // ou la taille que vous souhaitez
      allowedOrigins: ['http://localhost:3000'] // vos origines autorisées
    }
  },
};

export default nextConfig;