const path = require('path');

module.exports = {
  entry: './resources/js/app.js',
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'public', 'js')
  },

  // JS
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
