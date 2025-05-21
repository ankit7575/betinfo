// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '>0.25%, not dead',
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
      },
    ],
  ],
};
