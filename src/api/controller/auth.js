const sha256 = require("crypto-js/sha256");
const md5 = require("crypto-js/md5");

const Base = require("./base.js");

module.exports = class extends Base {
  async loginAction() {
    try {
      const account = this.post("account");
      const password = sha256(
        `${this.post("password")}:zblog-${account}`
      ).toString();
      const user = await this.model("author").getUserByAccount(account);
      if (think.isEmpty(user)) {
        return this.fail(3000, "当前用户不存在！");
      }
      if (password !== user.password) {
        return this.fail(3000, "密码错误！");
      }
      const token = md5(
        `${user.id}${Math.random()}${user.password}`
      ).toString();
      await this.session("admin-info", {
        uid: user.id,
        token
      });
      return this.success({
        userInfo: {
          id: user.id,
          account: user.account,
          name: user.name,
          avatar: user.avatar_url
        },
        token
      });
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async logoutAction() {
    try {
      await this.session("admin-info", null);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  checkAction() {
    try {
      this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
