module.exports = class extends think.Model {
  async getList(current) {
    return await this.where("1=1")
      .page(current, 10)
      .countSelect();
  }
  async freezeUser(id, status) {
    return await this.where({ id }).update({ status });
  }
  async shutupUser(id, allow_comment) {
    return await this.where({ id }).update({ allow_comment });
  }
};
