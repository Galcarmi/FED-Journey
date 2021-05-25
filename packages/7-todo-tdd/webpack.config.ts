import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { utils } from 'fed-todo-journey_todo-common';

const devTool = utils.isTestEnv() ? 'eval' : 'source-map';
const outputPath = utils.isE2E() ? path.resolve(__dirname, '../express-server/public') : path.resolve(__dirname, './test-server/public')

module.exports = {
  mode: 'development',
  entry: {
    bundle: './src/components/root-components/index.tsx',
  },
  output: {
    path: outputPath,
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    port: 3000,
    proxy: {
      '/': 'http://localhost:8000',
    },
  },
  devtool: devTool,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
};
