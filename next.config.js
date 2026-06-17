/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // firebase-admin uses native Node.js modules (net, tls, http2, etc.)
  // that cannot be bundled by webpack — tell Next.js to skip bundling it.
  serverExternalPackages: ['firebase-admin'],
};
module.exports = nextConfig;
