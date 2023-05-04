const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const webpack = require('webpack');
const toml = require('toml');
const yaml = require('yamljs');
const json5 = require('json5');
const { webpackConfig, isProduction, resolveProject, isAnalyze, isNoProduction } = require('./configs');

const webpackMainfestOptions = {
  seed: require('./manifest.json'),
};

console.log('webpack node env: ', process.env.NODE_ENV);

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  context: resolveProject(),
  entry: resolveProject('src/index.tsx'),
  devtool: webpackConfig.devtool,
  mode: webpackConfig.mode,
  output: {
    path: resolveProject('dist'),
    filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].js',
    publicPath: webpackConfig.publicPath,
    clean: true,
    pathinfo: isNoProduction,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@/*': 'src/*',
    },
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              require.resolve('babel-loader'),
              {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                  getCustomTransformers: () => ({
                    before: [isNoProduction && ReactRefreshTypeScript()].filter(Boolean),
                  }),
                },
              },
            ],
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: require.resolve('babel-loader'),
            },
          },
          {
            test: /\.css$/,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
              require.resolve('css-loader'),
              require.resolve('postcss-loader'),
            ],
          },
          {
            test: /\.less$/,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
              require.resolve('css-loader'),
              require.resolve('postcss-loader'),
              require.resolve('less-loader'),
            ],
          },
          {
            test: /\.svg$/,
            use: [
              { loader: require.resolve('@svgr/webpack'), options: { namedExport: 'ReactComponent' } },
              require.resolve('url-loader'),
            ],
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
          },
          // {
          //   test: /\.(csv|tsv)$/i,
          //   use: ['csv-loader'],
          // },
          // {
          //   test: /\.xml$/i,
          //   use: ['xml-loader'],
          // },
          {
            test: /\.toml$/i,
            type: 'json',
            parser: {
              parse: toml.parse,
            },
          },
          {
            test: /\.yaml$/i,
            type: 'json',
            parser: {
              parse: yaml.parse,
            },
          },
          {
            test: /\.json5$/i,
            type: 'json',
            parser: {
              parse: json5.parse,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    isNoProduction && new ReactRefreshPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    // Plugin for hot module replacement
    isNoProduction && new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: webpackConfig.htmlTitle,
      template: './public/index.html',
    }),
    new WebpackManifestPlugin(webpackMainfestOptions),
    new MiniCssExtractPlugin({
      filename: isProduction ? '[name].[contenthash].css' : '[name].css',
      chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    isAnalyze && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
  optimization: {
    runtimeChunk: 'single',
    minimize: isProduction,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    moduleIds: 'deterministic',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  devServer: {
    static: resolveProject('dist'),
    // Dev server client for web socket transport, hot and live reload logic
    hot: true,
    compress: true,
    port: webpackConfig.devPort,
    historyApiFallback: true,
  },
};
