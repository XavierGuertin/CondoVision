import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      // Use CI_BASE_URL if defined, otherwise fallback to 'http://localhost:3000'
      config.baseUrl = process.env.CI_BASE_URL || 'http://localhost:3000';
      return config;
    },
    baseUrl: 'http://localhost:3000'
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
