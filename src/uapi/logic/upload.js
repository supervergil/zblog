const Base = require("./base.js");

module.exports = class extends Base {
  send2QiniuAction() {
    this.allowMethods = "post";
    let rules = {
      file: {
        required: true,
        image: true,
        method: "file"
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }
  }
};
