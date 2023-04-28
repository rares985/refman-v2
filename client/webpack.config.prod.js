const webpack = require('webpack');
const path = require('path');

/* For minification */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/* For bundle compression */
const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/* For cleaning before every buildd */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env) => {
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    /* Entry point  */
    entry: './src/index.jsx',

    /* Where the bundle.js file will be created */
    output: {
      path: __dirname + '/build',
      // publicPath: '/',
      filename: '[name].bundle.js',
    },

    module: {
      rules: [
        /* Transpile To <= ES5 */
        {
          test: /\.(js|jsx)$/,
          exclude: path.resolve(__dirname, 'node_modules'),
          use: ['babel-loader', 'eslint-loader'],
        },

        /* Load SCSS, then CSS */
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },

        /* Load images and fonts */
        {
          test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            /* Relative to output path */
            outputPath: 'assets/',
          },
        },
      ],
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          uglifyOptions: {
            compress: false,
            ecma: 6,
            mangle: true,
          },
          sourceMap: true,
        }),
      ],
    },

    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },

    plugins: [
      /**
       * All files inside webpack's output.path directory will be removed once, but the
       * directory itself will not be. If using webpack 4+'s default configuration,
       * everything under <PROJECT_DIR>/build/ will be removed.
       * Use cleanOnceBeforeBuildPatterns to override this behavior.
       *
       * During rebuilds, all webpack assets that are not used anymore
       * will be removed automatically.
       *
       * See `Options and Defaults` for information
       */
      new CleanWebpackPlugin(),
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin(envKeys),
      // new WebpackBundleAnalyzer(),
      new HtmlWebpackPlugin({
        /* Relative to output path: */
        // filename: 'index.html',
        template: 'public/index.html',
      }),
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html)$/,
        threshold: 10240,
        minRatio: 0.7,
      }),
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.(js|html|svg|css)$/,
        threshold: 10240,
        minRatio: 0.7,
      }),
      // new BundleAnalyzerPlugin(),
    ],
  };
};
