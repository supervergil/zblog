const Base = require("./base.js");

module.exports = class extends Base {
  getListAction() {
    this.allowMethods = "get";
  }
  removeAction() {
    this.allowMethods = "post";
  }
  addAction() {
    this.allowMethods = "post";
  }
  getDetailAction() {
    this.allowMethods = "get";
  }
  saveAction() {
    this.allowMethods = "post";
  }
};
