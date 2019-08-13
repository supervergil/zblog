module.exports = class extends think.Controller {
  async getInfoAction() {
    try {
      const user = await this.model("register_user").count("*");
      const post = await this.model("post")
        .where({
          is_del: 0,
          status: 1
        })
        .count("*");
      const comment = await this.model("comment")
        .where({
          is_del: 0
        })
        .count("*");
      const postList = await this.model("post").getList(1, "");
      return this.success({
        user,
        post,
        comment,
        postList
      });
    } catch (e) {
      this.status = 500;
      return this.fail(5000, "服务器内部错误！");
    }
  }
};
