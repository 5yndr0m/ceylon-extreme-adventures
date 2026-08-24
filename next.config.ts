import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  allowedDevOrigins: ['stickless-paxton-topographically.ngrok-free.dev'],
}

export default nextConfig
