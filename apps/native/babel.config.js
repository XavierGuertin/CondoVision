module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
      '@babel/preset-react', // Add this line
    ],
    plugins: [
      'istanbul',
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