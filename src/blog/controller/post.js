const path = require("path");
const sha256 = require("crypto-js/sha256");
const marked = require("marked");
const timeago = require("timeago.js");
const Base = require("./base.js");

module.exports = class extends Base {
  async detailAction() {
    const pathname = this.get("post");
    const postDetail = await this.model("post").getPostDetail(pathname);
    const commentInfo = await this.model("comment").getListByPathName({
      pathname: `/post/${pathname}.html`,
      page: 1
    });
    postDetail.token = sha256(`${postDetail.id}:zblog-post`).toString();
    commentInfo.data = commentInfo.data.map(item => {
      item.created_date = timeago.format(
        new Date(item.created_date.replace(/\-/g, "/")),
        "zh_CN"
      );
      return item;
    });
    this.assign("activePath", `/cate/${postDetail.cate_path}`);
    this.assign({
      postDetail,
      commentInfo
    });
    return this.display(path.join(this.THEME_PATH, "post.njk"));
  }
};
