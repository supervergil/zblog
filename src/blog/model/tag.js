module.exports = class extends think.Model {
  async getAllTagList() {
    return await this.alias("a")
      .join({
        table: "post_tag",
        as: "c",
        on: ["id", "tag_id"]
      })
      .field(
        `
        a.id,
        a.name,
        a.pathname,
        a.description,
        count(c.post_id) as post_count
      `
      )
      .where({
        "a.is_del": 0
      })
      .group("a.id")
      .order({ post_count: "desc" })
      .select();
  }
  async getTagList() {
    return await this.alias("a")
      .join({
        table: "post_tag",
        as: "c",
        on: ["id", "tag_id"]
      })
      .field(
        `
        a.id,
        a.name,
        a.pathname,
        a.description,
        count(c.post_id) as post_count
      `
      )
      .where({
        "a.is_del": 0
      })
      .group("a.id")
      .limit(15)
      .order({ post_count: "desc" })
      .select();
  }
  async getTagDetailByPathname(pathname) {
    return await this.where({
      pathname,
      is_del: 0
    }).find();
  }
};
