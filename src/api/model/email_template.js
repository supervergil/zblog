module.exports = class extends think.Model {
  async getList() {
    return await this.select();
  }
  async getDetailById(id) {
    return await this.where({ id }).find();
  }
  async save(info) {
    await this.update(info);
  }
};
