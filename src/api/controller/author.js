const sha256 = require("crypto-js/sha256");
const md5 = require("crypto-js/md5");

const Base = require("./base.js");

module.exports = class extends Base {
  async modifyPasswordAction() {
    try {
      const userInfo = await this.session("admin-info");
      const authorInfo = await this.model("author").getUserById(userInfo.uid);
      const newPassword = this.post("newPassword");
      const password = sha256(
        `${newPassword}:zblog-${authorInfo.account}`
      ).toString();
      await this.model("author").modifyPassword(userInfo.uid, password);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getDetailAction() {
    try {
      const userInfo = await this.session("admin-info");
      const info = await this.model("author").getUserById(userInfo.uid);
      return this.success(info);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveAction() {
    try {
      const userInfo = await this.session("admin-info");
      const info = this.post("info");
      await this.model("author").save(userInfo.uid, info);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
