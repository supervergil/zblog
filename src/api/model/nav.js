module.exports = class extends think.Model {
  async getList() {
    return await this.where({ is_del: 0 })
      .order({ index: "asc" })
      .select();
  }
  async removeById(id) {
    await this.where({ id }).update({ is_del: 1 });
  }
  async addNav(info) {
    await this.add(info);
  }
  async getDetailById(id) {
    return await this.where({ id, is_del: 0 }).find();
  }
  async save(info) {
    await this.update(info);
  }
};
