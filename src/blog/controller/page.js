const path = require("path");
const sha256 = require("crypto-js/sha256");
const marked = require("marked");
const timeago = require("timeago.js");
const Base = require("./base.js");

module.exports = class extends Base {
  async detailAction() {
    const pathname = this.get("page");
    const pageDetail = await this.model("page").getPageDetail(pathname);
    const commentInfo = await this.model("comment").getListByPathName({
      pathname: `/page/${pathname}.html`,
      page: 1
    });
    pageDetail.style_list = pageDetail.style_list
      .split(",")
      .filter(item => item.length > 0);
    pageDetail.script_list = pageDetail.script_list
      .split(",")
      .filter(item => item.length > 0);
    pageDetail.token = sha256(`${pageDetail.id}:zblog-post`).toString();
    commentInfo.data = commentInfo.data.map(item => {
      item.created_date = timeago.format(
        new Date(item.created_date.replace(/\-/g, "/")),
        "zh_CN"
      );
      return item;
    });
    this.assign({
      pageDetail,
      commentInfo
    });
    return this.display(path.join(this.THEME_PATH, "page.njk"));
  }
};
