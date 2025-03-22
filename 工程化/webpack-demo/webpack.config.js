export default {
  // 入口文件
  // entry: "./src/index.js",
  // 多入口
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // 预设，预先定义好一些插件
              presets: ['@babel/preset-env']
            }
          },
          {
            loader: './loader/custom-loader.js',
            options: {
              name: '朴睦',
              age: 25
            }
          }
        ]
      },
      {
        test: /\.txt$/,
        use: './loader/custom-loader2.js'
      }
    ]
  }
}
