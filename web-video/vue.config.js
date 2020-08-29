// vue.config.js
module.exports = {
  outputDir: '../dist/web/video/wwwroot',
  publicPath: '/video',
  css: {
    sourceMap: true,
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/_styles/_reset.scss";
          @import "@/_styles/_variables.scss";
        `
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    proxy: {
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
}