const fs = require("fs");
const path = require("path");
const marked = require("marked");
const toc = require("markdown-toc");
const Base = require("./base.js");

module.exports = class extends Base {
  async getListAction() {
    try {
      const current = this.get("page") || 1;
      const search = this.get("search") || "";
      const pageList = await this.model("page").getList(current, search);
      return this.success(pageList);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async removeAction() {
    try {
      const id = this.post("id");
      await this.model("page").removeById(id);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async addAction() {
    try {
      const title = this.post("title");
      const pathname = this.post("pathname");
      const meta_description = this.post("description");
      const meta_keywords = this.post("keywords");
      const markdown = this.post("markdown");
      const style_list = this.post("styleList");
      const style_custom = this.post("styleCustom");
      const script_list = this.post("scriptList");
      const script_custom = this.post("scriptCustom");
      const layout = this.post("layout");
      const cover_url = this.post("cover");
      const allow_comment = this.post("allowComment") ? 1 : 0;
      const status = this.post("status");
      const richtext = marked(markdown, {
        headerIds: false
      });
      const created_date = think.datetime(new Date());
      await this.model("page").addPage({
        title,
        pathname,
        meta_description,
        meta_keywords,
        markdown,
        style_list,
        style_custom,
        script_list,
        script_custom,
        layout,
        cover_url,
        allow_comment,
        status,
        richtext,
        created_date
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getDetailAction() {
    try {
      const detail = await this.model("page").getDetailById(this.get("id"));
      return this.success(detail);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async saveAction() {
    try {
      const id = this.post("id");
      const title = this.post("title");
      const meta_description = this.post("description");
      const meta_keywords = this.post("keywords");
      const markdown = this.post("markdown");
      const style_list = this.post("styleList");
      const style_custom = this.post("styleCustom");
      const script_list = this.post("scriptList");
      const script_custom = this.post("scriptCustom");
      const layout = this.post("layout");
      const cover_url = this.post("cover");
      const allow_comment = this.post("allowComment") ? 1 : 0;
      const status = this.post("status");
      const richtext = marked(markdown, {
        headerIds: false
      });
      await this.model("page").savePage(id, {
        title,
        meta_description,
        meta_keywords,
        markdown,
        style_list,
        style_custom,
        script_list,
        script_custom,
        layout,
        cover_url,
        allow_comment,
        status,
        richtext
      });
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getLayoutAction() {
    try {
      const fileList = fs.readdirSync(
        path.join(think.ROOT_PATH, "www", "theme", "default", "layout")
      );
      return this.success(fileList);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  generateTocName(name) {
    name = name
      .trim()
      .replace(/\s+/g, "")
      .replace(/\)/g, "")
      .replace(/[(,]/g, "-")
      .toLowerCase();
    if (/^[\w-]+$/.test(name)) {
      return name;
    }
    return `toc-${think.md5(name).slice(0, 3)}`;
  }
};
