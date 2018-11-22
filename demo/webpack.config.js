const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    index: path.join(__dirname, 'src/index.jsx'),
    bundleLoader: [
      '@babel/polyfill',
      'url-search-params-polyfill',
      'whatwg-fetch',
      path.join(__dirname, 'src/bundleLoader.js'),
    ],
  },
  output: {
    path: `${__dirname}`,
    filename: 'resources/js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          presets: [
            ['@babel/preset-env', { useBuiltIns: 'entry' }],
            '@babel/preset-react',
          ],
          plugins: [
            ['@babel/plugin-proposal-class-properties', { loose: false }],
            ['@babel/plugin-transform-classes', { loose: true }],
            ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
            ['@babel/plugin-transform-react-jsx'],
            ['@babel/plugin-transform-proto-to-assign'],
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@ridi/react-viewer': path.join(__dirname, '../lib'),
    },
  },
  mode: 'production',
};
