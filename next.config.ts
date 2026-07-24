import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite servir con next/image las imágenes subidas a Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
