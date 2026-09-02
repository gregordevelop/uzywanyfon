import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Domyślny limit to 1MB — za mało na kilkanaście zdjęć telefonu.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
