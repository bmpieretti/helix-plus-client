const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  let entryOptions = {};
  let plugins = [];

  if (isDev) {
    entryOptions = {
      hotloader: 'react-hot-loader/patch'
    };

    plugins = [
      new webpack.HotModuleReplacementPlugin()
    ];
  }

  return ({
    entry: {
      main: './src/index.jsx',
      ...entryOptions
    },
    output: {
      filename: (isDev) ? '[name].[hash].min.js' : '[name].[chunkhash].min.js',
      chunkFilename: '[name].bundle.js'
    },
    devServer: (isDev) ? {
      hot: true,
      contentBase: './dist',
      port: 3000
    } : undefined,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, 'src'),
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                camelCase: true,
                localIdentName: '[local]',
                modules: true,
                minimize: true
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [
      ...plugins,
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': argv.mode
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false
      }),
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body'
      })
    ]
  });
};