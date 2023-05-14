const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

/**
 * @type {import('next').NextConfig}
 */
module.exports = withNextra({
  i18n: {
    locales: ['ru'],
    defaultLocale: 'ru'
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
})
