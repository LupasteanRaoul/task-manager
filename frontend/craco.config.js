// frontend/craco.config.js
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Optimizări pentru production build
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          minimize: true,
        };
      }
      return webpackConfig;
    },
  },
  eslint: {
    enable: false, // Dezactivează ESLint la build pentru a preveni erorile
  },
};