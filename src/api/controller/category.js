const Base = require("./base.js");

module.exports = class extends Base {
  async getListAction() {
    try {
      const current = this.get("page") || 1;
      const categoryList = await this.model("category").getList(current);
      return this.success(categoryList);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getAllAction() {
    try {
      const categoryList = await this.model("category").getAll();
      return this.success(categoryList);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async removeAction() {
    try {
      const id = this.post("id");
      await this.model("category").removeById(id);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async addAction() {
    try {
      await this.model("category").addCategory({
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
      const detail = await this.model("category").getDetailById(this.get("id"));
      return this.success(detail);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveAction() {
    try {
      await this.model("category").save({
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
