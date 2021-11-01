const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');


module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: "development",
  
    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: "./src/index.ts",

    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "./index.css",
      }),
    ],

    // ファイルの出力設定
    output: {
      //  出力ファイルのディレクトリ名
      path: `${__dirname}/docs`,
      // 出力ファイル名
      filename: "main.js",

      assetModuleFilename: 'images/[hash][ext]',
    },

    devServer: {
      static: "docs",
      open: true
    },

    module: {
      rules: [
        {
          // 拡張子 .ts の場合
          test: /\.ts$/,
          exclude: /node_modules/,
          // TypeScript をコンパイルする
          use: "ts-loader"
        },
        {
          test: /\.(svg|png|glb)$/,
          type: 'asset/resource',
        },
        {
          test: /\.css/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            // CSS を CommonJS に変換するローダー
            'css-loader',
          ]
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            // Disables attributes processing
            sources: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src',
                },
              ],
            },
          },
        },
      ],
    },
    // import 文で .ts ファイルを解決するため
    resolve: {
      extensions: [".ts", ".js"],
    }
  };