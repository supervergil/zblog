const Base = require("./base.js");

module.exports = class extends Base {
  async addPraiseAction() {
    this.allowMethods = "post";

    let rules = {
      userId: {
        required: true
      },
      postId: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }

    const userId = this.post("userId");
    const postId = this.post("postId");
    const postInfo = await this.model("post").findPostById(postId);
    if (think.isEmpty(postInfo)) {
      return this.fail(3000, "文章不存在！");
    }
    const info = await this.model("praise").getPraiseByUserAndPost(
      userId,
      postId
    );
    if (!think.isEmpty(info)) {
      return this.fail(3000, "您已点赞本文！");
    }
  }
};
