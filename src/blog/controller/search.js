const path = require("path");
const Base = require("./base.js");

module.exports = class extends Base {
  async indexAction() {
    let postInfo;
    const currentPage = this.get("page") || 1;
    const keyword = this.get("keyword");
    if (!think.isEmpty(keyword)) {
      postInfo = await this.model("post").getPostListBySearch(
        currentPage,
        keyword
      );
    } else {
      postInfo = false;
    }
    if (postInfo && postInfo.data.length === 0) {
      postInfo = false;
    }
    this.assign({
      postInfo,
      keyword
    });
    return this.display(path.join(this.THEME_PATH, "search.njk"));
  }
};
