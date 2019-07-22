const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
// const HtmlWebPackPlugin = require('html-webpack-plugin')
const OpenBrowserPlugin = require("open-browser-webpack-plugin");
// const target = `http://172.16.1.246:1521`;
const target = `http://172.16.1.246:8080`;
// const target = 'http://172.20.58.163:80';
// const target = 'http://172.20.4.241:80';
// const target = 'http://10.11.64.36:8089';
// const target = `http://172.20.58.237:8080`;
const config = webpackMerge(baseConfig, {
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',

  output: {
    path: path.resolve(__dirname, '../iuapmdm_fr'),
    // 打包多出口文件
    filename: './js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
        ]
      },
      {
        test: /\.scss$/,
        use: ['style-loader','css-loader', 'sass-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader','css-loader', 'less-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "../src"),
    publicPath:'/',
    host: "172.168.10.158",
    port: "8099",
    overlay: true, // 浏览器页面上显示错误
    // open: true, // 开启浏览器
    // stats: "errors-only", //stats: "errors-only"表示只打印错误：
    hot: true, // 开启热更新
    //服务器代理配置项
    proxy: {
      '/api/':{
        // target: 'http://mdmserver.dev.app.yyuap.com/',
        // target: 'http://172.20.56.43:8888',
        // target: 'http://172.20.4.241:80',
        // target: 'http://10.4.100.39:8080',
        // target: 'http://10.11.64.80:8091',
        // target: 'http://172.20.4.200:8080',
        // target : `http://10.4.100.35:8080`,
        // target : `http://10.4.100.55:8088`,
        target : target,
        secure: true,
        changeOrigin: true,
        // pathRewrite: {'^/api': ''},
        pathRewrite: {'^/api': '/iuapmdm'}
      },
      '/wbalone': {
        // target: 'http://10.11.64.70:8080',
        // target: 'http://10.4.100.39:8080',
        // target: 'http://172.20.4.241:80',
        // target: 'http://172.20.4.200:8080',
        // target: `http://10.11.64.80:8888`,
        // target : `http://10.4.100.35:8080`,
        // target : `http://10.4.100.55:8088`,
        target : target,
        secure: true,
        changeOrigin: true,
        // pathRewrite: {'^/api': ''},
        // pathRewrite: {'^/api': '/iuapmdm'}
      },
      '/iuapmdm_fr':{
        // target: 'http://172.20.4.241:80',
        target : target,
        secure: true,
        changeOrigin: true,
      },
      '/iuapmdm':{
        // target: 'http://172.20.4.241:80',
        target : target,
        secure: true,
        changeOrigin: true,
      },
      '/eiap-plus': {
        // target: 'http://172.20.4.241:80',
        target : target,
        secure: true,
        changeOrigin: true,
      },
      '/ubpm-web-process-designer': {
        // target: 'http://172.20.4.241:80',
        target : target,
        secure: true,
        changeOrigin: true,
      },
      '/newref': {
        target : target,
        secure: true,
        changeOrigin: true,
      },
      '/iuap-saas-message-center': {
        target : target,
        secure: true,
        changeOrigin: true,
      } 

    }
  },
  plugins: [

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),

        'API_BASE': '""' // http://n37a8nue.c87e2267-1001-4c70-bb2a-ab41f3b81aa3.app.yyuap.com
        // https://mock.yonyoucloud.com/mock/524/
        // http://j7441tr4.c87e2267-1001-4c70-bb2a-ab41f3b81aa3.app.yyuap.com/
      },
      GLOBAL_HTTP_CTX: JSON.stringify("/api")
    }),
    // 配置多个页面在运npm run dev时自动打开
    // new OpenBrowserPlugin({
    //   url: `http://127.0.0.1:8090/entity-model.html`
    // }),
    // new OpenBrowserPlugin({
    //   url: `http://127.0.0.1:8090/data-integration/mdm-sysregister.html`
    // }),

    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = config
