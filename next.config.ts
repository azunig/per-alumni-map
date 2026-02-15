import type { NextConfig } from "next";

const nextConfig: NextConfig = {
typescript: {
    // !! ADVERTENCIA !!
    // Esto permite que el build termine aunque haya errores de tipo.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
