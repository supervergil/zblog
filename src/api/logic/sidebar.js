const Base = require("./base.js");

module.exports = class extends Base {
  getToolListAction() {
    this.allowMethods = "get";
  }
  getToolAction() {
    this.allowMethods = "get";
  }
  addToolAction() {
    this.allowMethods = "post";
  }
  removeToolAction() {
    this.allowMethods = "post";
  }
  saveToolAction() {
    this.allowMethods = "post";
  }
  getPtypeListAction() {
    this.allowMethods = "get";
  }
  getToolByPIDAction() {
    this.allowMethods = "get";
  }
  removeRelationAction() {
    this.allowMethods = "post";
  }
  getRelationDetailAction() {
    this.allowMethods = "get";
  }
  saveRelationAction() {
    this.allowMethods = "post";
  }
  async addRelationAction() {
    this.allowMethods = "post";
    const result = await this.model("ptype_sidebar")
      .where({
        ptype_id: this.post("ptype_id"),
        sidebar_id: this.post("sidebar_id")
      })
      .find();
    if (!think.isEmpty(result)) {
      return this.fail("请不要添加重复的工具！");
    }
  }
  moveRelationAction() {
    this.allowMethods = "post";
  }
};
