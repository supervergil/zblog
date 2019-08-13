const path = require("path");
const isDev = think.env === "development";

module.exports = [
  {
    handle: "meta",
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: "resource",
    enable: isDev,
    options: {
      index: "index.html",
      root: path.join(think.ROOT_PATH, "www"),
      publicPath: /^\/(static\/|theme\/|admin\/?|ucenter\/?)/
    }
  },
  {
    handle: "payload",
    options: {}
  },
  {
    handle: "router",
    options: {
      defaultModule: "blog",
      prefix: ["/"],
      suffix: []
    }
  },
  "logic",
  {
    handle: "controller",
    options: {
      emptyController: "404"
    }
  }
];
