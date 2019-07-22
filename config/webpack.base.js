const path = require('path')

const webpack = require("webpack");
const glob = require("glob");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name, chunks) {
  return {
    template: `./src/pages/${name}/index.html`,
    filename: process.env.NODE_ENV === "development" ? `iuapmdm_fr/${name}.html` : `${name}.html`,
    // favicon: './favicon.ico',
    // title: title,
    inject: true,
    hash: true, //开启hash  ?[hash]
    chunks: chunks,
    //开发阶段做盘暂时注释掉
    // minify: process.env.NODE_ENV === "development" ? false : {
    //   removeComments: true, //移除HTML中的注释
    //   collapseWhitespace: true, //折叠空白区域 也就是压缩代码
    //   removeAttributeQuotes: true, //去除属性引用
    // },
  };
};

function getEntry() {
  var entry = {};
  //读取src目录所有page入口
  glob.sync('./src/pages/**/index-entry.js')
    .forEach(function(name) {
      var start = name.indexOf('src/') + 4,
        end = name.length - 3;
      var eArr = [];
      var n = name.slice(start, end);
      n = n.slice(0, n.lastIndexOf('/')); //保存各个组件的入口
      n = n.replace('pages/', '')
      // n = n.split('/')[1];
      eArr.push(name);
      entry[n] = eArr;
      // console.log(entry)
      entry = {

        // 'model-management/flow-model': ['./src/pages/model-management/flow-model/index-entry.js'],
        // 'data-integration/mdm-sysregister': ['./src/pages/data-integration/mdm-sysregister/index-entry.js'],
        // 'model-management/entity-model': ['./src/pages/model-management/entity-model/index-entry.js'],
        // 'model-management/auth-model': ['./src/pages/model-management/auth-model/index-entry.js'],
        // 'model-management/data-ootb': ['./src/pages/model-management/data-ootb/index-entry.js'],
        // 'data-integration/load-data': ['./src/pages/data-integration/load-data/index-entry.js'],
        // 'data-integration/authAndSub': ['./src/pages/data-integration/authAndSub/index-entry.js'],
        // 'data-integration/mdm-enum': ['./src/pages/data-integration/mdm-enum/index-entry.js'],
        'data-integration/data-distribution': ['./src/pages/data-integration/data-distribution/index-entry.js'],
        // 'data-integration/integration-standard': ['./src/pages/data-integration/integration-standard/index-entry.js'],
        // 'data-integration/mdm-integ-log': ['./src/pages/data-integration/mdm-integ-log/index-entry.js'],
        // 'socialized-master-data/interface-configuration': ['./src/pages/socialized-master-data/interface-configuration/index-entry.js'],
        // 'socialized-master-data/enterprise': ['./src/pages/socialized-master-data/enterprise/index-entry.js'],
        // 'socialized-master-data/tenant-information': ['./src/pages/socialized-master-data/tenant-information/index-entry.js'],
        // 'statistical-analysis/numerical-analysis': ['./src/pages/statistical-analysis/numerical-analysis/index-entry.js'],
        'data-maintenance/maintenance': ['./src/pages/data-maintenance/maintenance/index-entry.js'],
        'data-management/management': ['./src/pages/data-management/management/index-entry.js'],
        // 'uui/search':['./src/pages/uui/search/index-entry.js']
      }
    });
  return entry;
};

module.exports = {
  entry: getEntry(),
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      components: path.join(__dirname, '../src/components'),
      utils: path.join(__dirname, '../src/utils'),
      src: path.join(__dirname, '../src'),
      bee: path.join(__dirname, '../src/bee'),
      images: path.join(__dirname, '../src/assets/images'),
    }
  },
  // externals : {
  //   "react": "React",
  //   "react-dom": "ReactDOM",
  //   "react-router": "ReactRouter",
  //   "axios": "axios"
  // },
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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 8196,
            name: "[name].[hash:8].[ext]",
            outputPath: 'images/',
          }
        }]
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: "file-loader",
          options: {
            name: '[name].[hash:8].[ext]',
            outputPath: 'fonts',
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __MODE__: JSON.stringify(process.env.NODE_ENV),
    })
  ]
}

//配置页面
const entryObj = getEntry();
const htmlArray = [];
Object.keys(entryObj).forEach(element => {
  htmlArray.push({
    _html: element,
    title: '',
    chunks: ['runtime', 'vendor', 'common', element]
  })
})
var getJS = function(path) {
  return [
    // path + '/libs/babel-polyfill/6.26.0/polyfill.js',
    path + '/libs/react@16/umd/react.production.min.js',
    path + '/libs/react-dom@16/umd/react-dom.production.min.js',
    path + '/libs/react-router/3.2.0/ReactRouter.min.js',
    path + '/libs/prop-types/15.6.0/prop-types.min.js',
    path + '/libs/tinper-bee/1.6.5/build/tinper-bee.min.js',
    path + '/libs/axios/0.17.1/axios.js',
    path + '/libs/echarts4/echarts.min.js',
    path + '/libs/server.js',
  ];
}

const MINIMIZE_FLAG = (process.env.NODE_ENV == "production") ? true : false;

//自动生成html模板
htmlArray.forEach((element) => {
  let temp = getHtmlConfig(element._html, element.chunks);
  let script = MINIMIZE_FLAG ? getJS('../assets') : getJS('../../../assets');
  temp.scripts = script;
  temp.server = element.server;
  console.log('temp', temp)
  module.exports.plugins.push(new htmlWebpackPlugin(temp));
})
