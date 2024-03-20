const { i18n } = require("./next-i18next.config");

module.exports = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: process.env.NEXT_PUBLIC_API_URL + "/:path*",
        destination: process.env.NEXT_REDIRECT_API_URL + "/:path*",
        basePath: false,
        // locale: false,
      },
      // {
      //   source: "/:path*",
      //   destination: "http://localhost:3000/:path*",
      //   basePath: false,
      //   // locale: false,
      // },
    ];
  },
  images: {
    domains: ['localhost', 'tella-app.org'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  i18n,
};
