const path = require('path');
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './src/main.js',
    // content: './src/content/content.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            sass: ExtractTextPlugin.extract('css-loader!sass-loader?indentedSyntax'),
          },
          extractCSS: true
          // other vue-loader options go here
        }
      },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.pug/,
        loader: ["raw-loader", "pug-html-loader"],
        exclude: /node_modules/
      },
      // {
      //   test: /\.sass/,
      //   use:  ExtractTextPlugin.extract({use: ['css-loader', 'sass-loader'], fallback: 'style-loader'}),
      //   exclude: /node_modules/
      // },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/'
        }
      },
      {
        test: /\.(svg)$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolveLoader: {
    alias: {
      file: "file-loader?name=[name].[ext]"
  }},
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    open: false,
    port: 8080,
    // hot: true,
    public: '8080.slartibartfast'
  },
  performance: {
    hints: false
  },

  devtool: 'source-map',
  plugins: [
      new ExtractTextPlugin("style.css")
  ]
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        compress: {
        warnings: false
      }}
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
