const marked = require("marked");
const toc = require("markdown-toc");
const Base = require("./base.js");

module.exports = class extends Base {
  async getListAction() {
    try {
      const current = this.get("page") || 1;
      const search = this.get("search") || "";
      const postList = await this.model("post").getList(current, search);
      return this.success(postList);
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async removeAction() {
    try {
      const id = this.post("id");
      const status = (await this.model("post").getDetailById(id)).status;
      await this.model("post").removeById(id);
      const tagList = (await this.model("post_tag").getTagListByPostId(id)).map(
        item => item.id
      );
      // 逻辑删除不用同时删除tag和category关联关系
      // await this.model("post_category").removeByPostId(id);
      // await this.model("post_tag").removeByPostId(id);
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async addAction() {
    try {
      const author_id = (await this.session("admin-info")).uid;
      const title = this.post("title");
      const pathname = this.post("pathname");
      const markdown = this.post("markdown");
      const summary = this.post("summary");
      const cover_url = this.post("cover");
      const category = this.post("category");
      const reproduce_url = this.post("reproduceUrl");
      const reproduce_name = this.post("reproduceName");
      const reproduce_markdown = this.post("reproduceMarkdown");
      const reproduce_richtext = marked(reproduce_markdown, {
        headerIds: false
      });
      const type = this.post("type");
      const tags = this.post("tags");
      const allow_comment = this.post("allowComment") ? 1 : 0;
      const status = this.post("status");
      const tocContent = marked(toc(markdown).content, {
        headerIds: false
      }).replace(/<a\s+href="#([^"]+)">([^<>]+)<\/a>/g, (a, b, c) => {
        return `<a href="#${this.generateTocName(c)}">${c}</a>`;
      });
      const richtext = `<div class="toc">${tocContent}</div>${marked(markdown, {
        headerIds: false
      }).replace(/<h(\d)[^<>]*>(.*?)<\/h\1>/g, (a, b, c) => {
        return `<h${b}><a id="${this.generateTocName(
          c
        )}" class="anchor" href="#${this.generateTocName(c)}"></a>${c}</h${b}>`;
      })}`;
      const created_date = think.datetime(new Date());
      const updated_date = created_date;
      const postId = await this.model("post").addPost({
        author_id,
        type,
        reproduce_url,
        reproduce_name,
        reproduce_markdown,
        reproduce_richtext,
        cover_url,
        title,
        pathname,
        summary,
        markdown,
        richtext,
        allow_comment,
        status,
        created_date,
        updated_date
      });

      await this.model("post_category").addRelation(postId, category);
      const currentTags = (await this.model("tag").getAll()).map(
        item => item.id
      );
      const addTags = [];
      for (let i = 0; i < tags.length; i++) {
        if (!currentTags.includes(tags[i])) {
          addTags.push({
            name: tags[i],
            pathname: tags[i]
          });
          tags.splice(i--, 1);
        }
      }
      let addedIdList = [];
      if (addTags.length > 0) {
        addedIdList = await this.model("tag").addTagList(addTags);
      }
      if ([...tags, ...addedIdList].length > 0) {
        await this.model("post_tag").addRelation(postId, [
          ...tags,
          ...addedIdList
        ]);
      }
      return this.success();
    } catch (e) {
      this.status = 500;
      return this.fail(5000, `服务器内部错误！`);
    }
  }
  async getDetailAction() {
    try {
      const detail = await this.model("post").getDetailById(this.get("id"));
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
      const markdown = this.post("markdown");
      const summary = this.post("summary");
      const cover_url = this.post("cover");
      const category = this.post("category");
      const reproduce_url = this.post("reproduceUrl");
      const reproduce_name = this.post("reproduceName");
      const reproduce_markdown = this.post("reproduceMarkdown");
      const reproduce_richtext = marked(reproduce_markdown, {
        headerIds: false
      });
      const type = this.post("type");
      const tags = this.post("tags");
      const allow_comment = this.post("allowComment") ? 1 : 0;
      const status = this.post("status");
      const tocContent = marked(toc(markdown).content, {
        headerIds: false
      }).replace(/<a\s+href="#([^"]+)">([^<>]+)<\/a>/g, (a, b, c) => {
        return `<a href="#${this.generateTocName(c)}">${c}</a>`;
      });
      const richtext = `<div class="toc">${tocContent}</div>${marked(markdown, {
        headerIds: false
      }).replace(/<h(\d)[^<>]*>(.*?)<\/h\1>/g, (a, b, c) => {
        return `<h${b}><a id="${this.generateTocName(
          c
        )}" class="anchor" href="#${this.generateTocName(c)}"></a>${c}</h${b}>`;
      })}`;
      const updated_date = think.datetime(new Date());
      await this.model("post").savePost(id, {
        type,
        reproduce_url,
        reproduce_name,
        reproduce_markdown,
        reproduce_richtext,
        cover_url,
        title,
        summary,
        markdown,
        richtext,
        allow_comment,
        status,
        updated_date
      });
      await this.model("post_category").updateRelation(id, category);
      // 先删除原有的tag，然后新增所有的
      await this.model("post_tag").removeByPostId(id);
      const currentTags = (await this.model("tag").getAll()).map(
        item => item.id
      );
      const addTags = [];
      for (let i = 0; i < tags.length; i++) {
        if (!currentTags.includes(tags[i])) {
          addTags.push({
            name: tags[i],
            pathname: tags[i]
          });
          tags.splice(i--, 1);
        }
      }
      let addedIdList = [];
      if (addTags.length > 0) {
        addedIdList = await this.model("tag").addTagList(addTags);
      }
      if ([...tags, ...addedIdList].length > 0) {
        await this.model("post_tag").addRelation(id, [...tags, ...addedIdList]);
      }
      return this.success();
    } catch (e) {
      console.log(e);
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
