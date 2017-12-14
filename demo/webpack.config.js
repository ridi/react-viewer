
module.exports = {
  entry: {
    index: `${__dirname}/src/index.jsx`,
    bundleLoader: [
      'babel-polyfill',
      'url-search-params-polyfill',
      'whatwg-fetch',
      `${__dirname}/src/bundleLoader.js`,
    ],
  },
  output: {
    path: `${__dirname}`,
    filename: 'resources/js/[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          presets: ['env', 'react'],
          plugins: [
            ['transform-es2015-classes', { loose: true }],
            ['transform-proto-to-assign'],
          ],
        },
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
};
