const Base = require("./base.js");

module.exports = class extends Base {
  indexAction() {
    this.allowMethods = "post";
  }
  getListAction() {
    this.allowMethods = "get";
  }
  getPreviewListAction() {
    this.allowMethods = "get";
  }
  removeAction() {
    this.allowMethods = "post";
  }
  send2QiniuAction() {
    this.allowMethods = "post";
  }
};
