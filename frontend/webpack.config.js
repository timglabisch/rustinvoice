
module.exports = {
  entry: './index.js',

  output: {
    filename: 'bundle.js',
    publicPath: ''
  },

  devServer: {
   headers: { "Access-Control-Allow-Origin": "http://127.0.0.1:6767", "Access-Control-Allow-Credentials": "true" }
 },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' }
    ]
  }
}
