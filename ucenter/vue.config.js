const path = require("path");
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/ucenter/" : "/",
  outputDir: process.env.NODE_ENV === "production" ? "../www/ucenter/" : "dist",
  devServer: {
    open: true,
    proxy: {
      "/uapi": {
        target: `${process.env.VUE_APP_HTTP_BASE_URI}/uapi`,
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/uapi": "/"
        }
      },
      "/static": {
        target: `${process.env.VUE_APP_HTTP_BASE_URI}/static`,
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/static": "/"
        }
      }
    },
    port: 8081
  },
  configureWebpack: {
    resolve: {
      alias: {
        "~": path.join(__dirname)
      }
    }
  }
};
