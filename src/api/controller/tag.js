const Base = require("./base.js");

module.exports = class extends Base {
  async getListAction() {
    try {
      const current = this.get("page") || 1;
      const tagList = await this.model("tag").getList(current);
      return this.success(tagList);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getAllAction() {
    try {
      const tagList = await this.model("tag").getAll();
      return this.success(tagList);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async removeAction() {
    try {
      const id = this.post("id");
      await this.model("tag").removeById(id);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async addAction() {
    try {
      await this.model("tag").addTag({
        name: this.post("name"),
        pathname: this.post("pathname"),
        description: this.post("description")
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getDetailAction() {
    try {
      const detail = await this.model("tag").getDetailById(this.get("id"));
      return this.success(detail);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveAction() {
    try {
      await this.model("tag").save({
        id: this.post("id"),
        name: this.post("name"),
        pathname: this.post("pathname"),
        description: this.post("description")
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
