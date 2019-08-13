const Base = require("./base.js");

module.exports = class extends Base {
  async getToolListAction() {
    try {
      return this.success(await this.model("sidebar").getList());
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getToolAction() {
    try {
      return this.success(
        await this.model("sidebar").getDetail(this.get("id"))
      );
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async addToolAction() {
    try {
      await this.model("sidebar").addTool({
        name: this.post("name"),
        content: this.post("content"),
        mark: this.post("mark"),
        custom_style: this.post("custom_style"),
        custom_script: this.post("custom_script")
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async removeToolAction() {
    try {
      await this.model("sidebar").removeById(this.post("id"));
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveToolAction() {
    try {
      const options = {
        id: this.post("id"),
        content: this.post("content"),
        custom_style: this.post("custom_style"),
        custom_script: this.post("custom_script")
      };
      const info = await this.model("sidebar").getDetail(this.post("id"));
      if (info.is_system === 0) {
        options.name = this.post("name");
      }
      await this.model("sidebar").save(options);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getPtypeListAction() {
    try {
      return this.success(await this.model("ptype").getList());
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getToolByPIDAction() {
    try {
      return this.success(
        await this.model("sidebar").getToolByPID(this.get("id"))
      );
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async removeRelationAction() {
    try {
      await this.model("ptype_sidebar").removeById(this.post("id"));
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getRelationDetailAction() {
    try {
      return this.success(
        await this.model("ptype_sidebar").getDetail(this.get("id"))
      );
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveRelationAction() {
    try {
      await this.model("ptype_sidebar").save({
        id: this.post("id"),
        title: this.post("title"),
        custom_style: this.post("custom_style"),
        custom_script: this.post("custom_script")
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async addRelationAction() {
    try {
      await this.model("ptype_sidebar").addRelation({
        ptype_id: this.post("ptype_id"),
        sidebar_id: this.post("sidebar_id"),
        index:
          (await this.model("ptype_sidebar")
            .where({
              ptype_id: this.post("ptype_id")
            })
            .max("index")) + 1
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async moveRelationAction() {
    try {
      const sidebarList = this.post("sidebarList");
      this.model("ptype_sidebar").updateMany(
        sidebarList.map((item, index) => {
          return {
            id: item,
            index
          };
        })
      );
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
};
