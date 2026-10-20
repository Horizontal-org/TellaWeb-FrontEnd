const { i18n } = require("./next-i18next.config");

module.exports = {
  reactStrictMode: false,
  // Don't let a lockfile in a parent folder change the inferred workspace root
  outputFileTracingRoot: __dirname,
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
    remotePatterns: [{ hostname: 'localhost' }, { hostname: 'tella-app.org' }],
  },
  i18n,
};
