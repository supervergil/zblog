const path = require("path");
const Base = require("./base.js");

module.exports = class extends Base {
  async detailAction() {
    const pathname = this.get("cate");
    const currentPage = this.get("page") || 1;
    const cateInfo = await this.model("category").getCateDetailByPathname(
      pathname
    );
    if (think.isEmpty(cateInfo)) {
      return this.action("404", "index");
    }
    const postInfo = await this.model("post").getPostListByCate(
      currentPage,
      pathname
    );
    this.assign({
      cateInfo,
      postInfo
    });
    return this.display(path.join(this.THEME_PATH, "cate.njk"));
  }
};
