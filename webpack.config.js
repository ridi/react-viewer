

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
    loaders: [
      {
        loader: 'babel-loader',
        include: `${__dirname}/src/`,
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            ['transform-es2015-classes', { loose: true }],
            ['transform-proto-to-assign']
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.es6']
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    'react-redux': 'react-redux',
    'redux': 'redux',
    'redux-thunk': 'redux-thunk',
    'reselect': 'reselect',
  }
};
