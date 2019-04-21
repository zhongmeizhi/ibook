const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: {
    index: resolve('src/js/index/index.js'),
    about: resolve('src/js/about/index.js'),
    production: resolve('src/js/production/index.js'),
  },
  mode: 'development',
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
  devServer: {
    contentBase: path.join(__dirname, ""),
    compress: true,
    port: 2333
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      }, {
        test: /\.(css|less)$/,
        include: [resolve('src')],
        loader: "style-loader!css-loader!less-loader" 
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: [resolve('src')],
        options: {
          limit: 10000,
          name: resolve('src/img/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: 'about.html',
      inject: true,
      chunks: ['about']
    }),
    new HtmlWebpackPlugin({
      filename: 'production.html',
      template: 'production.html',
      inject: true,
      chunks: ['production']
    })
  ]
}