const Base = require("./base.js");

module.exports = class extends Base {
  async getListAction() {
    try {
      const current = this.get("page") || 1;
      const userList = await this.model("register_user").getList(current);
      return this.success(userList);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async freezeAction() {
    try {
      const id = this.post("id");
      const status = this.post("status");
      await this.model("register_user").freezeUser(id, status);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async shutupAction() {
    try {
      const id = this.post("id");
      const allow_comment = this.post("allow_comment");
      await this.model("register_user").shutupUser(id, allow_comment);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
