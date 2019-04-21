const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: {
    app: resolve('src/js/compat.js')
  },
  mode: 'production',
  output: {
    path: resolve('my-dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src/js')],
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.(css|less)$/,
        include: [resolve('src/css')],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: [resolve('src/img')],
        options: {
          limit: 10000,
          name: resolve('src/img/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks (chunk) {
        return true
        // return chunk.name !== 'my-excluded-chunk';
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js$/,
        parallel: true,
        cache: true,
        sourceMap: false
      })
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: resolve('src'),
        to: resolve('my-dist/src'),
        ignore: []
      },
      {
        from: path.resolve(__dirname, '../vue-shop'),
        to: path.resolve( __dirname, '../my-dist/vue-shop'),
        ignore: []
      },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      chunks: ['app'],
      css: ['src/css/base.css'],
      minify: true,
      cache: true,
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: 'about.html',
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: 'production.html',
      template: 'production.html',
      inject: false
    }),
    // 只能打包JS中引入的css模块
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css',
    })
  ]
}