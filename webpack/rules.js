const config = require('./config')

module.exports = [
  {
    test: /\.(js|jsx)$/,
    exclude: [/node_modules/],
    use: [
      {loader: 'cache-loader'},
      {
        loader: 'babel-loader',
      },
    ],
  }
]
