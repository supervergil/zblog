const sha256 = require("crypto-js/sha256");
const md5 = require("crypto-js/md5");

const Base = require("./base.js");

module.exports = class extends Base {
  async modifyPasswordAction() {
    this.allowMethods = "post";
    const originPassword = this.post("originPassword");
    const newPassword = this.post("newPassword");
    const confirmPassword = this.post("confirmPassword");
    if (confirmPassword !== newPassword) {
      return this.fail(3000, "确认密码和新密码不匹配！");
    }
    const userInfo = await this.session("admin-info");
    const authorInfo = await this.model("author").getUserById(userInfo.uid);
    if (
      sha256(`${originPassword}:zblog-${authorInfo.account}`).toString() !==
      authorInfo.password
    ) {
      return this.fail(3000, "原密码不正确！");
    }
  }
  getDetailAction() {
    this.allowMethods = "get";
  }
  saveAction() {
    this.allowMethods = "post";
  }
};
