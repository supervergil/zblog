const path = require("path");
const Base = require("./base.js");

module.exports = class extends Base {
  async indexAction() {
    const tagList = await this.model("tag").getAllTagList();
    this.assign({
      tagList
    });
    return this.display(path.join(this.THEME_PATH, "tags.njk"));
  }
  async detailAction() {
    const pathname = this.get("tag");
    const currentPage = this.get("page") || 1;
    const tagInfo = await this.model("tag").getTagDetailByPathname(pathname);
    if (think.isEmpty(tagInfo)) {
      return this.action("404", "index");
    }
    const postInfo = await this.model("post").getPostListByTag(
      currentPage,
      pathname
    );
    this.assign({
      tagInfo,
      postInfo
    });
    return this.display(path.join(this.THEME_PATH, "tag.njk"));
  }
};
