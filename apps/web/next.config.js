/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'top-right',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/@:username',
        destination: `/profile/:username`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
