const Base = require("./base.js");

module.exports = class extends Base {
  getListAction() {
    this.allowMethods = "get";
  }
  freezeAction() {
    this.allowMethods = "post";
  }
  shutupAction() {
    this.allowMethods = "post";
  }
};
