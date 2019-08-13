module.exports = class extends think.Model {
  async getList(current, search) {
    const result = await this.field(
      `
          id,
          title,
          pathname,
          layout,
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
  async addPage(info) {
    return await this.add(info);
  }
  async savePage(id, info) {
    return await this.where({
      id
    }).update(info);
  }
  async getDetailById(id) {
    return await this.where({ id, is_del: 0 }).find();
  }
};
