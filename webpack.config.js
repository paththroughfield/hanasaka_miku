const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: "development",
  
    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: "./src/index.ts",

    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      })
    ],

    // ファイルの出力設定
    output: {
      //  出力ファイルのディレクトリ名
      path: `${__dirname}/docs`,
      // 出力ファイル名
      filename: "main.js"
    },
    module: {
      rules: [
        {
          // 拡張子 .ts の場合
          test: /\.ts$/,
          // TypeScript をコンパイルする
          use: "ts-loader"
        },
        {
          test: /\.(png|jpg|gif)$/,
          type: 'asset/resource'
        },
        {
          test: /\.css/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: { url: false }
            }
          ]
        }
      ],
    },
    // import 文で .ts ファイルを解決するため
    resolve: {
      extensions: [".ts", ".js"]
    }
  };