const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const compiler = webpack(webpackConfig);
const watching = compiler.watch({}, (err, stats) => {
  err && console.error(err);
});

require('./demo/watch.js');
