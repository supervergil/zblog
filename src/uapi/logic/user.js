const sha256 = require("crypto-js/sha256");
const md5 = require("crypto-js/md5");

const Base = require("./base.js");

module.exports = class extends Base {
  async modifyPasswordAction() {
    this.allowMethods = "post";
    let rules = {
      originPassword: {
        required: true
      },
      newPassword: {
        required: true
      },
      confirmPassword: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }
    const originPassword = this.post("originPassword");
    const newPassword = this.post("newPassword");
    const confirmPassword = this.post("confirmPassword");
    if (confirmPassword !== newPassword) {
      return this.fail(3000, "确认密码和新密码不匹配！");
    }
    const userInfo = await this.model("register_user").getUserById(
      this.header("user-id")
    );
    if (
      sha256(`${originPassword}:zblog-${userInfo.email}`).toString() !==
      userInfo.password
    ) {
      return this.fail(3000, "原密码不正确！");
    }
  }
  getDetailAction() {
    this.allowMethods = "get";
  }
  saveAction() {
    this.allowMethods = "post";
    let rules = {
      info: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }
  }
};
