
module.exports = {
  context: __dirname,
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
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          presets: [
            ['env', { useBuiltIns: true }],
            'react',
          ],
          plugins: [
            ['transform-es2015-classes', { loose: true }],
            ['transform-proto-to-assign'],
            ['transform-object-rest-spread', { useBuiltIns: true }],
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  mode: 'production',
};
