const path = require('path');

module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      "react-native$": "react-native-web",
      // Add custom aliases
      "@web": path.join(__dirname, '.'),
      "@native": path.join(__dirname, '../native'),
      "@ui": path.join(__dirname, '../../packages/ui/src'),
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];
    return config;
  },
};
