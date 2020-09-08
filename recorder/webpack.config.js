const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {

  const isDevelopment = argv.mode === 'development';
  const builDir = './dist/'
  const assetFolder = 'assets'

  return {
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    entry: { 
      app: './src/index.ts',
      polyfill: './src/media/polyfill.js'
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    output: {
      filename: '[name].[hash].bundle.js',
      path: path.resolve(__dirname, builDir),
    },
    plugins: [
      isDevelopment? () => {} : new CleanWebpackPlugin(),
      isDevelopment ? () => {} :
        new MiniCssExtractPlugin({
          filename: "css/[name].[contenthash:8].css",
          chunkFilename: "css/[name].[contenthash:8].chunk.css"
      }),
      new CopyPlugin([
        { from: 'src/manifest.json', to: '' },
        { from: 'src/assets/favicon.ico', to: ''}
      ]),
      isDevelopment ? () => {} : new GenerateSW({
        swDest: 'service-worker.js',
        clientsClaim: true,
        skipWaiting: true
      }),
      new HtmlWebpackPlugin({
        template: isDevelopment ? 'src/index.dev.html' : 'src/index.production.html',
        filename: 'index.html',
        excludeChunks: ['polyfill']
      })
    ],
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: "ts-loader"
              }
          ]
        },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
          enforce: "pre",
          test: /\.js$/,
          loader: "source-map-loader"
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            !isDevelopment ? MiniCssExtractPlugin.loader : "style-loader",
              {
                loader: "css-loader",
                options: {
                  importLoaders: 2
                }
              },
              "resolve-url-loader",
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true
                }
              }
            ]
          },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            { 
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: assetFolder
              },
            }
          ],
        }
      ]
    },
  
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: isDevelopment ? {
      "react": "React",
      "react-dom": "ReactDOM"
    } : {},
    devServer: {
      host: 'localhost',
      port: 3001,
      open: true,
      https: true,
      stats: {
        children: false, // Hide children information
        maxModules: 0
      },
      proxy: [{
        context: ['/api', '/files'],
        target: 'http://localhost:3000',
      }]
    },
  }
} 