import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Mourad-site/basilico",
  // Bakes the CSS straight into the HTML <head> instead of a separate
  // stylesheet request. This is a single-page static export, so there's no
  // cross-page caching benefit to lose, and it removes a request that must
  // land before the page looks right.
  experimental: {
    inlineCss: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "strvid.nyc3.cdn.digitaloceanspaces.com" },
    ],
  },
};

export default nextConfig;
