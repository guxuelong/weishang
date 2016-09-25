var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var extractCSS = new ExtractTextPlugin('stylesheet/[name].[chunkhash:8].css');

var config = {

  entry: {
    'vendors': [
      'css/utils/common.scss',
      // 'css/utils/swiper.min.scss',
      // 'css/utils/vipPublic.scss',
      // 'css/utils/search1.0.1.scss',
      // 'js/utils/zepto.min.js',
      // 'js/utils/swiper.min.js',
      // 'js/utils/template-native.js',
      'js/utils/common.js',
    ],
    'index': [
      'css/pages/index.scss',
      'js/pages/index.js',
    ],
    'search': [
      'css/pages/index.scss',
      'js/pages/index.js',
    ],
    // 'productList': [
    //   'css/pages/productList.scss',
    //   'js/pages/productList.js',
    // ],
    // 'productDetail': [
    //   'css/pages/productDetail.scss',
    //   'js/pages/productDetail.js',
    // ],
    // 'orderConfirm': [
    //   'css/pages/shoppingcartList.scss',
    //   'js/pages/orderConfirm.js',
    // ],
    // 'myAddress': [
    //   'css/pages/myAddress.scss',
    //   'js/pages/myAddress.js',
    // ],
    // 'addAddress': [
    //   'css/pages/addAddress.scss',
    //   'js/pages/sm.min.js',
    //   'js/pages/sm-city-picker.min.js',
    //   'js/pages/addAddress.js',
    // ],
    // 'shoppingcartList': [
    //   'css/pages/shoppingcartList.scss',
    //   'js/pages/shoppingcartList.js',
    // ],
    // 'sort': [
    //   'css/pages/sort.scss',
    //   'js/pages/sort.js',
    // ],
    // 'userCenter': [
    //   'css/pages/userCenter.scss',
    //   'js/pages/userCenter.js',
    // ],
    // 'myOrder': [
    //   'css/pages/myOrder.scss',
    //   'js/pages/myOrder.js',
    // ],
    // 'orderDetail': [
    //   'css/pages/orderDetail.scss',
    //   'css/pages/myOrder.scss',
    //   'js/pages/orderDetail.js',
    // ],
    // 'myFee': [
    //   'css/pages/myFee.scss',
    //   'js/pages/myFee.js',
    // ],
    // 'myDistributer': [
    //   'css/pages/myDistributer.scss',
    //   'js/pages/myDistributer.js',
    // ],
    // 'me': [
    //   'css/pages/me.scss',
    //   'js/pages/me.js',
    // ],
    // 'vip': [
    //   'css/pages/vip.scss',
    //   'js/pages/vip.js',
    // ],
    // 'tuiKuan': [
    //   'css/pages/tuiKuan.scss',
    //   'css/pages/myOrder.scss',
    //   'js/pages/tuiKuan.js',
    // ],
    // 'tuiKuan-item': [
    //   'css/pages/tuiKuan.scss',
    //   'css/pages/myOrder.scss',
    // ],
    // 'logisticsStatus': [
    //   'css/pages/logisticsStatus.scss',
    //   'js/pages/logisticsStatus.js',
    // ],
    // 'comment': [
    //   'css/pages/comment-new.scss',
    //   'js/pages/comment.js',
    // ],
    // 'commentList': [
    //   'css/pages/commentList.scss',
    //   'js/pages/commentList.js',
    // ]
  },

  output: {
    path: __dirname + '/assets',
    filename: 'js/[name].[hash:8].js',
    publicPath: '/'
  },

  plugins: [
    extractCSS,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    alias: {
      js : __dirname + '/src/js',
      css: __dirname + '/src/css'
    }
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      { 
        test: /\.scss$/,
        loader: extractCSS.extract("style", "css?sourceMap&-minimize!autoprefixer!sass?sourceMap")
      },
      { 
        test: /\.css$/,
        loader: extractCSS.extract("style", "css?sourceMap&-minimize!autoprefixer")
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        loader: 'url-loader?name=fonts/[name].[hash:8].[ext]'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=8192&name=images/[name].[hash:8].[ext]'
      },
      {
        test: /\.(html)$/,
        loader: 'html'
      }
    ]
  }
}

for (var key in config.entry) {
  if (key == 'vendors') {
    continue;
  }
  config.plugins.push(new HtmlWebpackPlugin({
    template: './src/' + key + '.html',
    filename: key + '.html',
    chunks: ['vendors', key]
  }));
}

module.exports = config;