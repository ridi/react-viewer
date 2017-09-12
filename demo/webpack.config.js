

module.exports = {
  entry: {
    index: `${__dirname}/src/index.jsx`,
  },
  output: {
    path: `${__dirname}`,
    filename: 'resources/js/[name].js',
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: `${__dirname}/src/`,
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            ['transform-es2015-classes', { 'loose': true }],
            ['transform-proto-to-assign']
          ]
        }
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
};
