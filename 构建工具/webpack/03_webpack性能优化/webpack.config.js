const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
  // mode: 'development',
  entry: './src/index.js',
  // devtool: 'source-map',
  devServer: {
    // contentBase: path.join(__dirname, 'public')
  },
  module: {
    // 哪些模块不需要解析
    noParse: /jquery/,
    rules: [
      {
        test: /\.js$/,
        use: './custom-loader.js',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        // use: './cssLoader.js'
        use: ['./cssLoader.js','css-loader']
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      template: './public/index.html'
    })
  ]
}
