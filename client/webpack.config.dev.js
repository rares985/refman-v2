const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  /* Entry point  */
  entry: "./src/index.jsx",

  /* Where the bundle.js file will be created */
  output: {
    path: path.resolve(__dirname, "./build"),
    // publicPath: '/',
    filename: "bundle.js",
  },

  module: {
    rules: [
      /* transpile To <= ES5, then lint */
      {
        test: /\.(js|jsx)$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: ["babel-loader", "eslint-loader"],
      },

      /* Load SCSS, then CSS */
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      /* Load images and fonts */
      {
        test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          /* Relative to output-folder */
          outputPath: "assets/",
        },
      },
    ],
  },

  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },

  plugins: [
    // new WebpackBundleAnalyzer(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "public/index.html",
    }),
  ],
  devServer: {
    inline: true,
    contentBase: "build/",
    proxy: {
      "/api/*": "http://localhost:5001",
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    disableHostCheck: true,
    open: "chrome",
    historyApiFallback: true,
    hot: true,
    port: 8080,
  },
};
