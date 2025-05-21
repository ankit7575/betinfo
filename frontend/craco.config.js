const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser.js'), // 👈 fixed
        vm: require.resolve('vm-browserify'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
      };

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser.js', // 👈 fixed
        }),
      ];

      return webpackConfig;
    },
  },
};
