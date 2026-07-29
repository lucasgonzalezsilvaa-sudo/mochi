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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Evita que el sitio (y el /admin) se embeba en un iframe: anti-clickjacking.
          { key: "X-Frame-Options", value: "DENY" },
          // Evita que el navegador "adivine" el tipo de archivo (protege uploads).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No filtra la URL completa como referrer a otros dominios.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Desactiva APIs sensibles que el sitio no usa.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
