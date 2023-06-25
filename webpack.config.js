const path = require('path');
const fs = require('fs')
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const gitRevisionPlugin = (() => {
  // This horrible hack is necessary because the GitRevisionPlugin
  // always adds "git" as a prefix to the given command :(
  // ":" is "do nothing" in bash
  const runCommand = (command = ':') => `log -1 2> /dev/null || ${command}`

  return fs.existsSync('.git')
    ? // allow non-annotated tags, which we use
      new GitRevisionPlugin({ versionCommand: 'describe --always --tags' })
    : new GitRevisionPlugin({
        commithashCommand: runCommand(`echo '${process.env.COMMITHASH}'`),
        versionCommand: runCommand(`echo '${process.env.VERSION}'`),
        lastCommitDateTimeCommand: runCommand(),
      })
})()

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
    new GitRevisionPlugin(),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(gitRevisionPlugin.version()),
      COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
      BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
      LASTCOMMITDATETIME: JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),
    }),
  ],
};