const Base = require("./base.js");

module.exports = class extends Base {
  getListAction() {
    this.allowMethods = "get";
    let rules = {
      page: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }
  }
  async removeAction() {
    this.allowMethods = "post";
    let rules = {
      id: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }
    const userId = this.header("user-id");
    const commentId = this.post("id");
    const commentInfo = await this.model("comment").getCommentById(commentId);
    if (think.isEmpty(commentInfo)) {
      return this.fail(3000, "评论不存在！");
    }
    if (commentInfo.user_id != userId) {
      return this.fail(3000, "你没有权限删除该评论！");
    }
  }
};
