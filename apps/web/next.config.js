/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'finaudit-documents.s3.me-south-1.amazonaws.com' },
    ],
  },
  output: 'standalone',
}

module.exports = nextConfig
