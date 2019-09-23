const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'vdbststd',
    libraryTarget: 'umd2',
    globalObject: 'this'
  }
}

module.exports = config;