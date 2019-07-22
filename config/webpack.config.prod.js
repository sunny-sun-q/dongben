
const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const baseConfig = require('./webpack.base')
const TerserPlugin = require('terser-webpack-plugin')
// const UglifyJsPlugin=require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
var ReplacePlugin = require('replace-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const d = new Date();
const  dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
const DStr = '// ' + dateStr;

//优化配置，对于使用CDN作为包资源的引用从外到内的配置
const externals = {
  "react": "React",
  "react-dom": "ReactDOM",
  "react-router": "ReactRouter",
  "axios": "axios",
  "prop-types": "PropTypes",
  "tinper-bee": "TinperBee",
  "antd":'antd',
  "externals":"externals",
  // "babel-polyfill": "BabelPolyfill",
}

var _build_pro_path = path.resolve(__dirname, '../iuapmdm_fr');
var _src_path = path.resolve(__dirname, '../src');

const config = webpackMerge(baseConfig, {
  mode:'production',
  // devtool: 'cheap-module-source-map',
  // devtool: 'cheap-module-eval-source-map',
  target: 'web',
  externals:externals,
  // ['react','react-dom','prop-types'],
	output: {
		path: _build_pro_path,
		// 打包多出口文件
		filename: './js/[name].[hash].js',
		publicPath: '/iuapmdm_fr/'
	},

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader"
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader', 'sass-loader'
        ]
        // use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader', 'less-loader'
        ]
        // use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }
    ]
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   },
  //   minimizer: [
  //     new UglifyJsPlugin({
  //         uglifyOptions: {
  //           compress: false
  //         },
  //         test: /\.js(\?.*)?$/i,
  //     })
  //   ]
  // },
  // optimization: {
  //   runtimeChunk: {
  //     name: 'manifest'
  //   },
  //   minimizer: [
  //     new OptimizeCSSAssetsPlugin({
  //       assetNameRegExp: /\.css\.*(?!.*map)/g,  //注意不要写成 /\.css$/g
  //       cssProcessor: require('cssnano'),
  //       cssProcessorOptions: {
  //         discardComments: { removeAll: true },
  //         // 避免 cssnano 重新计算 z-index
  //         safe: true,
  //         // cssnano 集成了autoprefixer的功能
  //         // 会使用到autoprefixer进行无关前缀的清理
  //         // 关闭autoprefixer功能
  //         // 使用postcss的autoprefixer功能
  //         autoprefixer: false
  //       },
  //       canPrint: true
  //     })  // use OptimizeCSSAssetsPlugin
  //   ], // [new UglifyJsPlugin({...})]
  //   splitChunks:{
  //     chunks: 'async',
  //     minSize: 150000,
  //     minChunks: 1,
  //     maxAsyncRequests: 5,
  //     maxInitialRequests: 3,
  //     name: false,
  //     cacheGroups: {
  //       vendor: {
  //         name: 'vendor',
  //         chunks: 'initial',
  //         priority: -10,
  //         reuseExistingChunk: false,
  //         test: /node_modules\/(.*)\.js/
  //       },
  //       styles: {
  //         name: 'styles',
  //         test: /\.(sa|sc|c|le)ss$/,
  //         chunks: 'all',
  //         enforce: true
  //       }
  //     }
  //   }
  // },

  optimization: {
    // minimizer: [
    //   new TerserPlugin({
    //     sourceMap: false, // Must be set to true if using source-maps in production
    //     terserOptions: {
    //       compress: {
    //         drop_console: true,
    //       },
    //     },
    //   }),
    // ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    },
    runtimeChunk: 'single',
  },
  plugins: [
    new webpack.BannerPlugin(DStr),
      new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV':  JSON.stringify('production'),
            // 'API_BASE': '"http://cmdm-digit-1027.dev.app.yyuap.com/"'
            'API_BASE': '"http://172.20.4.200:8080/iuapmdm_fr"'
          },
          GLOBAL_HTTP_CTX: JSON.stringify("/iuapmdm"),
      }),

      new MiniCssExtractPlugin({
        filename: '[name].css?[hash:8]',
        chunkFilename: "[name].css?[hash:8]"
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static'
      }),
      new CopyWebpackPlugin([
        { from: _src_path+'/assets', to:_build_pro_path+'/assets'},
      ])
      // ,
      // new ReplacePlugin({
      //   // skip: process.env.NODE_ENV === 'development',
      //   entry: 'index.html',
      //   hash: '[hash]',
      //   output: _build_pro_path+'./js/[name].[hash].js',//'/build/index.html',
      //   data: {
      //     css: '<link type="text/css" rel="stylesheet" href="styles.css">',
      //     js: '<script src="bundle.js"></script>'
      //   }
      // })
  ],
  performance: {
    hints: false
  }
})
module.exports = config
