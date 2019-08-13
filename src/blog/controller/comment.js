const marked = require("marked");
const timeago = require("timeago.js");

module.exports = class extends think.Controller {
  async addCommentAction() {
    try {
      await this.model("comment").addComment({
        user_id: this.post("user_id"),
        comment_id: this.post("comment_id"),
        pathname: this.post("pathname"),
        markdown: this.post("markdown"),
        richtext: marked(this.post("markdown"), {
          headerIds: false,
          sanitize: true
        }),
        is_admin: this.post("is_admin") ? 1 : 0,
        created_date: think.datetime(new Date())
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, "服务器内部错误！");
    }
  }
  async removeCommentAction() {
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
      const commentInfo = await this.model("comment").getListByPathName({
        page: this.post("page"),
        pathname: this.post("pathname")
      });
      commentInfo.data = commentInfo.data.map(item => {
        item.created_date = timeago.format(
          new Date(item.created_date.replace(/\-/g, "/")),
          "zh_CN"
        );
        return item;
      });
      return this.success(commentInfo);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, "服务器内部错误！");
    }
  }
};
