/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    // firebase-admin uses native Node.js modules (net, tls, http2, etc.)
    // that cannot be bundled by webpack — tell Next.js 14.x to skip bundling it.
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};
module.exports = nextConfig;
