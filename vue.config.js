const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  "transpileDependencies": [
  ],
  publicPath: "./",
  outputDir: "dist-app",
  chainWebpack: config => {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        languages: ['json', 'javascript']
      }
    ]);
  }
}