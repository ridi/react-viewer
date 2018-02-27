const webpack = require('webpack');
const process = require('process');
const webpackConfig = require('./webpack.config.js');

const compiler = webpack(webpackConfig);

const watching = compiler.watch({}, (err, stats) => {
  err && console.error(err);
});

process.chdir('demo');
require('./demo/watch.js');
