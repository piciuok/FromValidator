'use strict';

const config = require('./config');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rules = require('./rules')

let webpackConfig = {
  context: config.paths.context,
  entry: config.entry,
  module: {
    rules: rules
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins: [
  ],
  devServer: {
    hot: true,
    open: true,
    watchContentBase: true,
    historyApiFallback: true,
  },
  output: {
    filename: "validator.min.js"
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  }
};

webpackConfig.plugins.push(new HtmlWebpackPlugin({template: './index.html'}))

if(config.enabled.watcher) {
  webpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin())
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = webpackConfig;
