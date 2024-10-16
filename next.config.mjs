/** @type {import('next').NextConfig} */
const nextConfig = {
    crossOrigin: 'anonymous',
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allow all paths from Cloudinary
      },
    ]
  }
}

export default nextConfig
