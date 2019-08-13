const sha256 = require("crypto-js/sha256");
const Base = require("./base.js");

module.exports = class extends Base {
  async addCommentAction() {
    this.allowMethods = "post";

    let rules = {
      user_id: {
        required: true
      },
      pathname: {
        required: true
      },
      markdown: {
        required: true
      },
      is_admin: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }

    const postInfo = await this.model("post").findPostById(
      this.post("post_id")
    );

    if (think.isEmpty(postInfo)) {
      return this.fail(3000, "文章不存在或已被删除！");
    }

    if (postInfo.allow_comment === 0) {
      return this.fail(3000, "该文章评论已关闭！");
    }

    if (
      !sha256(`${this.post("post_id")}:zblog-post`).toString() ===
      this.post("post_token")
    ) {
      return this.fail(3000, "评论失败！");
    }
    if (!this.post("is_admin")) {
      const userInfo = await this.model("register_user").getUserById(
        this.post("user_id")
      );
      if (userInfo.allow_comment != 1) {
        return this.fail(3000, "当前用户已被禁言！");
      }
    }
  }
  async removeCommentAction() {
    this.allowMethods = "post";

    let rules = {
      id: {
        required: true
      },
      is_admin: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }

    if (!this.post("is_admin")) {
      const userInfo = await this.model("register_user").getUserById(
        this.header("user-id")
      );
      if (think.isEmpty(userInfo)) {
        return this.fail(3000, "当前用户不存在！");
      } else {
        if (userInfo.status != 1) {
          return this.fail(3000, "当前用户已被冻结！");
        }
        if (userInfo.allow_comment != 1) {
          return this.fail(3000, "当前用户已被禁言！");
        }
      }
    }
  }
  async getListAction() {
    this.allowMethods = "post";
    let rules = {
      page: {
        required: true
      },
      pathname: {
        required: true
      }
    };
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(3000, JSON.stringify(this.validateErrors.data));
    }
  }
};
