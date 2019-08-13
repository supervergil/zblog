const Base = require("./base.js");

module.exports = class extends Base {
  getInfoAction() {
    this.allowMethods = "get";
  }
};
