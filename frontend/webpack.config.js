const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
      process: require.resolve('process/browser.js'), // 👈 fixed
      vm: require.resolve('vm-browserify'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      crypto: require.resolve('crypto-browserify'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js', // 👈 fixed
    }),
  ],
};
