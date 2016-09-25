var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.base');

config.devtool = 'source-map';

config.devServer = {
  port: 3000,
  hot: true,
  inline: true
};

config.plugins.push(new webpack.DefinePlugin({
  "process.env": {
    NODE_ENV: JSON.stringify("development")
  },
  __DEBUG__: true
}));

config.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = config;