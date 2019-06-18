module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
    constants: './src/constants/index.ts',
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
};
