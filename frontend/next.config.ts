import type { NextConfig } from "next";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const strapiUploadsUrl = new URL("/uploads/**", strapiUrl);

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [strapiUploadsUrl],
    dangerouslyAllowLocalIP: true,
  },
  reactCompiler: true,
};

export default nextConfig;
