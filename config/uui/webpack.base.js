const path = require('path')
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      components: path.join(__dirname, '../../src/components'),
      utils: path.join(__dirname, '../../src/utils'),
      src: path.join(__dirname, '../../src'),
      bee: path.join(__dirname, '../../src/bee'),
      images:path.join(__dirname,'../../src/assets/images'),
    }
  },
  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /.(js|jsx)$/,
      //   loader: 'eslint-loader',
      //   exclude: [
      //     path.resolve(__dirname, '../node_modules')
      //   ]
      // },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      
      {
        test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "[name].[hash:8].[ext]"
          }
        }]
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].[hash:8].[ext]"
          }
        }]
      }
    ]
  },
}
