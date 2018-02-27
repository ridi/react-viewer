const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.config.js');

const compiler = webpack(webpackDevConfig);
const server = new WebpackDevServer(compiler, {
  hot: true,
  filename: 'index.js',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
});

const port = 8000;
server.listen(port, '0.0.0.0', () => console.log(`dev server started on port ${port}`));
