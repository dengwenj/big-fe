module.exports = {
  mode: 'development',
  devtool: 'source-map',
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
  }
}
