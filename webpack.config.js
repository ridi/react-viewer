const webpack = require('webpack');

module.exports = {
  entry: {
    index: `${__dirname}/src/index.js`,
  },
  output: {
    path: `${__dirname}/lib/`,
    filename: '[name].js',
    library: 'shared-components',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: `${__dirname}/src/`,
        query: {
          presets: ['env', 'react'],
          plugins: [
            ['transform-es2015-classes', { loose: true }],
            ['transform-proto-to-assign'],
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    'react-redux': 'react-redux',
    'redux': 'redux',
    'redux-thunk': 'redux-thunk',
    'reselect': 'reselect',
    '@ridi/reader.js': '@ridi/reader.js',
  },
  mode: 'development',
};
