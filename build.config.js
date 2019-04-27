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
    index: resolve('src/js/index/index.js'),
    about: resolve('src/js/about/index.js'),
    production: resolve('src/js/production/index.js'),
  },
  mode: 'production',
  output: {
    path: resolve('my-dist'),
    filename: 'src/js/[name].js',
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
        from: path.resolve(__dirname, './src/img'),
        to: path.resolve( __dirname, './my-dist/src/img'),
        ignore: []
      },
      {
        from: path.resolve(__dirname, './vue-shop'),
        to: path.resolve( __dirname, './my-dist/vue-shop'),
        ignore: []
      },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      chunks: ['index'],
      minify: true,
      cache: true,
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: 'about.html',
      inject: true,
      chunks: ['about'],
      minify: true,
      cache: true,
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'production.html',
      template: 'production.html',
      inject: true,
      chunks: ['production'],
      minify: true,
      cache: true,
      inject: true
    }),
    // 只能打包JS中引入的css模块
    new MiniCssExtractPlugin({
      filename: 'src/css/[name].[hash].css',
      chunkFilename: 'src/css/[id].[hash].css',
    })
  ]
}