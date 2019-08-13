module.exports = class extends think.Model {
  async getList(current, search) {
    const result = await this.field(
      `
          id,
          author_id,
          type,
          contributor_id,
          reproduce_url,
          reproduce_name,
          title,
          pathname,
          summary,
          status,
          created_date
        `
    )
      .where({ "title|richtext": ["like", `%${search}%`], is_del: 0 })
      .order({
        created_date: "DESC"
      })
      .page(current, 10)
      .countSelect();
    return result;
  }
  async removeById(id) {
    await this.where({ id }).update({ is_del: 1 });
  }
  async addPost(info) {
    return await this.add(info);
  }
  async savePost(id, info) {
    return await this.where({
      id
    }).update(info);
  }
  async getDetailById(id) {
    const result = await this.where({ id, is_del: 0 }).find();
    const tags = await this.model("post_tag")
      .where({
        post_id: result.id
      })
      .select();
    const category = await this.model("post_category")
      .where({
        post_id: result.id
      })
      .find();
    result.tags = tags.map(item => item.tag_id);
    result.category = category.category_id;
    return result;
  }
};
