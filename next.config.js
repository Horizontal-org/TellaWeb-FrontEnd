const { i18n } = require("./next-i18next.config");

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: process.env.NEXT_PUBLIC_API_URL + "/:path*",
        destination: process.env.NEXT_REDIRECT_API_URL + "/:path*",
        basePath: false,
        // locale: false,
      },
    ];
  },
  i18n,
};
