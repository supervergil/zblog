module.exports = class extends think.Controller {
  async removeAction() {
    try {
      await this.model("comment").removeComment({
        id: this.post("id")
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, "服务器内部错误！");
    }
  }
  async getListAction() {
    try {
      const commentList = await this.model("comment").getList(this.get("page"));
      return this.success(commentList);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, "服务器内部错误！");
    }
  }
};
