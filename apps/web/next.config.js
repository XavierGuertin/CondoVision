const path = require('path');

module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
      "@web": path.join(__dirname, '.'),
      "@native": path.join(__dirname, '../native'),
      "@ui": path.join(__dirname, '../../packages/ui/src'),
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ".ts",
      ".tsx",
      ...config.resolve.extensions,
    ];

    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: 'ts-loader',
    });

    return config;
  },
};