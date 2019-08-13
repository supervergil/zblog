const path = require("path");
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/admin/" : "/",
  outputDir: process.env.NODE_ENV === "production" ? "../www/admin/" : "dist",
  devServer: {
    open: true,
    proxy: {
      "/api": {
        target: `${process.env.VUE_APP_HTTP_BASE_URI}/api`,
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/api": "/"
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
    port: 8080
  },
  configureWebpack: {
    resolve: {
      alias: {
        "~": path.join(__dirname)
      }
    }
  }
};
