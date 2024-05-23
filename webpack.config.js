const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/watch-notion.mjs',  // エントリーポイント
  mode: 'development',  // 開発モード
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /src/,
        type: 'javascript/auto',
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.mjs', '.ts', '.js'],
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "http": require.resolve("stream-http"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      "url": require.resolve("url/"),
      "process": require.resolve("process/browser")
    }
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^fsevents$/
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^child_process$/
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

