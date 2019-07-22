


const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const baseConfig = require('./webpack.base')
var _build_pro_path = path.resolve(__dirname, '../iuapmdm_fr');
module.exports = webpackMerge(baseConfig, {
  mode:'production',
  entry: {
      app: path.join(__dirname, '../../src/pages/uui/search/index-entry.js')
  },
  // externals:['react','react-dom','prop-types','tinper-bee','ref-core'],
  externals: {
    // "react": "React",
    // "react-dom": "ReactDOM",
    // "react-router": "ReactRouter",
    // "axios": "axios",
    // "prop-types": "PropTypes",
    // "tinper-bee": "TinperBee",
    // "antd":'antd',
    // "externals":"externals",
    // "babel-polyfill": "BabelPolyfill",
  },
  output: {
      path: _build_pro_path,
      // 打包多出口文件
      filename: './js/[name].js',
      publicPath: '/iuapmdm_fr/',
      libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            // options: {
            //   modules: true,
            //   sourceMap: true,
            //   importLoader: 2
            // }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            // options: {
            //   modules: true,
            //   sourceMap: true,
            //   importLoader: 2
            // }
          },
          "less-loader"
        ]
      }
    ]
  },
  optimization: {
    // runtimeChunk: {
    //   name: 'manifest'
    // },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({})  // use OptimizeCSSAssetsPlugin
    ], // [new UglifyJsPlugin({...})]
    // splitChunks:{
    //   // chunks: 'async',
    //   // minSize: 30000,
    //   // minChunks: 1,
    //   // maxAsyncRequests: 5,
    //   // maxInitialRequests: 3,
    //   // name: false,
    //   cacheGroups: {
    //     // vendor: {
    //     //   name: 'vendor',
    //     //   chunks: 'initial',
    //     //   priority: -10,
    //     //   reuseExistingChunk: false,
    //     //   test: /node_modules\/(.*)\.js/
    //     // },
    //     styles: {
    //       name: 'styles',
    //       test: /\.(sa|sc|c)ss$/,
    //       chunks: 'all',
    //       enforce: true
    //     }
    //   }
    // }
  },
  plugins: [
      new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV':  JSON.stringify('production')
          }
      }),
      // new HtmlWebPackPlugin({
      //   template: "./src/index.html",
      //   filename: "./index.html"
      // }),
      new MiniCssExtractPlugin({
        filename: 'index.css',
      })
  ]
})

