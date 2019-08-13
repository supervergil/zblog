const Base = require("./base.js");

module.exports = class extends Base {
  async getListAction() {
    try {
      const navList = await this.model("nav").getList();
      return this.success(navList);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async removeAction() {
    try {
      await this.model("nav").removeById(this.post("id"));
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async addAction() {
    try {
      await this.model("nav").addNav({
        name: this.post("name"),
        url: this.post("url"),
        icon: this.post("icon"),
        type: this.post("type"),
        index:
          (await this.model("nav")
            .where({ type: this.post("type") })
            .max("index")) + 1
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getDetailAction() {
    try {
      const detail = await this.model("nav").getDetailById(this.get("id"));
      return this.success(detail);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveAction() {
    try {
      await this.model("nav").save({
        id: this.post("id"),
        name: this.post("name"),
        url: this.post("url"),
        icon: this.post("icon")
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async moveAction() {
    try {
      const navList = this.post("navList");
      const subNavList = this.post("subNavList");
      this.model("nav").updateMany([
        ...navList.map((item, index) => {
          return {
            id: item,
            index
          };
        }),
        ...subNavList.map((item, index) => {
          return {
            id: item,
            index
          };
        })
      ]);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
