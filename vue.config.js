module.exports = {
  lintOnSave: false,
  configureWebpack: {
    // output: {
    //   path: __dirname + '/dist'
    // },
    resolve: {
      alias: {
        '@': __dirname
      }
    },
    entry: {
      app: './viewer/main.js'
    }
  }
}
