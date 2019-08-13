const path = require("path");
const Base = require("./base.js");

module.exports = class extends Base {
  async indexAction() {
    const currentPage = this.get("page") || 1;
    const postInfo = await this.model("post").getPostList(currentPage);
    if (currentPage == 1) {
      let layoutInfo = {};
      const options = await this.model("layout").getBasicLayoutOptions();
      for (let item of options) {
        layoutInfo[item.key] = item.value;
      }
      layoutInfo.banner = [];
      if (layoutInfo.show_banner == 1) {
        layoutInfo.banner = await this.model("banner").getList();
      }
      this.assign({
        layoutInfo,
        postInfo
      });
    } else {
      this.assign({
        postInfo
      });
    }

    return this.display(path.join(this.THEME_PATH, "index.njk"));
  }
};
