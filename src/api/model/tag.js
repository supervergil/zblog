module.exports = class extends think.Model {
  async getList(current) {
    // 两个result修复countSelect在join模式的页码错误问题

    const result = await this.where({ is_del: 0 })
      .page(current, 10)
      .countSelect();

    const result2 = await this.alias("a")
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
      .page(current, 10)
      .order({ id: "DESC" })
      .countSelect();

    result.data = result2.data;

    return result;
  }
  async getAll() {
    return await this.where({ is_del: 0 }).select();
  }
  async removeById(id) {
    await this.where({ id }).update({ is_del: 1 });
  }
  async addTag(info) {
    return await this.add(info);
  }
  async addTagList(list) {
    return await this.addMany(list);
  }
  async getDetailById(id) {
    return await this.where({ id, is_del: 0 }).find();
  }
  async save(info) {
    await this.update(info);
  }
};
