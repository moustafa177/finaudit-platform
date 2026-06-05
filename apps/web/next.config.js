/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'finaudit-documents.s3.me-south-1.amazonaws.com' },
    ],
  },
}

module.exports = nextConfig
