import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "puppeteer"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  env: {
    CUSTOM_KEY: "bong-flavours",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
