module.exports = class extends think.Model {
  async getList() {
    return await this.where({ status: 1, is_del: 0 })
      .order({ index: "ASC" })
      .select();
  }
};
