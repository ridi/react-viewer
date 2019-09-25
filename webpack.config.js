const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    index: './src/index.ts',
    constants: './src/constants/index.ts',
    utils: './src/utils/index.ts',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
    library: 'reader',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)|(jsx?)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  externals: {
    react: 'react',
    redux: 'redux',
    'react-dom': 'react-dom',
    'react-redux': 'react-redux',
  },
  node: {
    fs: 'empty',
  },
  target: 'web',
  optimization: {
    minimizer: isDev ? null : [
      new TerserPlugin({
        extractComments: false,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
