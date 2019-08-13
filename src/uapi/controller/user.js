const sha256 = require("crypto-js/sha256");
const md5 = require("crypto-js/md5");

const Base = require("./base.js");

module.exports = class extends Base {
  async modifyPasswordAction() {
    try {
      const id = this.header("user-id");
      const authorInfo = await this.model("register_user").getUserById(id);
      const newPassword = this.post("newPassword");
      const password = sha256(
        `${newPassword}:zblog-${authorInfo.email}`
      ).toString();
      await this.model("register_user").modifyPassword(id, password);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getDetailAction() {
    try {
      const id = this.header("user-id");
      const info = await this.model("register_user").getUserById(id);
      return this.success(info);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveAction() {
    try {
      const id = this.header("user-id");
      const info = this.post("info");
      await this.model("register_user").save(id, info);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
