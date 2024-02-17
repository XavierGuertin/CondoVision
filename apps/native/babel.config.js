module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            "@web": "../web",
            "@native": "./",
            "@ui": "../../packages/ui/src",
          },
        },
      ],
    ],
  };
};
