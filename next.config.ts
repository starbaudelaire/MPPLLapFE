import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 INI YANG PENTING BOS! Kita naikin limitnya.
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Kasih 5MB atau 10mb biar aman sentosa
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
