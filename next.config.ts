import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove o header `x-powered-by` para não expor a tecnologia do servidor.
  poweredByHeader: false,
  // Padrão do Next.js 16.4: Cache Components + Partial Prefetching.
  // Ambos serão o comportamento padrão na próxima versão major.
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
