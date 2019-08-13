const Base = require("./base.js");

module.exports = class extends Base {
  getListAction() {
    this.allowMethods = "get";
  }
  removeAction() {
    this.allowMethods = "post";
  }
};
