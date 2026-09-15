import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Mourad-site/basilico",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "strvid.nyc3.cdn.digitaloceanspaces.com" },
    ],
  },
};

export default nextConfig;
