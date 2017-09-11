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
  }
});

server.listen(8000, '0.0.0.0', () => console.log('server started'));
