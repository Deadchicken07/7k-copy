import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // trailingSlash: true generates /teams/index.html, /admin/index.html etc.
  // This is required for Cloudflare Pages to serve deep links correctly when
  // using static export. Without it, navigating directly to /teams returns 404.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(),
  },
};

export default nextConfig;