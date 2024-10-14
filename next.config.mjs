/** @type {import('next').NextConfig} */
const nextConfig = {
    crossOrigin: 'anonymous',
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
}

export default nextConfig
