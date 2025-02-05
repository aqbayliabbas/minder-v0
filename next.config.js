/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      util: false,
    }
    return config
  },
  // Temporarily disable React strict mode to resolve AbortError
  reactStrictMode: false,
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  }
};

module.exports = nextConfig;
