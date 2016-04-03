
import path from 'path'

module.exports = {
  context: path.join(__dirname, 'app'),

  entry: {
    contentscript: './src/contentscript.js'
  },

  output: {
    path: path.join(__dirname, 'app', 'scripts'),
    filename: '[name].js'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel' }
    ]
  }
}
