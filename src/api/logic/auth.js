const Base = require("./base.js");

module.exports = class extends Base {
  loginAction() {
    this.allowMethods = "post";
    let rules = {
      account: {
        required: true
      },
      password: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }
  }
  logoutAction() {
    this.allowMethods = "post";
  }
  checkAction() {
    this.allowMethods = "post";
  }
};
