const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //css文件抽离插件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //css压缩插件，生产模式有效
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //js压缩插件，生产模式有效

module.exports = {
  mode: 'development',
  devtool: 'source-map', //devtool模式有很多，自行百度
  entry: __dirname + "/src/index.js",//唯一入口文件
  output: {
    path: __dirname + "/dist",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  },
  devServer: { //开发模式下的本地服务器
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
              'file-loader'
            ]
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
              'file-loader'
            ]
          }
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css' // 打包到dist/index.css
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true //是否需要sourceMap
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
}