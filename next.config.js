const path = require('path');
/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/quotes/list',
        permanent: true,
      },
      {
        source: '/List',
        destination: '/list',
        permanent: true,
      },
      {
        source: '/Info',
        destination: '/info',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
