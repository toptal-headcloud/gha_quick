const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'web',
  devServer: {
    port: 3284,
    client: { progress: true },
    static: {
      directory: path.resolve(__dirname, 'src/images'),
      publicPath: '/assets',
    },
    hot: false,
  },
  entry: {
    app: './src/index',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name]-[contenthash].js',
  },
  cache: {
    type: 'filesystem',
  },
  resolve: {
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: './index.template.html' }),
  ],
};