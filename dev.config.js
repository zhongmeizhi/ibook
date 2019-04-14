const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: {
    app: resolve('src/js/compat.js')
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
      inject: true
    })
  ]
}