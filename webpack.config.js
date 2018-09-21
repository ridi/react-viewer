module.exports = {
  entry: {
    index: `${__dirname}/src/index.js`,
    connectors: `${__dirname}/src/util/connector/index.js`,
    actions: `${__dirname}/src/redux/action.js`,
    selectors: `${__dirname}/src/redux/selector.js`,
    reducer: `${__dirname}/src/redux/reducer.js`,
    reader: `${__dirname}/src/components/Reader.jsx`,
  },
  output: {
    path: `${__dirname}/lib/`,
    filename: '[name].js',
    library: 'reader',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: `${__dirname}/src/`,
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
    extensions: ['.js', '.jsx'],
    mainFiles: ['index'],
  },
  externals: {
    react: 'react',
    redux: 'redux',
    'react-dom': 'react-dom',
    'react-redux': 'react-redux',
  },
  mode: 'production',
};
