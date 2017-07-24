

module.exports = {
  entry: {
    index: `${__dirname}/src/views/viewerScreen/ViewerScreen.jsx`
  },
  output: {
    path: `${__dirname}/lib/`,
    filename: 'index.js',
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
            ['transform-es2015-classes', { 'loose': true }],
            ['transform-proto-to-assign']
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
