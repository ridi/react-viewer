const webpack = require('webpack');
const process = require('process');
const webpackConfig = require('./webpack.config.js');

const compiler = webpack({ ...webpackConfig, mode: 'development' });
compiler.watch({}, err => (err && console.error(err)));

process.chdir('demo');
require('./demo/watch.js');
