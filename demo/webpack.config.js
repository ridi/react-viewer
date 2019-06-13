const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    index: path.join(__dirname, 'src/client/index.tsx'),
  },
  output: {
    path: `${__dirname}/public/js`,
    filename: '[id].js',
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
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api/**': 'http://localhost:8080',
      changeOrigin: true,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${__dirname}/public/index.html`,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  mode: 'production',
};
